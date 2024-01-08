import { Request, Response, NextFunction } from "express";

export interface ControllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface AuthMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<object | void>;
}

export interface PostControllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}
