// app.ts
console.log('app.js loaded. Hello, world!');
import { TestService } from './services/testService.js';
import { TestView } from './views/testView.js';
import { Question } from './models/test.js';
import { TimeService } from './services/timeService.js';

let questions: Question[];
let testService: TestService;
let testView: TestView;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let startTime: number;
let testStarted = false;
const timeService = new TimeService();
const questionTimeNode: HTMLSpanElement = document.querySelector("#timer")!;
const backButton = document.getElementById('back-btn') as HTMLButtonElement;
const nextButton = document.getElementById('next-btn') as HTMLButtonElement;
const finishButton = document.getElementById('finish-btn') as HTMLButtonElement;
const cancelButton = document.getElementById('cancel-btn') as HTMLButtonElement;

interface TestJSON extends Array<Question> { }
  
function shuffleQuestions(questions: Question[]): Question[] {
    const shuffledQuestions = [...questions];
  
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
  
    return shuffledQuestions;
  }  

  function loadQuestions(): Promise<Question[]> {
    return fetch('test.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json() as unknown as Question[];
    })
    .catch((error) => {
      console.error('Ошибка при загрузке вопросов:', error);
      return [] as Question[];
    });
  }

loadQuestions().then((loadedQuestions) => {
    questions = shuffleQuestions(loadedQuestions);
    console.log("Questions loaded");
     testService = new TestService(questions);
     testView = new TestView(testService, );
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

  function showElements(elements: HTMLElement[]): void {
    elements.forEach(element => {
        if (element) {
            element.style.display = 'block';
        }
    });
}

function hideElements(elements: (HTMLElement | null)[]): void {
    elements.forEach(element => {
        if (element) {
            element.style.display = 'none';
        }
    });
}

function startTest(testService: TestService) {
    const introSection = document.getElementById('intro-section');
    const questionSection = document.getElementById('question-section');
    if (introSection && questionSection) {
        introSection.style.display = 'none';
        questionSection.style.display = 'block';
        showQuestion(testService);
        timeService.startTimer();

        const timerInterval = setInterval(() => {
            const elapsedSeconds = timeService.calculateElapsedTime();
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = timeService.formatTime(elapsedSeconds);
            }
        }, 1000);

        timeService.setTimerInterval(timerInterval);

        showElements([backButton, nextButton, finishButton, cancelButton, questionTimeNode]);

        testStarted = true;
    }
}

function handleFinishButtonClick(): void {
    console.log('Finish button clicked');
    
    if (!testStarted) {
        alert('Please start the test before finishing.');
        return;
    }

    const unansweredQuestionsExist = testView.userAnswers.includes(undefined);

    if (unansweredQuestionsExist) {
        alert('Please answer all questions before finishing the test.');
        return;
    }

    const currentQuestion = testService.getCurrentQuestion();
    if (currentQuestion) {
        testService.setUserAnswer(
            currentQuestionIndex,
            testView.userAnswers[currentQuestionIndex] || -1
        );
    }
    testView.updateProgress();
    finishTest();
}

  function finishTest(): void {
  const totalTime = timeService.stopTimer();

  const introSection = document.getElementById('intro-section');
  const questionSection = document.getElementById('question-section');
  const resultsSection = document.getElementById('results-section');
  const buttonsSection = document.getElementById('navigation-buttons');
  const infoSection = document.getElementById('info-section');
  const finishButton = document.getElementById('finish-btn');
  const cancelButton = document.getElementById('cancel-btn');
  if(resultsSection) {
    resultsSection.style.display = 'block';
    questionSection!.style.display = 'none';
    introSection!.style.display = 'none';
    buttonsSection!.style.display = 'none';
    infoSection!.style.display = 'none';
    finishButton!.style.display = 'none';
    cancelButton!.style.display = 'none';
  }

  const correctAnswers = testView.calculateCorrectAnswers(
    testView.userAnswers.filter((answer) => answer !== undefined) as number[],
    testService.getQuestions());
  testView.renderResults(correctAnswers, timeService.formatTime(totalTime!));

  testView.displayDetailedResults(timeService.formatTime(totalTime!));

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

function showQuestion(testService: TestService) {
  const questionstmp = testService.getQuestions();
  if (currentQuestionIndex < questionstmp.length) {
    console.log("Question is being shown");
    const currentQuestion = questionstmp[currentQuestionIndex];
    testView.renderQuestion(currentQuestion);
    testView.updateProgress();
  }
}

function handleCancelButtonClick(): void {
    window.location.reload();
}
