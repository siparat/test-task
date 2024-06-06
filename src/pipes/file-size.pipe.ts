import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../common/base.middleware';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';
import { CommonDtoErrors } from '../common/common.constants';

export class FileSizePipe extends BaseMiddleware {
	constructor(
		private sizeBytes: number,
		private optional: boolean = false
	) {
		super();
	}

	execute({ file }: Request, res: Response, next: NextFunction): void | Promise<void> {
		if (!file) {
			if (!this.optional) throw new BadRequestException(CommonDtoErrors.FILE_NOT_EXIST);
			return next();
		}
		if (file.size > this.sizeBytes) {
			throw new BadRequestException(`Максимальный размер файла – ${this.sizeBytes}B`);
		}
		next();
	}
}
