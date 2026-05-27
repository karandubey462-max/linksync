const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a link title'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true,
      validate: {
        validator(value) {
          try {
            const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
            return Boolean(parsed.hostname && parsed.hostname.includes('.'));
          } catch {
            return false;
          }
        },
        message: 'Please add a valid URL',
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Link', linkSchema);
