import { HttpStatus } from '../../helpers/http-status.helper';
import { Exception } from '../base.exception';

export class ConflictException extends Exception {
	constructor(message: unknown) {
		super(HttpStatus.CONFLICT, message);
	}
}
