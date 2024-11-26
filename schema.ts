import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const cardSchema = new Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    description : { type: String, required: true },
    class: { type: String, required: true },
    cost: { type: Number, required: true },
    rarity: { type: String, required: true },
    image : { type: String, required: false, default: "" },
});

const enemySchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    health: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    image: { type: String, required: false, default: "" },
});

const levelSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false, default: "" },
});

const itemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false, default: "" },
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
export const Card = mongoose.model('Card', cardSchema);
export const Enemy = mongoose.model('Enemy', enemySchema);
export const Level = mongoose.model('Level', levelSchema);
export const Item = mongoose.model('Item', itemSchema);
export const UserRefreshToken = mongoose.model('UserRefresherToken', userRefreshTokenSchema);
export const UserInvalidToken = mongoose.model('UserInvalidToken', userInvalidTokenSchema);