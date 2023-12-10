// services/timeService.ts
export class TimeService {
    constructor() {
        this.startTime = null;
        this.timerInterval = null;
        this.questionStartTimes = [];
        this.questionTotalTimes = [];
    }
    addToQuestionTotalTime(index, elapsed) {
        if (!this.questionTotalTimes[index]) {
            this.questionTotalTimes[index] = 0;
        }
        this.questionTotalTimes[index] += elapsed;
    }
    getQuestionTotalTime(index) {
        return this.questionTotalTimes[index] || 0;
    }
    getQuestionStartTime(index) {
        return this.questionStartTimes[index] || null;
    }
    setQuestionStartTime(index, startTime) {
        this.questionStartTimes[index] = startTime;
    }
    getCurrentTime() {
        return Date.now();
    }
    startTimer() {
        this.startTime = Date.now();
    }
    stopTimer() {
        if (this.startTime !== null) {
            const endTime = Date.now();
            const elapsedTime = (endTime - this.startTime) / 1000;
            this.startTime = null;
            console.log(`Elapsed time: ${elapsedTime}`);
            return elapsedTime;
        }
        return null;
    }
    setTimerInterval(interval) {
        this.timerInterval = interval;
    }
    clearTimerInterval() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            console.log('Timer cleared');
        }
    }
    calculateElapsedTime() {
        if (this.startTime !== null) {
            const currentTime = Date.now();
            return Math.floor((currentTime - this.startTime) / 1000);
        }
        return 0;
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
