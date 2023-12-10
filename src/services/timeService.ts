// services/timeService.ts

export class TimeService {
  private startTime: number | null = null;
  private timerInterval: NodeJS.Timeout | null = null;
  private questionStartTimes: number[] = [];
  private questionTotalTimes: number[] = [];

  public addToQuestionTotalTime(index: number, elapsed: number): void {
    if (!this.questionTotalTimes[index]) {
      this.questionTotalTimes[index] = 0;
    }

    this.questionTotalTimes[index] += elapsed;
  }

  public getQuestionTotalTime(index: number): number {
    return this.questionTotalTimes[index] || 0;
  }

  public getQuestionStartTime(index: number): number | null {
    return this.questionStartTimes[index] || null;
  }

  public setQuestionStartTime(index: number, startTime: number): void {
    this.questionStartTimes[index] = startTime;
  }

  public getCurrentTime(): number {
    return Date.now();
  }

  startTimer(): void {
    this.startTime = Date.now();
  }

  stopTimer(): number | null {
    if (this.startTime !== null) {
      const endTime = Date.now();
      const elapsedTime = (endTime - this.startTime) / 1000;
      this.startTime = null;
      console.log(`Elapsed time: ${elapsedTime}`);
      return elapsedTime;
    }
    return null;
  }

  setTimerInterval(interval: NodeJS.Timeout): void {
    this.timerInterval = interval;
  }

  clearTimerInterval(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log('Timer cleared');
    }
  }

  calculateElapsedTime(): number {
    if (this.startTime !== null) {
      const currentTime = Date.now();
      return Math.floor((currentTime - this.startTime) / 1000);
    }
    return 0;
  }

  public formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}