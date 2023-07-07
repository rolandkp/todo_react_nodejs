const express = require('express');
const app = express();
const port = 3020;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const connection = require('./db');

app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyTodo API',
      version: '1.0.0',
      description: 'API endpoints for the MyTodo app',
    },
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management
 * 
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the todo.
 *         title:
 *           type: string
 *           description: The title of the todo.
 *         description:
 *           type: string
 *           description: The description of the todo.
 *         completed:
 *           type: boolean
 *           description: Indicates whether the todo is completed or not.
 * 
 *     TodoInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the todo.
 *         description:
 *           type: string
 *           description: The description of the todo.
 *       required:
 *         - title
 *         - description
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos.
 *     tags:
 *       - Todos
 *     responses:
 *       '200':
 *         description: Successful response with array of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *
 *   post:
 *     summary: Create a new todo.
 *     tags:
 *       - Todos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       '201':
 *         description: Successful response with the newly created todo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.get('/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body;

  connection.query(
    'INSERT INTO todos (title, description) VALUES (?, ?)',
    [title, description],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        const newTodo = {
          id: result.insertId,
          title,
          description,
          completed: false,
        };
        res.status(201).json(newTodo);
      }
    }
  );
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *```javascript
/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID.
 *     tags:
 *       - Todos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the todo to update.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       '200':
 *         description: Successful response with a message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed,completedat } = req.body;

  connection.query(
    'UPDATE todos SET title = ?, description = ?, completed = ? , completedat=? WHERE id = ?',
    [title, description, completed,completedat, id],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Todo not found' });
      } else {
        res.json({ message: 'Todo updated successfully' });
      }
    }
  );
});
/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a to-do item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the to-do item
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
app.delete('/todos/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'DELETE FROM todos WHERE id = ?';
  
    connection.query(query, itemId, (err, result) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Item deleted' });
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
