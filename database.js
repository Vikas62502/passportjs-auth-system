const mongoose = require('mongoose');

exports.connectMongoose = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/passport');
        console.log("connected to database");
    } catch (error) {
        console.log(error);
    }
};

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String
});

exports.User = mongoose.model('User', userSchema);