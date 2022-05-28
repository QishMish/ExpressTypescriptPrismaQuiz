import { body, check } from "express-validator";

const types = ["boolean","multiple"]
const difficulties = [ "easy","medium","hard",]

class QuestionValidator {
  validateQuetionBody() {
    return [
      body("question")
        .notEmpty()
        .trim()
        .withMessage("Question is required")
        .isString()
        .withMessage("Question must be string"),
      body("isActive")
        .isBoolean()
        .withMessage("isActive must be boolean")
        .notEmpty()
        .withMessage("Active status required"),
      body("category")
        .notEmpty()
        .withMessage("Category required")
        .trim(),
      body("type")
        .notEmpty()
        .withMessage("Type required")
        .isString()
        .withMessage("Type must be string")
        .custom((value:string, { req }) => {
            if (!types.includes(value)) {
              throw new Error("Type should be boolean or multiple types ");
            }
            return true;
          }),
      body("difficulty")
        .notEmpty()
        .withMessage("difficulty required")
        .isString()
        .withMessage("difficulty must be string")
        .custom((value:string, { req }) => {
            if (!difficulties.includes(value)) {
              throw new Error("Difficulty should be Easy, Medium or Hard ");
            }
            return true;
          }),
      body("incorrectAnswers")
        .notEmpty()
        .withMessage("IncorrectAnswers required")
        .isArray()
        .withMessage("IncorrectAnswers must be array")
        .custom((value:string[] | boolean[] | number[], { req }) => {

            //@ts-ignore-start
            let isValidType = value.every((x :string | number | boolean )=>{
                return typeof x === typeof value[0]
            })
            // @ts-ignore-end

            const quetionType = req.body.type

            let answersLength = quetionType === "multiple" ? 3 : 1

            if(answersLength !== value.length){
              throw new Error(`For ${req.body.type} type incorrect answers count must be ${answersLength}`);
            }

            if(!isValidType){
              throw new Error("IncorrectAnswers should be same types  ");
            }

            return true;
          }),
      body("correctAnswer")
        .notEmpty()
        .withMessage("correctAnswer required")
        .custom((value:string| boolean | number, { req }) => {
            console.log(req.body.incorrectAnswers)
            const isValid = typeof value === typeof req.body.incorrectAnswers[0]
            

            // const quetionType = req.body.type

            // const type =  quetionType === "True_False" &&  "boolean"
          
            // console.log(typeof value !== type)

            // if(!(typeof value !== type)){
            //   throw new Error(`CorrectAnswer must be boolean type`);
            // }

            if(!isValid){
              throw new Error("CorrectAnswer must be same type of  IncorrectAnswers ");
            }

            return true;
          }),
    ];
  }
  
}

export default new QuestionValidator();
