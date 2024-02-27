const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    difficulty: String,
    questions: [{
        question: String,
        correct_answer: String,
        incorrect_answers: [String],
        user_answer: String
    }],
    score: Number,
    username: String
});
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
