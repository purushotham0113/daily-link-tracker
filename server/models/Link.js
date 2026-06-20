const mongoose = require('mongoose');
const validator = require('validator');

const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: (value) =>
        validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true,
        }),
      message: 'Please provide a valid URL (http:// or https://)',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Link', linkSchema);
