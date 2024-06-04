import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { userContainer } from './user/user.container';
import { ExceptionFilter } from './filters/exception.filter';

const appContainer = new ContainerModule((bind) => {
	bind(App).to(App);
	bind(LoggerService).to(LoggerService);
	bind(ExceptionFilter).to(ExceptionFilter);
});

const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.load(appContainer);
	container.load(userContainer);

	const app = container.get(App);
	app.setGlobalPrefix('v1');
	await app.init();
};

bootstrap();
