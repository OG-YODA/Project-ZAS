// views/testView.ts

import { Question } from '../models/test';
import { TestService } from '../services/testService';
import { TimeService } from '../services/timeService.js';

export class TestView {
  private questionContainer: HTMLElement | null;
  private optionsContainer: HTMLElement | null;
  private resultsSection: HTMLElement | null;
  private correctAnswersElement: HTMLElement | null;
  private totalTimeElement: HTMLElement | null;
  private testService: TestService;
  private currentQuestionIndex: number;
  public userAnswers: (number | undefined)[] = [];
  private timeService: TimeService;

  constructor(testService: TestService) {
    this.testService = testService;
    this.timeService = new TimeService(); 
    this.userAnswers = new Array(testService.getQuestions().length);
    this.currentQuestionIndex = 0;
    this.questionContainer = document.getElementById('question-text');
    this.optionsContainer = document.getElementById('options-container');
    this.resultsSection = document.getElementById('results-section');
    this.correctAnswersElement = document.getElementById('correct-answers');
    this.totalTimeElement = document.getElementById('total-time');
  }

  private handleRadioChange(index: number): void {
    console.log(`Checkbox at index ${index} changed`);
  }

  public renderQuestion(question: Question): void {
    if (!this.questionContainer || !this.optionsContainer) {
      console.error('Containers not found');
      return;
    }

    console.log('Rendering question:', question.text);
    this.questionContainer.textContent = question.text;
    this.optionsContainer.innerHTML = '';
    const radioGroupName = 'answerGroup';
    question.options.forEach((option, index) => {
      const optionContainer = document.createElement('div');
      optionContainer.className = 'option-container';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.className = 'option-radio';
      radio.name = radioGroupName;
      radio.addEventListener('change', () => this.handleRadioChange(index));

      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.textContent = option;

      optionContainer.appendChild(radio);
      optionContainer.appendChild(optionElement);

      this.optionsContainer?.appendChild(optionContainer);

      if (this.userAnswers[this.currentQuestionIndex] === index) {
        radio.checked = true;
      }
    });
  }

  renderResults(correctAnswers: number, totalTime: string): void {
    if (this.resultsSection && this.correctAnswersElement && this.totalTimeElement) {
      this.resultsSection.style.display = 'block';
      this.correctAnswersElement.textContent = `Correct answers: ${correctAnswers}`;
      this.totalTimeElement.textContent = `Total time spent: ${totalTime}`;
    }
}

public displayDetailedResults(totalTime: string): void {
  const questions = this.testService.getQuestions();
  const userAnswers = this.userAnswers;
  const resultsSection = document.getElementById('detailed-results-section');

  if (resultsSection) {
    resultsSection.innerHTML = '';

    questions.forEach((question, index) => {
      const questionResult = document.createElement('div');
      questionResult.className = userAnswers[index] === question.correctOptionIndex ? 'correct' : 'incorrect';

      const questionText = document.createElement('div');
      questionText.className = 'question-text';
      questionText.textContent = `The question is: ${question.text}`;

      const signedAnswer = document.createElement('div');
      signedAnswer.className = 'signed-answer';
      signedAnswer.textContent = `Signed answer is: ${question.options[userAnswers[index]!]}`;
      if (userAnswers[index] === question.correctOptionIndex) {
        signedAnswer.textContent += '. Answer is correct.';
      } else {
        signedAnswer.textContent += `. Correct answer is: ${question.options[question.correctOptionIndex]}`;
      }

      const questionTime = document.createElement('div');
      questionTime.className = 'question-time';
      questionTime.textContent = `Time spent on this question: ${this.timeService.formatTime(this.calculateQuestionTime(index))}`;

      questionResult.appendChild(questionText);
      questionResult.appendChild(signedAnswer);
      questionResult.appendChild(questionTime);

      resultsSection.appendChild(questionResult);
    });
  }
}

private calculateQuestionTime(index: number): number {
  const startTime = this.timeService.getQuestionStartTime(index);

  if (startTime !== null && this.userAnswers[index] !== undefined) {
    const endTime = this.timeService.getCurrentTime();
    const elapsed = endTime - startTime;

    this.timeService.addToQuestionTotalTime(index, elapsed);

    return elapsed / 1000;
  }

  return 0;
}

public storeUserAnswer(): void {
  const currentQuestion = this.testService.getCurrentQuestion();
  if (currentQuestion) {
    const selectedOptionIndex = this.getSelectedOptionIndex();
    const currentTime = this.timeService.getCurrentTime();

    if (currentTime !== null) {
      const questionIndex = this.currentQuestionIndex;

      if (this.userAnswers[questionIndex] === undefined) {
        this.timeService.setQuestionStartTime(questionIndex, currentTime);
      }

      if (this.userAnswers[questionIndex] !== undefined) {
        const elapsed = currentTime - this.timeService.getQuestionStartTime(questionIndex)!;
        this.timeService.addToQuestionTotalTime(questionIndex, elapsed);
      }

      this.testService.setUserAnswer(questionIndex, selectedOptionIndex);
      this.userAnswers[questionIndex] = selectedOptionIndex;
    }
  }
}

private getSelectedOptionIndex(): number {
  const radioButtons = document.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return i;
    }
  }
  return -1;
}

  public calculateCorrectAnswers(userAnswers: number[], questions: Question[]): number {
    return userAnswers.reduce((count, userAnswer, index) => {
      const isCorrect = userAnswer === questions[index].correctOptionIndex;
      return isCorrect ? count + 1 : count;
    }, 0);
  }

  private updateNavigationButtons(): void {

     const backButton = document.getElementById('back-btn') as HTMLButtonElement;
     const nextButton = document.getElementById('next-btn') as HTMLButtonElement;
     const finishButton = document.getElementById('finish-btn') as HTMLButtonElement;

    if (backButton && nextButton) {
      backButton.disabled = this.currentQuestionIndex === 0;
      nextButton.disabled = this.currentQuestionIndex === this.testService.getQuestions().length - 1;

    const unansweredQuestionsExist = this.userAnswers.includes(undefined);
    finishButton.disabled = unansweredQuestionsExist;
    }
  }

  public updateProgress(): void {
    const progressElement = document.getElementById('progress');
    if (progressElement) {
      progressElement.textContent = `Question ${this.currentQuestionIndex + 1} from ${this.testService.getQuestions().length}`;
    }
  }

  public handleBackButtonClick = (): void => {
    console.log('Back button clicked');
    this.storeUserAnswer();
    
    this.testService.previousQuestion();
    this.currentQuestionIndex--;
  
    this.renderQuestion(this.testService.getCurrentQuestion());
    this.updateProgress();
    this.updateNavigationButtons();
  };
  
  public handleNextButtonClick = (): void => {
    console.log('Next button clicked');
    this.storeUserAnswer();
  
    this.testService.nextQuestion();
    this.currentQuestionIndex++;
  
    this.renderQuestion(this.testService.getCurrentQuestion());
    this.updateProgress();
    this.updateNavigationButtons();
  };

}