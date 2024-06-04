import { inject, injectable } from 'inversify';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { ConflictException } from '../filters/exceptions/conflict.exception';
import { UserErrorMessages } from './user.constants';
import { UserEntity } from './entities/user.entity';

@injectable()
export class UserService {
	constructor(@inject(UserRepository) private userRepository: UserRepository) {}

	async create(dto: RegisterDto): Promise<User> {
		const existedUser = await this.userRepository.findByEmail(dto.email);
		if (existedUser) {
			throw new ConflictException(UserErrorMessages.ALREADY_EXIST);
		}
		const entity = new UserEntity({ ...dto, passwordHash: '' });
		await entity.setPassword(dto.password);
		return this.userRepository.create(entity);
	}
}
