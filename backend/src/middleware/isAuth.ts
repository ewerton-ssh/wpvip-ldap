import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";

interface TokenPayload {
  id: string;
  username: string;
  profile: string;
  companyId: number;
  iat: number;
  exp: number;
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [, token] = authHeader.split(" ");
    try {
      const decoded = verify(token, authConfig.secret);
      const { id, profile, companyId } = decoded as TokenPayload;
      req.user = {
        id,
        profile,
        companyId
      };
    } catch (err) {
      
      logger.warn("ERR_SESSION_EXPIRED");
    }
  }

  return next();
};

export default isAuth;