import { IQuetionFetch } from './quiz.interface';
import { Response } from "express";
import {
  IQuetionCreate,
  IQuetionCreateResponse,
  IQuizService,
  IQuestion
} from "@/resources/quiz/quiz.interface";
import HttpException from "@/utils/exceptions/http.exception";
import PrismaSource from '@/config/PrismaClient';
import Helper from '@/utils/helper';

class QuizService implements IQuizService {
  
  private _prismaRepository;
  
  constructor() {
    this._prismaRepository = PrismaSource.getRepository();
  }
  //public methods
  async createQuestion(createQuetionBody: IQuetionCreate) {

    const { question, isActive, userId, category,difficulty, 
      type, correctAnswer, incorrectAnswers} =
    createQuetionBody;

    console.log(createQuetionBody)

    type option = {
      choice:string
      isCorrect : boolean
    }
     let incorrectOptions : option[] =  incorrectAnswers.map(x=>{
          return {
            choice: JSON.stringify(x),
            isCorrect: false
          }
      })
    let correctOption = {
      choice: JSON.stringify(correctAnswer),
      isCorrect: true
    }


    let options = [...incorrectOptions, correctOption]

    console.log(options)

    const quetion = await this._prismaRepository.question.create({
      data: {
        question: question,
        isActive: Boolean(isActive),
        user :{
          connect:{
            id:userId
          }
        },
        category:{
          connectOrCreate: {
            where: {
              category:category,
            },
            create: {
              category:category              
            },
          },
        },
        questionChoices:{
          create:[
           ...options
          ]
        },
        type:{
          connectOrCreate: {
            where: {
              type: type
            },
            create: {
              type: type      
            },
          },
        },
        difficulty:{
          connectOrCreate: {
            where: {
              difficulty:difficulty
            },
            create: {
              difficulty:difficulty   
            },
          },
        },
       
      },
    });

    return Promise.resolve({
      status: 200,
      response: question,
    });
  }
  async fetchQuetions(fetchQuetionQuery : IQuetionFetch){

    const {amount, category, type, difficulty} = fetchQuetionQuery

    const quetions = await this._prismaRepository.question.findMany({
      take:Number(amount),
      where: {
        category: {
          category: category,
        },
      },
      include: {
        questionChoices:{
          select:{
            choice:true,
            isCorrect:true
          }
        }
      },
    })
    const questionsWithExludedFields = quetions.map(q=>{
      return Helper.exclude(q, 'id',"isActive","categoryId","userId")
    })
    const questionsResponse = questionsWithExludedFields.map(q=>{

      let incorrectAnswers = q.questionChoices.filter(c=> !c.isCorrect).map(c=>JSON.parse(c.choice))
      let corectAnswer = q.questionChoices.find(c=> JSON.parse(c.choice))?.choice

      const {questionChoices, ...rest} = q
      return {
        ...rest,
        corectAnswer,
        incorrectAnswers
      }
    })

    return Promise.resolve({
      status: 200,
      response: questionsResponse,
    });
  }
}



export default QuizService;
