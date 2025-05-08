exports.getTasks = async (req, res) => {
    try {
        res.json(req.user.tasks);
    } catch (err) {
        res.status(500).json({ message: 'Не вдалося отримати завдання', error: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = req.user.tasks.id(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Помилка при пошуку завдання', error: err.message });
    }
};

exports.addTask = async (req, res) => {
    try {
        req.user.tasks.push(req.body);
        await req.user.save();
        res.status(201).json({ message: 'Завдання додано успішно', task: req.user.tasks.slice(-1)[0] });
    } catch (err) {
        res.status(400).json({ message: 'Не вдалося додати завдання', error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = req.user.tasks.id(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        Object.assign(task, req.body);
        await req.user.save();

        res.json({ message: 'Завдання оновлено', task });
    } catch (err) {
        res.status(400).json({ message: 'Не вдалося оновити завдання', error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskIndex = req.user.tasks.findIndex(t => t._id.toString() === req.params.id);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Завдання не знайдено' });
        }

        req.user.tasks.splice(taskIndex, 1);
        await req.user.save();

        res.json({ message: 'Завдання видалено' });
    } catch (err) {
        res.status(500).json({ message: 'Помилка при видаленні завдання', error: err.message });
    }
};
