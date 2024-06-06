import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../configs/config.service';
import { BaseStrategy } from '../../common/base.strategy';
import { Request } from 'express';
import { JwtPayload } from '../../user/user.interfaces';
import { UserRepository } from '../../user/user.repository';
import { User } from '@prisma/client';
import { NotFoundException } from '../../filters/exceptions/not-found.exception';
import { UserErrorMessages } from '../../user/user.constants';
import { inject } from 'inversify';

export class JwtStrategy extends BaseStrategy(Strategy, 'jwt') {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(ConfigService) configService: ConfigService
	) {
		const secret = configService.get('SECRET');
		super({
			ignoreExpiration: true,
			secretOrKey: secret,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true
		});
	}

	async validate(req: Request, { email }: JwtPayload): Promise<User> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new NotFoundException(UserErrorMessages.NOT_FOUND);
		}
		return user;
	}
}
