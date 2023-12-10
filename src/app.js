// app.ts
console.log('app.js loaded. Hello, world!');
import { TestService } from './services/testService.js';
import { TestView } from './views/testView.js';
import { TimeService } from './services/timeService.js';
let questions; // Объявите переменную для хранения вопросов
let testService; // Объявите переменную для TestService
let testView; // Объявите переменную для TestView
let currentQuestionIndex = 0;
let correctAnswers = 0;
let startTime;
let testStarted = false;
const timeService = new TimeService();
const questionTimeNode = document.querySelector("#timer");
const backButton = document.getElementById('back-btn');
const nextButton = document.getElementById('next-btn');
const finishButton = document.getElementById('finish-btn');
const cancelButton = document.getElementById('cancel-btn');
function loadQuestions() {
    return fetch('test.json')
        .then((response) => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json(); // Преобразование типа к Question[]
    })
        .catch((error) => {
        console.error('Ошибка при загрузке вопросов:', error);
        return []; // Преобразование типа для обработки ошибок
    });
}
loadQuestions().then((loadedQuestions) => {
    questions = loadedQuestions;
    console.log("Questions loaded");
    // Создайте объект TestService после успешной загрузки вопросов
    testService = new TestService(questions);
    testView = new TestView(testService); // Перенесите создание testView сюда
}).catch((error) => {
    console.error('Error while loading questions', error);
});
const startBtn = document.getElementById('start-btn');
if (startBtn) {
    startBtn.addEventListener('click', function (e) {
        e.preventDefault();
        startTime = new Date().getTime();
        currentQuestionIndex = 0;
        correctAnswers = 0;
        // Reset the timer when starting the test
        timeService.startTimer();
        startTest(testService);
        console.log("Test started");
    });
}
document.addEventListener('DOMContentLoaded', function () {
    hideElements([backButton, nextButton, finishButton, cancelButton, questionTimeNode]);
    backButton.addEventListener('click', () => testView.handleBackButtonClick());
    nextButton.addEventListener('click', () => testView.handleNextButtonClick());
    cancelButton.addEventListener('click', () => handleCancelButtonClick());
    finishButton.addEventListener('click', () => handleFinishButtonClick());
});
function showElements(elements) {
    elements.forEach(element => {
        if (element) {
            element.style.display = 'block';
        }
    });
}
function hideElements(elements) {
    elements.forEach(element => {
        if (element) {
            element.style.display = 'none';
        }
    });
}
function startTest(testService) {
    // Скрытие вводной части и отображение первого вопроса
    const introSection = document.getElementById('intro-section');
    const questionSection = document.getElementById('question-section');
    if (introSection && questionSection) {
        introSection.style.display = 'none';
        questionSection.style.display = 'block';
        // Отображение первого вопроса
        showQuestion(testService);
        // Запуск таймера
        timeService.startTimer();
        // Start the timer interval
        const timerInterval = setInterval(() => {
            const elapsedSeconds = timeService.calculateElapsedTime();
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = timeService.formatTime(elapsedSeconds);
            }
        }, 1000); // Update the timer every second
        // Save the interval ID so that you can clear it later
        timeService.setTimerInterval(timerInterval);
        // Отображение кнопок и таймера после начала теста
        showElements([backButton, nextButton, finishButton, cancelButton, questionTimeNode]);
        testStarted = true;
    }
}
function handleFinishButtonClick() {
    console.log('Finish button clicked');
    // Проверяем, начался ли тест
    if (!testStarted) {
        alert('Please start the test before finishing.');
        return;
    }
    // Проверяем, отвечены ли на все вопросы
    const unansweredQuestionsExist = testView.userAnswers.includes(undefined);
    if (unansweredQuestionsExist) {
        alert('Please answer all questions before finishing the test.');
        return;
    }
    // Store the current user answer before finishing the test
    const currentQuestion = testService.getCurrentQuestion();
    if (currentQuestion) {
        testService.setUserAnswer(currentQuestionIndex, testView.userAnswers[currentQuestionIndex] || -1);
    }
    testView.updateProgress();
    // Finish the test and show results
    finishTest();
}
function finishTest() {
    const totalTime = timeService.stopTimer();
    // Perform any necessary actions to finish the test
    // For example, you can calculate the final results and display them
    const introSection = document.getElementById('intro-section');
    const questionSection = document.getElementById('question-section');
    const resultsSection = document.getElementById('results-section');
    const buttonsSection = document.getElementById('navigation-buttons');
    const infoSection = document.getElementById('info-section');
    const finishButton = document.getElementById('finish-btn');
    const cancelButton = document.getElementById('cancel-btn');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        questionSection.style.display = 'none';
        introSection.style.display = 'none';
        buttonsSection.style.display = 'none';
        infoSection.style.display = 'none';
        finishButton.style.display = 'none';
        cancelButton.style.display = 'none';
    }
    const correctAnswers = testView.calculateCorrectAnswers(testView.userAnswers.filter((answer) => answer !== undefined), testService.getQuestions());
    testView.renderResults(correctAnswers, timeService.formatTime(totalTime));
    // Display detailed results for each question
    testView.displayDetailedResults(timeService.formatTime(totalTime));
    // You can also add additional actions, such as saving results to LocalStorage
    const results = {
        correctAnswers: correctAnswers,
        totalTime: totalTime,
    };
    localStorage.setItem('testResults', JSON.stringify(results));
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = '00:00';
    }
    console.log('Finishing the test');
}
function showQuestion(testService) {
    const questionstmp = testService.getQuestions();
    if (currentQuestionIndex < questionstmp.length) {
        console.log("Question is being shown");
        const currentQuestion = questionstmp[currentQuestionIndex];
        testView.renderQuestion(currentQuestion);
        testView.updateProgress();
    }
}
function handleCancelButtonClick() {
    window.location.reload();
}
