const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateTokens = (payload) => {
    const { _id } = payload;
    console.log(_id);

    const accessToken = jwt.sign({ userId: _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
    const refreshToken = jwt.sign({ userId: _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10h' });

    return { accessToken, refreshToken };
};

const updateRefreshToken = async (user, refreshToken) => {
    const { email, password } = user;
    console.log(refreshToken);
    try {
        let updatedRefreshToken = {
            email,
            password,
            refreshToken: refreshToken,
        };
        console.log(updatedRefreshToken);

        const userUpdateCondition = { _id: user._id };

        updatedRefreshToken = await User.findByIdAndUpdate(userUpdateCondition, updatedRefreshToken, { new: true });
        console.log(updatedRefreshToken);

        if (!updatedRefreshToken) console.log('can not update refreshToken');
    } catch (error) {
        console.log(error);
    }
};

const authCtrl = {
    register: async (req, res) => {
        const {
            values: { email, name, phone, gender, BirthDay, pass, confirmpass },
        } = req.body;
        //simple validation
        if (!email || !pass) return res.status(400).json({ success: false, message: 'Missing email or password' });

        try {
            const user = await User.findOne({ email: email });
            if (user) return res.status(400).json({ success: false, message: 'email already taken' });

            if (pass !== confirmpass)
                return res.status(400).json({ success: false, message: 'Password does not match' });

            // all good
            const hashedPassword = await bcrypt.hash(pass, 12);

            const newUser = new User({
                email: email,
                name: name,
                mobile: phone,
                gender: gender,
                dateofbirth: BirthDay,
                password: hashedPassword,
            });
            jwt;
            const tokens = generateTokens(newUser);

            await newUser.save();

            res.json({
                success: true,
                message: 'user created successfully!',
                // tokens,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email ' });

        try {
            // check user existing
            const user = await User.findOne({ email }).populate('following followers');
            if (!user) return res.status(400).json({ success: false, message: 'Incorrect email' });

            const passwordValid = await bcrypt.compare(password, user.password);

            if (!passwordValid) return res.status(400).json({ success: false, message: 'Incorrect  password' });

            // all  good
            // return token
            const tokens = generateTokens(user);

            //update refressh token
            //updateRefreshToken(user, tokens.refreshToken)

            res.json({
                success: true,
                currentUser: user,
                message: 'User logged in successfully',
                tokens,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Interal server error' });
        }
    },
    token: async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.status(401).json({ success: false, message: 'Missing refreshToken' });

        try {
            const user = await User.findOne({ refreshToken });
            if (!user) return res.status(403).json({ success: false, message: 'Not found user' });

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const tokens = generateTokens(user);
            updateRefreshToken(user, tokens.refreshToken);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    logout: async (req, res) => {
        if (req.userId) {
            return res.status(200).json('Logged out!');
        } else {
            return res.status(500).json('Internal server error!');
        }
    },
};

module.exports = authCtrl;
