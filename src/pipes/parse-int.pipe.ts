import { NextFunction, Request, Response } from 'express';
import { BaseMiddleware } from '../common/base.middleware';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';
import { CommonDtoErrors } from '../common/common.constants';

export class ParseIntPipe extends BaseMiddleware {
	constructor(
		private object: Extract<keyof Request, 'query' | 'params'>,
		private key: string
	) {
		super();
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		const value = Number(req[this.object][this.key]);
		if (!value || Number.isNaN(value)) {
			throw new BadRequestException(CommonDtoErrors.IS_NOT_INT);
		}
		(req[this.object][this.key] as unknown as number) = value;
		next();
	}
}
