const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.addTask = async (req, res) => {
    try {
        const { title } = req.body;
        const newTask = new Task({ userId: req.userId, title });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
