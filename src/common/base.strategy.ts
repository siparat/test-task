/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';

export const BaseStrategy = <T extends new (...args: any[]) => object>(
	Strategy: T,
	name: string
): new (...opt: ConstructorParameters<T> extends [...infer Rest, object] ? Rest : never) => any => {
	abstract class MixinStrategy extends Strategy {
		abstract validate(...args: unknown[]): unknown;

		constructor(...args: any[]) {
			const callback = async (...params: any[]): Promise<void> => {
				const done = params[params.length - 1];
				try {
					const result = await this.validate(...params);
					if (Array.isArray(result)) {
						done(null, ...result);
					} else {
						done(null, result);
					}
				} catch (error) {
					done(error, null);
				}
			};
			super(...args, callback);

			passport.use(name, this as unknown as passport.Strategy);
		}
	}
	return MixinStrategy;
};
