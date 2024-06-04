import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@injectable()
export class UserController extends BaseController {
	constructor(
		@inject(LoggerService) private logger: LoggerService,
		@inject(UserService) private userService: UserService
	) {
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

	async register({ body }: Request<object, RegisterDto>, res: Response): Promise<void> {
		const user = await this.userService.create(body);
		this.created(res, user);
	}
}
