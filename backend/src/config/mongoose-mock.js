const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', '..', 'mock-db.json');

// Ensure db file exists with initial structure
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], links: [] }, null, 2));
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (err) {
    return { users: [], links: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
    this.methods = {};
    this.hooks = { pre: {} };
  }
  
  pre(hookName, fn) {
    this.hooks.pre[hookName] = this.hooks.pre[hookName] || [];
    this.hooks.pre[hookName].push(fn);
  }
}

Schema.Types = {
  ObjectId: String
};

class MockModel {
  constructor(data, hooks, methods, collectionName) {
    this._modifiedPaths = new Set();
    this._hooks = hooks;
    this._methods = methods;
    this._collectionName = collectionName;

    if (data) {
      for (const [key, val] of Object.entries(data)) {
        this[key] = val;
        this._modifiedPaths.add(key);
      }
    }

    if (!this._id) {
      this._id = generateId();
      this._modifiedPaths.add('_id');
    }

    // Bind custom instance methods
    for (const [name, fn] of Object.entries(methods || {})) {
      this[name] = fn.bind(this);
    }

    // Proxy to track property modifications
    return new Proxy(this, {
      get(target, prop) {
        return target[prop];
      },
      set(target, prop, value) {
        if (!prop.startsWith('_') && target[prop] !== value) {
          target._modifiedPaths.add(prop);
        }
        target[prop] = value;
        return true;
      }
    });
  }

  isModified(field) {
    return this._modifiedPaths.has(field);
  }

  get id() {
    return this._id;
  }

  async save() {
    // Run pre-save hooks (e.g. password hashing)
    if (this._hooks && this._hooks.pre && this._hooks.pre.save) {
      for (const fn of this._hooks.pre.save) {
        await new Promise((resolve, reject) => {
          fn.call(this, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    const db = readDB();
    const collection = db[this._collectionName];
    const index = collection.findIndex(item => item._id === this._id);

    // Prepare plain object for writing
    const plainData = {};
    for (const [key, val] of Object.entries(this)) {
      if (!key.startsWith('_') && typeof val !== 'function') {
        plainData[key] = val;
      }
    }
    plainData._id = this._id;

    if (index >= 0) {
      collection[index] = plainData;
    } else {
      collection.push(plainData);
    }

    writeDB(db);
    this._modifiedPaths.clear();
    return this;
  }

  async deleteOne() {
    const db = readDB();
    db[this._collectionName] = db[this._collectionName].filter(item => item._id !== this._id);
    writeDB(db);
    return { deletedCount: 1 };
  }

  toJSON() {
    const plainData = {};
    for (const [key, val] of Object.entries(this)) {
      if (!key.startsWith('_') && typeof val !== 'function') {
        plainData[key] = val;
      }
    }
    plainData._id = this._id;
    return plainData;
  }
}

function createModelClass(modelName, schema) {
  const collectionName = modelName.toLowerCase() + 's';

  const db = readDB();
  if (!db[collectionName]) {
    db[collectionName] = [];
    writeDB(db);
  }

  class Model extends MockModel {
    constructor(data) {
      super(data, schema.hooks, schema.methods, collectionName);
    }

    static find(query) {
      const db = readDB();
      let items = db[collectionName];

      if (query && Object.keys(query).length > 0) {
        items = items.filter(item => {
          return Object.entries(query).every(([key, value]) => {
            if (typeof item[key] === 'string' && typeof value === 'string') {
              return item[key].toLowerCase() === value.toLowerCase();
            }
            return item[key] == value;
          });
        });
      }

      const results = items.map(item => {
        const doc = new Model(item);
        doc._modifiedPaths.clear();
        return doc;
      });

      // Chainable promise wrapper
      const promise = Promise.resolve(results);
      
      promise.sort = function(sortQuery) {
        const [[field, direction]] = Object.entries(sortQuery);
        results.sort((a, b) => {
          if (a[field] < b[field]) return direction === -1 ? 1 : -1;
          if (a[field] > b[field]) return direction === -1 ? -1 : 1;
          return 0;
        });
        return promise;
      };

      promise.select = function() {
        return promise;
      };

      return promise;
    }

    static findOne(query) {
      const db = readDB();
      const items = db[collectionName].filter(item => {
        return Object.entries(query).every(([key, value]) => {
          if (typeof item[key] === 'string' && typeof value === 'string') {
            return item[key].toLowerCase() === value.toLowerCase();
          }
          return item[key] == value;
        });
      });

      const found = items[0] || null;
      const doc = found ? new Model(found) : null;
      if (doc) {
        doc._modifiedPaths.clear();
      }

      const promise = Promise.resolve(doc);

      promise.sort = function(sortQuery) {
        if (items.length > 1) {
          const [[field, direction]] = Object.entries(sortQuery);
          items.sort((a, b) => {
            if (a[field] < b[field]) return direction === -1 ? 1 : -1;
            if (a[field] > b[field]) return direction === -1 ? -1 : 1;
            return 0;
          });
        }
        const sortedFound = items[0] ? new Model(items[0]) : null;
        if (sortedFound) sortedFound._modifiedPaths.clear();
        return Promise.resolve(sortedFound);
      };

      promise.select = function() {
        return promise;
      };

      return promise;
    }

    static findById(id) {
      return this.findOne({ _id: id });
    }

    static async create(data) {
      if (Array.isArray(data)) {
        const results = [];
        for (const item of data) {
          const doc = new Model(item);
          await doc.save();
          results.push(doc);
        }
        return results;
      } else {
        const doc = new Model(data);
        await doc.save();
        return doc;
      }
    }
  }

  return Model;
}

const models = {};

module.exports = {
  Schema,
  model: function(name, schema) {
    if (!models[name]) {
      models[name] = createModelClass(name, schema);
    }
    return models[name];
  },
  connect: async function() {
    console.log('✨ Connected to Mock Local File Database (mock-db.json)');
    return { connection: { host: 'localhost-mock-db' } };
  }
};
