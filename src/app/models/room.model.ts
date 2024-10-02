import { Gamemode } from './gamemode.model';
import { Question } from "./question.model";

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
}