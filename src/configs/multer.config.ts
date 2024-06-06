import multer, { Options } from 'multer';

export const multerConfig: Options = {
	dest: 'storage',
	storage: multer.memoryStorage()
};
