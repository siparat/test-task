import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { IRoute } from '../common/controller.types';
import { LoggerService } from '../logger/logger.service';
import { join } from 'path';
import { HttpStatus } from '../helpers/http-status.helper';
import 'reflect-metadata';

@injectable()
export class BaseController {
	protected _router: Router;
	private prefix: string;

	constructor(private loggerService: LoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	ok<T>(res: Response, message: T): void {
		res.status(HttpStatus.OK).send(message);
	}

	bind(prefix: string, routes: IRoute[]): void {
		this.prefix = prefix.padStart(prefix.length + 1, '/');
		for (const { path, method, handler, middlewares = [] } of routes) {
			const updatedMiddlewares = middlewares.map((m) => m.execute.bind(this));
			const pipeline = [handler.bind(this), ...updatedMiddlewares];
			const fullPath = join(this.prefix, path.padStart(path.length + 1, '/'));
			this._router[method](fullPath, pipeline);
			this.loggerService.log(`[${method}] ${fullPath}`);
		}
	}
}
