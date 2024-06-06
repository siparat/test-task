import { inject, injectable } from 'inversify';
import { join } from 'path';
import { ensureDirSync, writeFile } from 'fs-extra';
import { randomUUID } from 'crypto';
import { LoggerService } from '../logger/logger.service';
import { InternalServerError } from '../filters/exceptions/internal-server-error.exception';
import sharp from 'sharp';
import { SAVE_DIR_NAME, SAVE_DIR_PATH } from '../common/common.constants';

@injectable()
export class FileService {
	constructor(@inject(LoggerService) private logger: LoggerService) {
		ensureDirSync(SAVE_DIR_PATH);
	}

	async saveFile(file: Express.Multer.File, ext: string): Promise<string> {
		try {
			const filename = `${randomUUID()}.${ext}`;
			const fullPath = join(SAVE_DIR_PATH, filename);
			await writeFile(fullPath, file.buffer);
			const relativePath = join('/', SAVE_DIR_NAME as string, filename);
			return relativePath;
		} catch (error) {
			throw error instanceof Error
				? new InternalServerError(`Произошла ошибка при записи файла ${error.message}`)
				: error;
		}
	}

	toWebp(buffer: Buffer): Promise<Buffer> {
		return sharp(buffer).webp({ quality: 70 }).toBuffer();
	}
}
