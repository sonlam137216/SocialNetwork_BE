const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authaHeader = req.header('Authorization')
    const token = authaHeader && authaHeader.split(' ')[1];

    if(!token) return res.sendStatus(401)

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded);

        req.userId = decoded.userId
        console.log(req.userId)
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(403)
    }
}

module.exports = verifyToken