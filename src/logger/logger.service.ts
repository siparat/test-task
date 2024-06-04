import { injectable } from 'inversify';
import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';
import 'reflect-metadata';

@injectable()
export class LoggerService {
	private logger: Logger;

	constructor() {
		this.logger = pino(pretty({ include: 'time,level', translateTime: 'yyyy-mm-dd HH:MM:ss' }));
	}

	log(message: string): void {
		this.logger.info(message);
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	error(message: string): void {
		this.logger.error(message);
	}
}
