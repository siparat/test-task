import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { RegisterDto } from './dto/register.dto';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(LoggerService) private logger: LoggerService) {
		super(logger);
		this.bind('user', [
			{ path: 'get/:id', method: 'get', handler: this.helloWorld, middlewares: [new ValidationMiddleware(RegisterDto)] }
		]);
	}

	helloWorld(req: Request, res: Response): void {
		this.ok(res, 'hello world');
	}
}
