const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AnswerModel = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    questionId: { type: Schema.Types.ObjectId, ref: 'questions' },
    type: { type: Number },
    choice: { type: String },
    page: { type: Number },
    text: { type: String }
}, { timestamps: true });
const Answers = mongoose.model('answers', AnswerModel);
module.exports = Answers;






