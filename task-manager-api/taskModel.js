const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

taskSchema.pre('save', function preSave(next) {
  if (this.isModified('title') && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
