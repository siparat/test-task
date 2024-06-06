import { path } from 'app-root-path';
import { join } from 'path';

export const CommonDtoErrors = {
	IS_NOT_EMAIL: 'Указан не email',
	IS_NOT_INT: 'Передано не число',
	IS_NOT_STRING: 'Указана не строка',
	FILE_NOT_EXIST: 'Файл не передан',
	INVALID_MIME_TYPE: 'Передан неверный тип файла',
	IS_NOT_MIME_TYPE: 'Указан не mime type'
};

export const SAVE_DIR_NAME = 'uploads';
export const SAVE_DIR_PATH = join(path, SAVE_DIR_NAME);
