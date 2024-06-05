import { inject, injectable } from 'inversify';
import { DotenvParseOutput, config } from 'dotenv';
import { LoggerService } from '../logger/logger.service';

@injectable()
export class ConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(LoggerService) private logger: LoggerService) {
		const { error, parsed } = config();
		if (error) {
			throw error;
		}
		if (!parsed) {
			this.logger.warn('Файл .env пуст');
		}
		this.config = parsed ?? {};
	}

	get(key: string): string {
		return this.config[key];
	}
}
