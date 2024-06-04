import { HttpStatus } from '../../helpers/http-status.helper';
import { Exception } from '../base.exception';

export class BadRequestException extends Exception {
	constructor(message: unknown) {
		super(HttpStatus.BAD_REQUEST, message);
	}
}
