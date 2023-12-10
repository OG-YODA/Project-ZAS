export class TestService {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length); // инициализируем массив ответов пользователя
        this.correctAnswersCount = 0; // инициализируем счетчик правильных ответов
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
        // Устанавливаем ответ пользователя для указанного вопроса
        this.userAnswers[index] = this.userAnswers[answerIndex];
    }
    getUserAnswer(index) {
        return this.userAnswers[index];
    }
    incrementCorrectAnswers() {
        // Увеличиваем счетчик правильных ответов
        this.correctAnswersCount++;
    }
    previousQuestion() {
        this.currentQuestionIndex--;
    }
    nextQuestion() {
        this.currentQuestionIndex++;
    }
}
