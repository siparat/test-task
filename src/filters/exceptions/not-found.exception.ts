import { HttpStatus } from '../../helpers/http-status.helper';
import { Exception } from '../base.exception';

export class NotFoundException extends Exception {
	constructor(message: unknown) {
		super(HttpStatus.NOT_FOUND, message);
	}
}
