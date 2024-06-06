import { isMimeType } from 'class-validator';
import { BaseMiddleware } from '../common/base.middleware';
import { CommonDtoErrors } from '../common/common.constants';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';
import { MimeTypeCategory } from '../common/common.types';
import { NextFunction, Request, Response } from 'express';

export class MimeTypePipe extends BaseMiddleware {
	constructor(
		private category: MimeTypeCategory,
		private secondCategory?: string,
		private optional: boolean = false
	) {
		super();
	}

	execute({ file }: Request, res: Response, next: NextFunction): void {
		if (!file || !isMimeType(file.mimetype)) {
			if (!this.optional) throw new BadRequestException(CommonDtoErrors.IS_NOT_MIME_TYPE);
			return next();
		}
		const [category, secondCategory] = file.mimetype.split('/');
		if (category !== this.category || (this.secondCategory && secondCategory !== this.secondCategory)) {
			throw new BadRequestException(CommonDtoErrors.INVALID_MIME_TYPE);
		}
		next();
	}
}
