import { ContainerModule } from 'inversify';
import { AuthService } from './auth.service';

export const authContainer = new ContainerModule((bind) => {
	bind(AuthService).to(AuthService);
});
