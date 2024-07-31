const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { username } = req.body;
    try {
        const newUser = new User({ username });
        const savedUser = await newUser.save();
        res.json({
            username: savedUser.username,
            _id: savedUser._id
        });

    } catch (err) {
        console.error('error');
        res.status(500).json({ error: 'Error creating new user' });
    }
};

//  get all users 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username _id');
        res.json(users);

    } catch (err) {
        // console.error('Error');
        res.status(500).json({ error: 'Error fetching users' });
    }
};