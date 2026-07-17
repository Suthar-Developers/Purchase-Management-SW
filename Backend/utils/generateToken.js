const jwt = require('jsonwebtoken')
const { v4: uuid } = require("uuid");

exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.user_id,
            username: user.username,
            role_id: user.role_id
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        }
    );
};

exports.generateRefreshToken = (user) => {
    const jti = uuid();

    const token = jwt.sign(
        {
            id: user.user_id, jti
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES
        }
    );

    return { token, jti };
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

exports.verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
}