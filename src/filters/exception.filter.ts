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
		const status = typeof err == 'object' && 'status' in err ? err.status : 500;
		const message = typeof err == 'object' && 'message' in err ? err.message : 'Произошла неизвестная ошибка';

		res.status(status).json({
			status,
			message
		});
	}
}
