import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const reqBodyValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json(error);
  }
  next();
};

export default reqBodyValidationMiddleware;
