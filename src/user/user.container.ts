import { ContainerModule } from 'inversify';
import { UserController } from './user.controller';

export const userContainer = new ContainerModule((bind) => {
	bind(UserController).to(UserController);
});
