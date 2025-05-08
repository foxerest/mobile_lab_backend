exports.getCategories = async (req, res) => {
    try {
        res.json(req.user.categories);
    } catch (err) {
        res.status(500).json({ message: 'Не вдалося отримати категорії', error: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = req.user.categories.id(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Категорію не знайдено' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Помилка при пошуку категорії', error: err.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: 'Назва категорії є обовʼязковою' });
        }

        const exists = req.user.categories.some(
            cat => cat.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (exists) {
            return res.status(409).json({ message: 'Категорія з такою назвою вже існує' });
        }

        req.user.categories.push({ name: name.trim() });
        await req.user.save();

        const added = req.user.categories.slice(-1)[0];
        res.status(201).json({ message: 'Категорію додано', category: added });
    } catch (err) {
        res.status(400).json({ message: 'Не вдалося додати категорію', error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: 'Назва категорії є обовʼязковою' });
        }

        const category = req.user.categories.id(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Категорію не знайдено' });
        }

        const duplicate = req.user.categories.some(
            cat =>
                cat.name.toLowerCase() === name.trim().toLowerCase() &&
                cat._id.toString() !== req.params.id
        );

        if (duplicate) {
            return res.status(409).json({ message: 'Категорія з такою назвою вже існує' });
        }

        category.name = name.trim();
        await req.user.save();

        res.json({ message: 'Категорію оновлено', category });
    } catch (err) {
        res.status(400).json({ message: 'Не вдалося оновити категорію', error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const categoryToDelete = req.user.categories.id(categoryId);
        if (!categoryToDelete) {
            return res.status(404).json({ message: 'Категорію не знайдено' });
        }

        let generalCategory = req.user.categories.find(
            c => c.name === 'General'
        );

        console.log(generalCategory);

        if (!generalCategory) {
            req.user.categories.push({ name: 'General' });
            await req.user.save();
            generalCategory = req.user.categories.find(c => c.name === 'General');
        }

        req.user.tasks.forEach(task => {
            if (task.category?.toString() === categoryId) {
                task.category = generalCategory._id;
            }
        });

        req.user.categories = req.user.categories.filter(
            c => c._id.toString() !== categoryId
        );

        await req.user.save();

        res.json({ message: 'Категорію видалено, завдання оновлено' });
    } catch (err) {
        res.status(500).json({
            message: 'Не вдалося видалити категорію',
            error: err.message,
        });
    }
};
