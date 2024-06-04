import { Sex } from '@prisma/client';
import { IUserEntity } from '../user.interfaces';
import { compare, genSalt, hash } from 'bcrypt';

export class UserEntity {
	id?: number;
	name: string;
	lastName?: string;
	email: string;
	passwordHash: string;
	avatar?: string;
	sex?: Sex;

	constructor(user: IUserEntity) {
		this.id = user.id;
		this.name = user.name;
		this.lastName = user.lastName ?? undefined;
		this.email = user.email;
		this.passwordHash = user.passwordHash;
		this.avatar = user.avatar ?? undefined;
		this.sex = user.sex ?? undefined;
	}

	async setPassword(password: string): Promise<this> {
		this.passwordHash = await hash(password, await genSalt(10));
		return this;
	}

	compare(password: string): Promise<boolean> {
		return compare(this.passwordHash, password);
	}
}
