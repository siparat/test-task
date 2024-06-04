import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class DatabaseService {
	private client: PrismaClient;

	constructor() {
		this.client = new PrismaClient();
	}

	get user(): typeof this.client.user {
		return this.client.user;
	}

	async connect(): Promise<void> {
		await this.client.$connect();
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
