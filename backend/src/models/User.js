const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9_]{3,20}$/, 'Username can only contain letters, numbers, and underscores, between 3-20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      default: '',
    },
    avatar: {
      type: String, // Stored as base64 string
      default: '',
    },
    accentColor: {
      type: String,
      default: '#6366f1', // Default Indigo-500
    },
    selectedTheme: {
      type: String,
      enum: ['minimal', 'dark', 'neon'],
      default: 'minimal',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// Compare password entered by user to hashed password in db
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
