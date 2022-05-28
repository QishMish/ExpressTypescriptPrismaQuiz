import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import HttpException from "@/utils/exceptions/http.exception";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

interface IToken extends Object {
  username?: string;
  id?: string;
  expiresIn: number;
}
const client = new PrismaClient()

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payload: any = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY as jwt.Secret
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorised"));
    }

    const user = await client.user.findUnique({
      where: { 
        username:payload.username
      }
    });

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }
    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorised"));
  }
}

export default authenticatedMiddleware;
