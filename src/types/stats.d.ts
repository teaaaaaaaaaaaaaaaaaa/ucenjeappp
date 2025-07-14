export interface UnknownQuestionStat {
  questionId: number;
  subject: string;
  questionText: string;
  incorrectCount: number;
  dontKnowCount: number;
  lastIncorrectTimestamp?: number;
} 