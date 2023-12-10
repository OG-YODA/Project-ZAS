// services/testService.ts
import { Question } from '../models/test';

export class TestService {
  private questions: Question[];
  private currentQuestionIndex: number;
  private userAnswers: number[];
  private correctAnswersCount: number;

  constructor(questions: Question[]) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.userAnswers = new Array(questions.length);
    this.correctAnswersCount = 0; 
  }

  getOptionByIndex(questionIndex: number, index: number): string {
    return this.questions[questionIndex].options[index];
  }

  getQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

    getQuestions(): Question[] {
        return this.questions;
  }

    getCurrentQuestion(): Question{
        return this.questions[this.currentQuestionIndex];
  }

  setUserAnswer(index: number, answerIndex: number): void {
    this.userAnswers[index] = answerIndex;
  }

  getUserAnswer(index: number): number {
    return this.userAnswers[index];
  }

    incrementCorrectAnswers(): void {
    this.correctAnswersCount++;
  }

previousQuestion(): void { 
    this.currentQuestionIndex--;
}

nextQuestion(): void { 
    this.currentQuestionIndex++;
}

}