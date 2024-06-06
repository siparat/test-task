import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { NotFoundException } from '../filters/exceptions/not-found.exception';
import { UserErrorMessages } from './user.constants';

@injectable()
export class UserService {
	constructor(@inject(UserRepository) private userRepository: UserRepository) {}

	async updateUserInfo(id: number, dto: UserUpdateDto): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		const entity = new UserEntity({ ...user, ...dto });
		return this.userRepository.updateById(user.id, entity);
	}
}
