// views/testView.ts
import { TimeService } from '../services/timeService.js';
export class TestView {
    constructor(testService) {
        this.userAnswers = [];
        this.handleBackButtonClick = () => {
            console.log('Back button clicked');
            // Store the current user answer before moving to the previous question
            this.storeUserAnswer();
            // Move to the previous question and update the view
            this.testService.previousQuestion();
            this.currentQuestionIndex--;
            this.renderQuestion(this.testService.getCurrentQuestion());
            this.updateProgress();
            this.updateNavigationButtons();
        };
        // В вашем классе TestView в методе handleNextButtonClick
        this.handleNextButtonClick = () => {
            console.log('Next button clicked');
            // Store the current user answer before moving to the next question
            this.storeUserAnswer();
            // Move to the next question and update the view
            this.testService.nextQuestion();
            this.currentQuestionIndex++;
            this.renderQuestion(this.testService.getCurrentQuestion());
            this.updateProgress();
            this.updateNavigationButtons();
        };
        this.testService = testService;
        this.timeService = new TimeService();
        this.userAnswers = new Array(testService.getQuestions().length);
        this.currentQuestionIndex = 0; // Инициализация, может быть другое значение в зависимости от вашей логики
        this.questionContainer = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.resultsSection = document.getElementById('results-section');
        this.correctAnswersElement = document.getElementById('correct-answers');
        this.totalTimeElement = document.getElementById('total-time');
    }
    handleRadioChange(index) {
        // Add your logic to handle checkbox changes here
        console.log(`Checkbox at index ${index} changed`);
    }
    renderQuestion(question) {
        if (!this.questionContainer || !this.optionsContainer) {
            console.error('Containers not found');
            return;
        }
        console.log('Rendering question:', question.text);
        // Отображение текста вопроса
        this.questionContainer.textContent = question.text;
        // Отображение вариантов ответов
        this.optionsContainer.innerHTML = '';
        const radioGroupName = 'answerGroup'; // Assign a group name for radio buttons
        question.options.forEach((option, index) => {
            var _a;
            const optionContainer = document.createElement('div');
            optionContainer.className = 'option-container';
            // Создаем радио-кнопку для каждого варианта
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.className = 'option-radio';
            radio.name = radioGroupName; // Assign the group name
            radio.addEventListener('change', () => this.handleRadioChange(index));
            // Создаем элемент для текста варианта
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            // Добавляем радио-кнопку и текст варианта в контейнер
            optionContainer.appendChild(radio);
            optionContainer.appendChild(optionElement);
            // Добавляем контейнер в общий контейнер с вариантами
            (_a = this.optionsContainer) === null || _a === void 0 ? void 0 : _a.appendChild(optionContainer);
            // Reflect the user's previous selection
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                radio.checked = true;
            }
        });
    }
    renderResults(correctAnswers, totalTime) {
        if (this.resultsSection && this.correctAnswersElement && this.totalTimeElement) {
            this.resultsSection.style.display = 'block';
            this.correctAnswersElement.textContent = `Correct answers: ${correctAnswers}`;
            this.totalTimeElement.textContent = `Total time spent: ${totalTime}`;
        }
    }
    displayDetailedResults(totalTime) {
        const questions = this.testService.getQuestions();
        const userAnswers = this.userAnswers;
        const resultsSection = document.getElementById('detailed-results-section');
        if (resultsSection) {
            // Очищаем предыдущие результаты
            resultsSection.innerHTML = '';
            // Отображаем детальные результаты для каждого вопроса
            questions.forEach((question, index) => {
                const questionResult = document.createElement('div');
                questionResult.className = userAnswers[index] === question.correctOptionIndex ? 'correct' : 'incorrect';
                // Отображаем текст вопроса
                const questionText = document.createElement('div');
                questionText.className = 'question-text';
                questionText.textContent = `The question is: ${question.text}`;
                // Отображаем выбранный пользователем ответ и проверяем правильность
                const signedAnswer = document.createElement('div');
                signedAnswer.className = 'signed-answer';
                signedAnswer.textContent = `Signed answer is: ${question.options[userAnswers[index]]}`;
                if (userAnswers[index] === question.correctOptionIndex) {
                    signedAnswer.textContent += '. Answer is correct.';
                }
                else {
                    signedAnswer.textContent += `. Correct answer is: ${question.options[question.correctOptionIndex]}`;
                }
                // Отображаем время, затраченное на вопрос
                const questionTime = document.createElement('div');
                questionTime.className = 'question-time';
                questionTime.textContent = `Time spent on this question: ${this.timeService.formatTime(this.calculateQuestionTime(index))}`;
                // Добавляем элементы в контейнер с результатом
                questionResult.appendChild(questionText);
                questionResult.appendChild(signedAnswer);
                questionResult.appendChild(questionTime);
                // Добавляем контейнер с результатом в раздел результатов
                resultsSection.appendChild(questionResult);
            });
        }
    }
    calculateQuestionTime(index) {
        const startTime = this.timeService.getQuestionStartTime(index);
        if (startTime !== null && this.userAnswers[index] !== undefined) {
            const endTime = this.timeService.getCurrentTime();
            const elapsed = endTime - startTime;
            // Update the total time spent on the question
            this.timeService.addToQuestionTotalTime(index, elapsed);
            return elapsed / 1000; // Convert to seconds
        }
        return 0;
    }
    storeUserAnswer() {
        const currentQuestion = this.testService.getCurrentQuestion();
        if (currentQuestion) {
            const selectedOptionIndex = this.getSelectedOptionIndex();
            const currentTime = this.timeService.getCurrentTime();
            if (currentTime !== null) {
                const questionIndex = this.currentQuestionIndex;
                // Если это первый раз, когда отвечают на вопрос, записываем время начала
                if (this.userAnswers[questionIndex] === undefined) {
                    this.timeService.setQuestionStartTime(questionIndex, currentTime);
                }
                // Если вопрос уже отвечен, добавляем текущее время к общему времени
                if (this.userAnswers[questionIndex] !== undefined) {
                    const elapsed = currentTime - this.timeService.getQuestionStartTime(questionIndex);
                    this.timeService.addToQuestionTotalTime(questionIndex, elapsed);
                }
                this.testService.setUserAnswer(questionIndex, selectedOptionIndex);
                this.userAnswers[questionIndex] = selectedOptionIndex;
            }
        }
    }
    getSelectedOptionIndex() {
        const radioButtons = document.querySelectorAll('.option-radio');
        for (let i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                return i;
            }
        }
        return -1; // Return -1 if no option is selected
    }
    calculateCorrectAnswers(userAnswers, questions) {
        return userAnswers.reduce((count, userAnswer, index) => {
            const isCorrect = userAnswer === questions[index].correctOptionIndex;
            return isCorrect ? count + 1 : count;
        }, 0);
    }
    updateNavigationButtons() {
        // Обновляем доступность кнопок "Назад" и "Вперед" в зависимости от текущего индекса вопроса
        const backButton = document.getElementById('back-btn');
        const nextButton = document.getElementById('next-btn');
        const finishButton = document.getElementById('finish-btn');
        if (backButton && nextButton) {
            backButton.disabled = this.currentQuestionIndex === 0;
            nextButton.disabled = this.currentQuestionIndex === this.testService.getQuestions().length - 1;
            // Проверяем, есть ли незавершенные вопросы
            const unansweredQuestionsExist = this.userAnswers.includes(undefined);
            finishButton.disabled = unansweredQuestionsExist;
        }
    }
    updateProgress() {
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.textContent = `Question ${this.currentQuestionIndex + 1} from ${this.testService.getQuestions().length}`;
        }
    }
}
