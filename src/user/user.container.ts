import { ContainerModule } from 'inversify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

export const userContainer = new ContainerModule((bind) => {
	bind(UserController).to(UserController);
	bind(UserService).to(UserService);
	bind(UserRepository).to(UserRepository);
});
