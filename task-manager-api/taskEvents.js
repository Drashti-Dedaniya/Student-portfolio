const { EventEmitter } = require('node:events');

const taskEvents = new EventEmitter();
const recentNotifications = [];

taskEvents.on('task-created', (taskData) => {
  // EventEmitter listeners run synchronously, so defer the notification work
  // to the next event-loop turn to let the API send its response first.
  setImmediate(() => {
    const notification = {
      title: taskData.title,
      timestamp: new Date().toISOString(),
      assignedUser: taskData.assignedUser,
      apiResponsePoint: taskData.apiResponsePoint,
    };

    recentNotifications.unshift(notification);
    recentNotifications.length = Math.min(recentNotifications.length, 20);

    console.log(`Notification listener executed: ${notification.timestamp}`);
    console.log('New task notification:', notification);
  });
});

taskEvents.getRecentNotifications = (assignedUser) =>
  recentNotifications.filter((notification) => notification.assignedUser === assignedUser);

module.exports = taskEvents;
