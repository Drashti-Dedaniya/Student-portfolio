const test = require('node:test');
const assert = require('node:assert/strict');
const taskEvents = require('../taskEvents');

test('task-created notification runs asynchronously and includes task details', async () => {
  const assignedUser = `ci-${process.pid}@example.test`;
  const taskData = {
    title: 'CI event test task',
    assignedUser,
    apiResponsePoint: new Date().toISOString(),
  };

  taskEvents.emit('task-created', taskData);

  // The listener uses setImmediate, so it has not populated the notifications yet.
  assert.deepEqual(taskEvents.getRecentNotifications(assignedUser), []);

  await new Promise((resolve) => setImmediate(resolve));

  const [notification] = taskEvents.getRecentNotifications(assignedUser);
  assert.ok(notification, 'the deferred listener should create a notification');
  assert.equal(notification.title, taskData.title);
  assert.equal(notification.assignedUser, assignedUser);
  assert.equal(notification.apiResponsePoint, taskData.apiResponsePoint);
  assert.ok(Number.isFinite(Date.parse(notification.timestamp)));
  assert.ok(Date.parse(notification.timestamp) >= Date.parse(taskData.apiResponsePoint));
});
