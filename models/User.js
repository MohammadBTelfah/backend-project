const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('Password')){
        return next()
    }
    try {
        const salt = await bycrypt.genSalt(10)
        this.Password = await bycrypt.hash(this.Password, salt)
        next()
        
    } catch (error) {
        next(error)
    }
});


module.exports = mongoose.model('User', userSchema);
