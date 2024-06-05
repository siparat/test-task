import { inject, injectable } from 'inversify';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { ConflictException } from '../filters/exceptions/conflict.exception';
import { UserErrorMessages } from './user.constants';
import { UserEntity } from './entities/user.entity';
import { NotFoundException } from '../filters/exceptions/not-found.exception';
import { JwtPayload, UserLoginResponse } from './user.interfaces';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../configs/config.service';

@injectable()
export class UserService {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(ConfigService) private configService: ConfigService
	) {}

	async create(dto: RegisterDto): Promise<User> {
		const existedUser = await this.userRepository.findByEmail(dto.email);
		if (existedUser) {
			throw new ConflictException(UserErrorMessages.ALREADY_EXIST);
		}
		const entity = new UserEntity({ ...dto, passwordHash: '' });
		await entity.setPassword(dto.password);
		return this.userRepository.create(entity);
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		const entity = new UserEntity(existedUser);
		return entity.comparePassword(password);
	}

	async generateToken(payload: JwtPayload): Promise<UserLoginResponse> {
		const secret = this.configService.get('SECRET');
		const token = sign(payload, secret);
		return { token };
	}
}
