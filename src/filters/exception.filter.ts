import { NextFunction, Request, Response } from 'express';
import { Exception } from './base.exception';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class ExceptionFilter {
	constructor(@inject(LoggerService) private logger: LoggerService) {}

	catch(err: Error | Exception, req: Request, res: Response, next: NextFunction): void {
		if (!err) {
			return next();
		}
		if (!(err instanceof Exception)) {
			this.logger.error(err.stack || err.message);
		}
		const status = typeof err == 'object' && 'status' in err ? err.status : 500;
		const message = typeof err == 'object' && 'message' in err ? err.message : 'Произошла неизвестная ошибка';

		res.status(status).json({
			status,
			message
		});
	}
}
