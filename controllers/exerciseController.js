const User = require('../models/User');
const Exercise = require('../models/Exercise');

exports.addExercise = async (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req.params._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const exercise = new Exercise({
            userId,
            description,
            duration: Number(duration),
            date: date ? new Date(date) : new Date(),
        });

        await exercise.save();

        res.json({
            _id: user._id,
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
        });
    } catch (err) {
        res.status(500).json({ error: 'Error adding exercise' });
    }
};

exports.getExerciseLogs = async (req, res) => {
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let dateFilter = {};
        if (from) {
            dateFilter.$gte = new Date(from);
        }
        if (to) {
            dateFilter.$lte = new Date(to);
        }

        let query = Exercise.find({ userId });
        if (Object.keys(dateFilter).length > 0) {
            query = query.where('date').gte(dateFilter.$gte).lte(dateFilter.$lte);
        }
        if (limit) {
            query = query.limit(Number(limit));
        }

        const exercises = await query.exec();

        const log = exercises.map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString(),
        }));

        res.json({
            _id: user._id,
            username: user.username,
            count: exercises.length,
            log: log,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching exercise log' });
    }
};
