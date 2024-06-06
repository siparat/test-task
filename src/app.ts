import { inject, injectable } from 'inversify';
import { LoggerService } from './logger/logger.service';
import express, { Express, Router } from 'express';
import { UserController } from './user/user.controller';
import { ExceptionFilter } from './filters/exception.filter';
import { DatabaseService } from './database/database.service';
import { json } from 'body-parser';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UserRepository } from './user/user.repository';
import { ConfigService } from './configs/config.service';

@injectable()
export class App {
	private router: Router;
	private app: Express;
	private port: number;
	private prefix: string;

	constructor(
		@inject(LoggerService) private logger: LoggerService,
		@inject(UserController) private userController: UserController,
		@inject(ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(DatabaseService) private database: DatabaseService,
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(ConfigService) private configService: ConfigService
	) {
		this.app = express();
		this.router = Router();
		this.port = 3000;
		this.prefix = '/';
	}

	setGlobalPrefix(prefix: string): void {
		this.prefix = '/' + prefix;
	}

	private useMiddlewares(): void {
		this.router.use(json());
	}

	private useRoutes(): void {
		this.router.use(this.userController.router.bind(this.userController));
	}

	private useFilters(): void {
		this.router.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	private useStrategies(): void {
		new JwtStrategy(this.userRepository, this.configService);
	}

	async init(): Promise<void> {
		await this.database.connect();

		this.useMiddlewares();
		this.useRoutes();
		this.useFilters();
		this.useStrategies();

		this.app.use(this.prefix, this.router);
		this.app.listen(this.port, () => {
			this.logger.log(`Сервер запущен на http://localhost:${this.port}${this.prefix}`);
		});
	}
}
