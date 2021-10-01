const { ENUMS } = require('../constants');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionModel = new Schema({
    question: { type: String },
    answers: [{
        value: { type: String }
    }],
    type: { type: Number, enums: ENUMS.QUESTION_TYPES },
    page: { type: Number },
    nestedQuestions: [{
        choice: { type: String },
        questions: [
            {
                question: { type: String },
                type: { type: Number, enums: ENUMS.QUESTION_TYPES },
                answers: [{
                    value: { type: String }
                }],
            }
        ],
    }]
}, { timestamps: true });
const Questions = mongoose.model('questions', QuestionModel);
module.exports = Questions;


