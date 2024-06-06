import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';
import { UserErrorMessages } from './user.constants';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@injectable()
export class UserController extends BaseController {
	constructor(
		@inject(LoggerService) private logger: LoggerService,
		@inject(AuthService) private authService: AuthService
	) {
		super(logger);
		this.bind('user', [
			{
				path: 'register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidationMiddleware(RegisterDto), new JwtAuthGuard()]
			},
			{
				path: 'login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidationMiddleware(LoginDto)]
			},
			{
				path: 'info',
				method: 'get',
				handler: this.info,
				middlewares: [new JwtAuthGuard()]
			}
		]);
	}

	async register({ body }: Request<object, RegisterDto>, res: Response): Promise<void> {
		const user = await this.authService.create(body);
		this.created(res, user);
	}

	async login({ body: { email, password } }: Request<object, LoginDto>, res: Response): Promise<void> {
		const userIsValid = await this.authService.validateUser(email, password);
		if (!userIsValid) {
			throw new BadRequestException(UserErrorMessages.WRONG_PASSWORD);
		}
		const token = await this.authService.generateToken({ email });
		this.ok(res, token);
	}

	info({ user }: Request, res: Response): void {
		this.ok(res, user);
	}
}
