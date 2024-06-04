import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../common/base.middleware';
import { plainToInstance } from 'class-transformer';
import { ValidatorOptions, validate } from 'class-validator';
import { BadRequestException } from '../filters/exceptions/bad-request.exception';

export class ValidationMiddleware extends BaseMiddleware {
	constructor(
		private classToTranform: new () => object,
		private options?: ValidatorOptions
	) {
		super();
	}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToInstance(this.classToTranform, body);
		const result = await validate(instance, this.options);
		if (!result.length) {
			return next();
		}
		const errorObject = result.map((r) => ({ [r.property]: r.constraints }));
		return next(new BadRequestException(errorObject));
	}
}
