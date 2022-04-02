const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateTokens = (payload) => {
  const { username, password } = payload;

  const accessToken = jwt.sign(
    { username, password },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15s' }
  );
  const refreshToken = jwt.sign(
    { username, password },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '5m' }
  );

  return { accessToken, refreshToken };
};

const updateRefreshToken = async (user, refreshToken) => {
  const {username, password} = user
  console.log(refreshToken);
  try {
    let updatedRefreshToken = {
      username,
      password,
      refreshToken: refreshToken,
    };
    console.log(updatedRefreshToken);
    
    const userUpdateCondition = { _id: user._id };

    updatedRefreshToken = await User.findByIdAndUpdate(
      userUpdateCondition,
      updatedRefreshToken,
      { new: true }
    );
    console.log(updatedRefreshToken)

    if(!updatedRefreshToken) console.log('can not update refreshToken')
  } catch (error) {
    console.log(error);
  }
};

const authCtrl = {
  register: async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    //simple validation
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Missing username or password' });

    try {
      const user = await User.findOne({ username });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: 'username already taken' });

      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ success: false, message: 'Password does not match' });

      // all good
      const hashedPassword = await bcrypt.hash(password, 12);

      //jwt
      const tokens = generateTokens({ username, password });

      const newUser = new User({
        username,
        password: hashedPassword,
        refreshToken: tokens.refreshToken,
      });
      await newUser.save();

      res.json({
        success: true,
        message: 'user created successfully!',
        tokens,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Missing username ' });

    try {
      // check user existing
      const user = await User.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect username' });

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect  password' });

      // all  good
      // return token
      const tokens = generateTokens(user);

      //update refressh token
      updateRefreshToken(user, tokens.refreshToken)


      res.json({
        success: true,
        message: 'User logged in successfully',
        tokens,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Interal server error' });
    }
  },
  token: async (req, res) => {
    const refreshToken = req.body.refreshToken
    if(!refreshToken) return res.status(401).json({success: false, message: 'Missing refreshToken'})

    try {
      const user = await User.findOne({ refreshToken })
      if(!user) return res.status(403).json({success: false, message: 'Not found user'})

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const tokens = generateTokens(user)
      updateRefreshToken(user, tokens.refreshToken)

    } catch (error) {
      console.log(error);
      res.status(500).json({success: false, message: 'Internal server error'})
    }
  },
  logout: async (req, res) => {
    
  },
};

module.exports = authCtrl;
