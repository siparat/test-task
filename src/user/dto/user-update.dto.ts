import { Sex } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { CommonDtoErrors } from '../../common/common.constants';
import { UserDtoErrors } from '../user.constants';

export class UserUpdateDto {
	@MinLength(2, { message: UserDtoErrors.INVALID_NAME })
	@IsString({ message: UserDtoErrors.INVALID_NAME })
	@IsOptional()
	name?: string;

	@MinLength(2, { message: UserDtoErrors.INVALID_LASTNAME })
	@IsString({ message: UserDtoErrors.INVALID_LASTNAME })
	@IsOptional()
	lastName?: string;

	@IsEmail({}, { message: CommonDtoErrors.IS_NOT_EMAIL })
	@IsOptional()
	email?: string;

	@IsUrl({}, { message: UserDtoErrors.INVALID_AVATAR_URL })
	@IsString({ message: CommonDtoErrors.IS_NOT_STRING })
	@IsOptional()
	avatar?: string;

	@IsEnum(Sex, { message: UserDtoErrors.IS_NOT_SEX })
	@IsOptional()
	sex?: Sex;
}
