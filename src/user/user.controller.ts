import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(LoggerService) private logger: LoggerService) {
		super(logger);
		this.bind('user', [{ path: 'get/:id', method: 'get', handler: this.helloWorld }]);
	}

	helloWorld(req: Request, res: Response): void {
		this.ok(res, 'hello world');
	}
}
