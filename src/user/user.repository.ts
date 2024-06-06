import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../database/database.service';
import { UserEntity } from './entities/user.entity';

@injectable()
export class UserRepository {
	constructor(@inject(DatabaseService) private database: DatabaseService) {}

	create(entity: UserEntity): Promise<User> {
		return this.database.user.create({ data: entity });
	}

	findByEmail(email: string): Promise<User | null> {
		return this.database.user.findUnique({ where: { email } });
	}

	findById(id: number): Promise<User | null> {
		return this.database.user.findUnique({ where: { id } });
	}

	findByPage(page: number): Promise<User[]> {
		const take = 10;
		const skip = take * (page - 1);
		return this.database.user.findMany({ take, skip, orderBy: { createdAt: 'desc' } });
	}

	updateById(id: number, entity: UserEntity): Promise<User> {
		return this.database.user.update({ where: { id }, data: entity });
	}
}
