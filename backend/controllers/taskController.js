const Task = require("../schemas/Task");

/**
 * Get all tasks for the authenticated user.
 * @route GET /api/tasks
 * @access Private (Requires JWT)
 * @returns {Object[]} List of tasks for the user
 */
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Add a new task for the authenticated user.
 * @route POST /api/tasks
 * @access Private (Requires JWT)
 * @body {string} title - The title of the new task
 * @returns {Object} Newly created task
 */
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

/**
 * Update an existing task by ID for the authenticated user.
 * @route PUT /api/tasks/:id
 * @access Private (Requires JWT)
 * @param {string} req.params.id - The ID of the task to update
 * @body {string} [title] - New title for the task
 * @body {boolean} [completed] - New completed status
 * @returns {Object} Updated task object
 */
exports.updateTask = async (req, res) => {
    try {
      const { title, completed } = req.body;  
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Delete a task by ID for the authenticated user.
 * @route DELETE /api/tasks/:id
 * @access Private (Requires JWT)
 * @param {string} req.params.id - The ID of the task to delete
 * @returns {Object} Success message
 */
exports.deleteTask = async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
