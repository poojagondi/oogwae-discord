const todos = [
  {
    id: 1,
    title: "Buy brain",
    state: false,
  },
  {
    id: 2,
    title: "Drink Water",
    state: true,
  },
  {
    id: 3,
    title: "Stare off into space",
    state: true,
  },
  {
    id: 4,
    title: "No",
    state: false,
  },
];

// add a todo
todos.push({
  id: todos.length + 1,
  title: "No bnrain",
  state: false,
});

// removing a todo
const id = 3
const newFilteredTodosList = todos.filter((todo) => {
  return todo.id !== 3
});

