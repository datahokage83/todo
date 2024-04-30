const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://deepakbaligar83:todo123@cluster83.inggkqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster83", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to db"))
    .catch(err => {
        console.error("Error connecting to db:", err);
        process.exit(1); // Exit the process if unable to connect to the database
    });

const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ error: "Error fetching todos" });
    }
});

app.post('/todo/new', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text
        });
        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({ error: "Error creating todo" });
    }
});

app.delete('/todo/delete/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(todo);
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: "Error deleting todo" });
    }
});

app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        todo.complete = !todo.complete;
        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Error updating todo" });
    }
});

app.listen(3001, () => console.log("Server started on port 3001"));
