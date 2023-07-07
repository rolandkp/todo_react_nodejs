const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist',
});

connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});


const createTodoTable = `CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  completed BOOLEAN DEFAULT false,
  completedAt Date,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createTodoTable, (err) => {
  if (err) {
    console.error('Failed to create todos table:', err);
  }
});

module.exports = connection;


