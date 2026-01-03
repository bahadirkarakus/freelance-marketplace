const db = require('./database');
const { createNotification } = require('./utils/helpers');

// Test notification
createNotification(
  47, // Johnny (client)
  'completion',
  '✅ Test: Freelancer submitted work for "Test Project". Review and approve to release payment.',
  14
);

setTimeout(() => {
  db.all('SELECT * FROM notifications WHERE type = "completion" ORDER BY id DESC LIMIT 3', [], (err, rows) => {
    console.log('Completion notifications:', JSON.stringify(rows, null, 2));
    db.close();
  });
}, 1000);
