import { Request, Response, NextFunction } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  return next();
};

export default isAuth;