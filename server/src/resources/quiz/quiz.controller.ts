import { IQuetionFetch } from './quiz.interface';
import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import asyncHandler from "express-async-handler";
import authValidation from "@/utils/validations/auth.validation";
import QuizService from "@/resources/quiz/quiz.service";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import questionValidation from "@/utils/validations/question.validation";
import reqBodyValidationMiddleware from "@/middleware/reqBody.validation.middleware"

class QuizController implements Controller {

  public path = "/quiz";
  public router = Router();
  private userService: QuizService;

  constructor() {
    this.userService = new QuizService();
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/question`,
      questionValidation.validateQuetionBody(),
      reqBodyValidationMiddleware,
      authenticatedMiddleware,
      asyncHandler(this.createQuestion)
    );
    this.router.get(
      `${this.path}/question`,
      authenticatedMiddleware,
      asyncHandler(this.fetchQuetions)
    );
  }
  private createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const { question , isActive, category,difficulty, type,incorrectAnswers, correctAnswer } = req.body;
    const userId = req.user.id
    let {status, response } = await this.userService.createQuestion({
        question,
        category,
        isActive,
        incorrectAnswers,
        correctAnswer,
        difficulty, 
        type,
        userId,
    });
    res.status(status).json(response);
  };
  private fetchQuetions =  async (req: Request, res: Response, next: NextFunction) => {
    const {amount, category, difficulty, type} = req.query as unknown as IQuetionFetch
    
    let {status, response } = await this.userService.fetchQuetions({
      amount, category, difficulty, type
    });
    res.status(status).json(response);
  };
 
}

export default QuizController;
