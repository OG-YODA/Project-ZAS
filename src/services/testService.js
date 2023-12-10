export class TestService {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length);
        this.correctAnswersCount = 0;
    }
    getOptionByIndex(questionIndex, index) {
        return this.questions[questionIndex].options[index];
    }
    getQuestionIndex() {
        return this.currentQuestionIndex;
    }
    getQuestions() {
        return this.questions;
    }
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }
    setUserAnswer(index, answerIndex) {
        this.userAnswers[index] = answerIndex;
    }
    getUserAnswer(index) {
        return this.userAnswers[index];
    }
    incrementCorrectAnswers() {
        this.correctAnswersCount++;
    }
    previousQuestion() {
        this.currentQuestionIndex--;
    }
    nextQuestion() {
        this.currentQuestionIndex++;
    }
}
