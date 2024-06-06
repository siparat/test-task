import { HttpStatus } from '../../helpers/http-status.helper';
import { Exception } from '../base.exception';

export class UnauthorizedException extends Exception {
	constructor(message: unknown) {
		super(HttpStatus.UNAUTHORIZED, message);
	}
}
