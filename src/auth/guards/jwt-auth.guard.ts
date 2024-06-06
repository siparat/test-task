import { BaseMiddleware } from '../../common/base.middleware';
import passport from 'passport';
import { UnauthorizedException } from '../../filters/exceptions/unauthorized.exception';
import { AuthErrorMessages } from '../../auth/auth.constants';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export class JwtAuthGuard extends BaseMiddleware {
	constructor() {
		super();
	}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		await passport.authenticate('jwt', { session: false }, (err: Error | null, user?: User, info?: object) => {
			if (!user || info instanceof Error || !!err) {
				return next(new UnauthorizedException(AuthErrorMessages.UNAUTHORIZED));
			}
			req.user = user;
			next();
		})(req, res, next);
	}
}
