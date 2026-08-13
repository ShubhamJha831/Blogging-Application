const { createHmac, randomBytes } = require('crypto');
const { Schema, Model } = require('mongoose');

const userSchema = new Schema({
    Fullname: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("Password")) {
        return;
    }
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.Password).digest('hex');

    this.salt = salt;
    this.Password = hashedPassword;
    
    next();
});

const User = Model('User', userSchema);

module.exports = User;