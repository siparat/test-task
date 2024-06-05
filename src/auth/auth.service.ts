import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { JwtPayload, sign } from 'jsonwebtoken';
import { ConfigService } from '../configs/config.service';
import { ConflictException } from '../filters/exceptions/conflict.exception';
import { NotFoundException } from '../filters/exceptions/not-found.exception';
import { RegisterDto } from '../user/dto/register.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserErrorMessages } from '../user/user.constants';
import { UserLoginResponse } from '../user/user.interfaces';
import { UserRepository } from '../user/user.repository';

@injectable()
export class AuthService {
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
