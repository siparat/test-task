import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ParseIntPipe } from '../pipes/parse-int.pipe';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ValidationMiddleware } from '../midlewares/validation.middleware';
import { UserUpdateDto } from './dto/user-update.dto';
import { NotFoundException } from '../filters/exceptions/not-found.exception';
import { UserErrorMessages } from './user.constants';
import { FileInterceptor } from '../interceptors/file.interceptor';
import { FileSizePipe } from '../pipes/file-size.pipe';
import { MimeTypePipe } from '../pipes/mime-type.pipe';
import { MimeTypeCategory } from '../common/common.types';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { FileService } from '../file/file.service';

@injectable()
export class ProfileController extends BaseController {
	constructor(
		@inject(LoggerService) private logger: LoggerService,
		@inject(UserService) private userService: UserService,
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(FileService) private fileService: FileService
	) {
		super(logger);
		this.bind('profile', [
			{
				path: ':id',
				method: 'put',
				handler: this.updateById,
				middlewares: [
					new JwtAuthGuard(),
					new ParseIntPipe('params', 'id'),
					new ValidationMiddleware(UserUpdateDto),
					new FileInterceptor(),
					new FileSizePipe(10_485_760, true),
					new MimeTypePipe(MimeTypeCategory.Image, undefined, true)
				]
			},
			{
				path: ':id',
				method: 'get',
				handler: this.getById,
				middlewares: [new JwtAuthGuard(), new ParseIntPipe('params', 'id')]
			}
		]);
	}

	async getById({ params }: Request, res: Response): Promise<void> {
		const id = +params.id;
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		this.ok(res, user);
	}

	async updateById(
		{ body, params, file }: Request<ParamsDictionary, Query, UserUpdateDto>,
		res: Response
	): Promise<void> {
		const id = +params.id;
		if (file) {
			file.buffer = await this.fileService.toWebp(file.buffer);
			const url = await this.fileService.saveFile(file, 'webp');
			body.avatar = url;
		}
		const updatedUser = await this.userService.updateUserInfo(id, body);
		this.ok(res, updatedUser);
	}
}
