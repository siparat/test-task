import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(LoggerService) private logger: LoggerService) {
		super(logger);
		this.bind('user', [
			{
				path: 'register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidationMiddleware(RegisterDto)]
			}
		]);
	}

	async register(req: Request<object, RegisterDto>, res: Response): Promise<void> {
		throw new BadRequestException('Test');
	}
}
