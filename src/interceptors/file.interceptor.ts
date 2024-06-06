import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../common/base.middleware';
import multer from 'multer';
import { multerConfig } from '../configs/multer.config';

export class FileInterceptor extends BaseMiddleware {
	constructor(private fieldName?: string) {
		super();
	}

	execute(req: Request, res: Response, next: NextFunction): void | Promise<void> {
		const interceptor = multer(multerConfig).single(this.fieldName ?? 'uploadFile');
		return interceptor(req, res, next);
	}
}
