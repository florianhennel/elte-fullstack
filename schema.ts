import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const userRefreshTokenSchema = new Schema({
    refreshToken: { type: String, required: true },
    userId: { type: String, required: true },
});

const userInvalidTokenSchema = new Schema({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    expirationTime: { type: Date, required: true },
});

export const User = mongoose.model('User', userSchema);
export const UserRefreshToken = mongoose.model('UserRefresherToken', userRefreshTokenSchema);
export const UserInvalidToken = mongoose.model('UserInvalidToken', userInvalidTokenSchema);