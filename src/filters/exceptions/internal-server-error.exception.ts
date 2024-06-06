import { HttpStatus } from '../../helpers/http-status.helper';
import { Exception } from '../base.exception';

export class InternalServerError extends Exception {
	constructor(message: unknown) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, message);
	}
}
