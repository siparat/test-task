import { inject, injectable } from 'inversify';
import { LoggerService } from './logger/logger.service';
import express, { Express, Router } from 'express';
import { UserController } from './user/user.controller';
import { ExceptionFilter } from './filters/exception.filter';

@injectable()
export class App {
	private router: Router;
	private app: Express;
	private port: number;
	private prefix: string;

	constructor(
		@inject(LoggerService) private logger: LoggerService,
		@inject(UserController) private userController: UserController,
		@inject(ExceptionFilter) private exceptionFilter: ExceptionFilter
	) {
		this.app = express();
		this.router = Router();
		this.port = 3000;
		this.prefix = '/';
	}

	setGlobalPrefix(prefix: string): void {
		this.prefix = '/' + prefix;
	}

	private useMiddlewares(): void {}

	private useRoutes(): void {
		this.router.use(this.userController.router.bind(this.userController));
	}

	private useFilters(): void {
		this.router.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useFilters();

		this.app.use(this.prefix, this.router);
		this.app.listen(this.port, () => {
			this.logger.log(`Сервер запущен на http://localhost:${this.port}${this.prefix}`);
		});
	}
}
