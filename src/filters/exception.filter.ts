import { NextFunction, Request, Response } from 'express';
import { Exception } from './base.exception';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter {
	constructor() {}

	catch(err: Error | Exception, req: Request, res: Response, next: NextFunction): void {
		if (!err) {
			return next();
		}
		const status = err instanceof Error ? 500 : err.status;
		const message = err.message;

		res.status(status).json({
			status,
			message
		});
	}
}
