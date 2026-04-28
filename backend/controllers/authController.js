const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const generateToken = (id) => {
    return (
        jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    )
}

//GET- /users/getUser

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//POST -/api/auth/register
const register = async (req, res,next) => {
    try{
         const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ msg: 'Email already in use' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
    }
    catch(err){
        next(err)
    }
 };

//POST- /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ msg: 'Invalid email or password' });
    }
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
};

//GET- api/auth/me
const getMe = async (req, res) => {
    res.json(req.user)
}

module.exports={register,login,getMe,getUsers};
