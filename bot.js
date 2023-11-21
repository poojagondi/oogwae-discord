const { Client, IntentsBitField } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
const prefix = "!"; // You can change the prefix to whatever you like

let todos = [];
const db = new sqlite3.Database("todos.db");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Create a table to store todos if it doesn't exist
  db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    title TEXT,
    state INTEGER,
    creator TEXT
  )
`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  if (message.content.startsWith(prefix)) {
    const commandName = message.content.split(" ")[0].replace(prefix, "");

    // message.content will look like "!addtodo need to drink water"

    if (commandName === "todo-add") {
      const todoTitle = message.content.replace(`!${commandName} `, "");
      const todo = {
        title: todoTitle,
        state: 0,
        id: todos.length + 1,
        creator: message.author.username,
      };
      db.run(
        "INSERT INTO todos (title, state, creator) VALUES (?, ?, ?)",
        [todo.title, todo.state, todo.creator],
        function (err) {
          if (err) {
            return console.error(err.message);
          }
          message.reply("Todo added");
        }
      );
    }

    if (commandName === "todo-ls") {
      db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
          throw err;
        }
        const todosList = rows.map(
          (todo) =>
            `${todo.id}. ${todo.title} - ${todo.state ? "completed" : "incomplete"} by ${todo.creator}`
        );
        message.reply(todosList.join("\n") || "No todos found");
      });
    }

    // message.content will look like "!todo-del 1"
    if (commandName === "todo-del") {
      const id = message.content.replace(`!${commandName} `, "");
      const todoBackup = todos.find((x) => x.id === Number(id));
      db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
        if (err) {
          return console.error(err.message);
        }
    
        if (this.changes > 0) {
          message.reply(`Deleted todo with ID ${id}`);
        } else {
          message.reply("Todo not found");
        }
      });
      
    }

    // update a todo state "!todo-toggle 1" this should toggle the state of todo whos id === 1
    if (commandName === "todo-toggle") {
      const id = message.content.replace(`!${commandName} `, "");

      db.run("UPDATE todos SET state = 1 - state WHERE id = ?", [id], function (err) {
        if (err) {
          return console.error(err.message);
        }
    
        if (this.changes > 0) {
          message.reply(`Toggled todo state with ID ${id}`);
        } else {
          message.reply("Todo not found");
        }
      });
    }
    // if any command is given as todo-update 1 < new title > then it should update
    if (commandName === "todo-update") {
      const parts = message.content.replace(`!${commandName} `, "").split(" ");
      const id = parts[0];
      const newTitle = parts.slice(1).join(" ");
    
      // Update the todo's title in the database
      db.run("UPDATE todos SET title = ? WHERE id = ?", [newTitle, id], function (err) {
        if (err) {
          return console.error(err.message);
        }
    
        if (this.changes > 0) {
          message.reply(`Updated title of todo with ID ${id}`);
        } else {
          message.reply("Todo not found");
        }
      });
    }
  }
});

client.login(
  "MTE1OTc2OTc1MzMyNjQ2OTE2MA.GJj0ma.zNw93fdj4KUfZQTBnoiVvR3QnuFmmTdipf0xgE"
);
