require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./taskModel');

const app = express();
const PORT = process.env.PORT || 5001;
const publicDir = __dirname;
const mongoUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager';
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next();
};

const requireJsonContentType = (req, res, next) => {
  const isJsonRequest = req.is('application/json');

  if ((req.method === 'POST' || req.method === 'PUT') && !isJsonRequest) {
    return res.status(415).json({
      success: false,
      error: 'Content-Type must be application/json',
    });
  }

  next();
};

const formatValidationError = (error) => {
  const details = {};

  Object.keys(error.errors || {}).forEach((key) => {
    details[key] = error.errors[key].message;
  });

  return {
    success: false,
    error: 'Validation failed',
    details,
  };
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID format',
    });
  }

  next();
};

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(express.static(publicDir));
app.use(requestLogger);

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/tasks', requireJsonContentType, async (req, res, next) => {
  try {
    const { title, description = '', completed = false, priority = 'medium' } = req.body;

    const newTask = new Task({
      title,
      description,
      completed: Boolean(completed),
      priority,
    });

    const savedTask = await newTask.save();

    return res.status(201).json({
      success: true,
      data: savedTask,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(error));
    }

    next(error);
  }
});

app.put('/tasks/:id', validateObjectId, requireJsonContentType, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    const { title, description, completed, priority } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = Boolean(completed);
    if (priority !== undefined) task.priority = priority;

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(error));
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format',
      });
    }

    next(error);
  }
});

app.delete('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

app.use((error, req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload',
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID format',
    });
  }

  console.error('Unhandled error:', error.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
