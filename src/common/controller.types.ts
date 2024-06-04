import { NextFunction, Express, Request, Response } from 'express';
import { BaseMiddleware } from './base.middleware';

export interface IRoute {
	method: keyof Pick<Express, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	path: string;
	handler: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: BaseMiddleware[];
}
