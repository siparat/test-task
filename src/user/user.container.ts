import { ContainerModule } from 'inversify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ProfileController } from './profile.controller';

export const userContainer = new ContainerModule((bind) => {
	bind(UserController).to(UserController);
	bind(UserService).to(UserService);
	bind(UserRepository).to(UserRepository);
	bind(ProfileController).to(ProfileController);
});
