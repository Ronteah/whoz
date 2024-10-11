import { Gamemode } from './gamemode.model';
import { Question } from "./question.model";
import { Result } from './result.model';

export interface Room {
    _id: string;
    code: string;
    players: string[];
    questions: Question[];
    time: number;
    gamemode: Gamemode;
    date: Date;
    status: string;
    owner: string;
    results: Result[];
    currentQuestionIndex: number;
    currentResultIndex: number;
}