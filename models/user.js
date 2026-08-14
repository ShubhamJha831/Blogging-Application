const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');

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

userSchema.pre("save", function (){
    const user = this;

    if (!user.isModified("Password")) {
        return;
    }
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.Password).digest('hex');



    this.salt = salt;
    this.Password = hashedPassword;
    
});

userSchema.static("matchPassword", async function (Email, Password) {
    const user = await this.findOne({ Email });
    if (!user) throw new Error('Invalid email or password');
     
    const salt = user.salt;
    const  hashedPassword = user.Password;

    const userProvidedHash = createHmac('sha256', salt).update(Password).digest('hex');
    if (userProvidedHash !== hashedPassword) throw new Error('Invalid password');
    return user;
});

const User = model('User', userSchema);

module.exports = User;