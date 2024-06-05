import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';
import { UserErrorMessages } from './user.constants';

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
			},
			{
				path: 'login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidationMiddleware(LoginDto)]
			}
		]);
	}

	async register({ body }: Request<object, RegisterDto>, res: Response): Promise<void> {
		const user = await this.userService.create(body);
		this.created(res, user);
	}

	async login({ body: { email, password } }: Request<object, LoginDto>, res: Response): Promise<void> {
		const userIsValid = await this.userService.validateUser(email, password);
		if (!userIsValid) {
			throw new BadRequestException(UserErrorMessages.WRONG_PASSWORD);
		}
		const token = await this.userService.generateToken({ email });
		this.ok(res, token);
	}
}
