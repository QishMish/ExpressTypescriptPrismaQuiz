import { Response } from 'express';

export interface IQuetionCreate {
    question: string;
    isActive: boolean;
    category: string;
    type:"multiple" | "boolean"
    difficulty: "easy" | "medium" | "hard"
    incorrectAnswers: 
    string[] |
    number[] |
    boolean[],
    correctAnswer : string | boolean | number,
    userId : number,
  }

export interface IQuestion {
    quetion:string,
    tyepCategory:string,
    difficultyCategory:string,
    questionChoices: {
        choice:string,
        isCorrect:boolean
    }[]
}

export interface IQuetionFetch{
    amount:number | undefined,
    category:string | undefined,
    difficulty:string| undefined,
    type:string | undefined,
}

  enum QuetionDifficulties {
    easy,
    meidum,
    hard
  }
  enum QuestionTypes {
    multiple,
    boolean
  }
  
export interface IQuetionCreateResponse {
    status:number,
    response:Object
}
export interface IQuizService {
    createQuestion(createQuetionBody: IQuetionCreate): Promise<void | Response | IQuetionCreateResponse>;
}
