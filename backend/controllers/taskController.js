const Task = require('../models/taskModel');

//GET- /api/tasks

const getTasks = async (req, res) => {
    const tasks = await Task.find()
        .populate('lead', 'name email')
        .populate('assignedTo', 'name')
        .sort({ dueDate: 1 });
    res.json(tasks);
};

//POST- /api/tasks

const createTask = async (req, res) => {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    

}

//Only the assigned user can update task status

const updateTaskStatus = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ msg: 'Task not found' })
    }
    if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Only the assigned user can update this task' });
    }
    task.status = req.body.status;
    await task.save();
    res.json(task);
};

module.exports = { createTask, getTasks, updateTaskStatus };