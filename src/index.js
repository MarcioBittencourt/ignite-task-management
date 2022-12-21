const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "Nome de usuario não encontrado" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (users.some((user) => user.username === username)) {
    respo = response.status(400).json({ error: "Nome de usuario já cadastrado" });
  } else {
    const user = {
      id: uuidv4(),
      name: name,
      username: username,
      todos: []
    };
    users.push(user);
    respo = response.status(201).json(user);
  }
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {
    title,
    deadline,
  } = request.body;

  const { user } = request;

  if(user.todos.some((todo) => todo.title === title)) {  
    respo = response.status(400).json({error: "Titulo já cadastrado"});
  } else {
    const todo = {
      id: uuidv4(),
      title: title,
      done: false,
      created_at: new Date(),
      deadline: deadline
    }
    user.todos.push(todo);
    respo = response.status(201).json(todo);
  }

  return respo;
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const {
    title,
    deadline
  } = request.body;

  const { user } = request;

  if(user.todos.some((todo) => todo.id === id)) {
    respo = response.status(404).json({error: "Todo não existe"});
  } else {
    todoEdit = {
      title: title,
      deadline: deadline
    };
    todo = user.todos.find((todo) => todo.id === id);
    Object.assign(todo, todoEdit);

    respo =  response.status(200).json(todo);
  }

  return respo;
});

app.patch('/todos/:id/:done', checksExistsUserAccount, (request, response) => {
  const {
    id,
    done
  } = request.params;
  const { user } = request;

  todo = user.todos.find((todo) => todo.id === id);

  todoEdit = {
    done: true
  };

  Object.assign(todo, todoEdit);

  return response.status(200).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;

  const { user } = request;

  if(user.todos.some((todo) => todo.id === id)) {
    respo = response.status(404).json({error: "Todo não existe"});
  } else {
    index = user.todos.findIndex((todo) => todo.id === id);
    todoDeleted = user.todos.splice(index, 1);

    respo = response.status(200).json(todoDeleted);
  }

  return respo;
});

module.exports = app;