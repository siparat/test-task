import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserDtoErrors } from '../user.constants';
import { CommonDtoErrors } from '../../common/common.constants';

export class LoginDto {
	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL })
	email: string;

	@MaxLength(40, { message: UserDtoErrors.MAX_LENGTH_PASSWORD })
	@MinLength(8, { message: UserDtoErrors.MIN_LENGTH_PASSWORD })
	@IsString({ message: UserDtoErrors.INVALID_PASSWORD })
	password: string;
}
