import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { userContainer } from './user/user.container';
import { ExceptionFilter } from './filters/exception.filter';
import { DatabaseService } from './database/database.service';
import { ConfigService } from './configs/config.service';

const appContainer = new ContainerModule((bind) => {
	bind(App).to(App);
	bind(LoggerService).to(LoggerService);
	bind(ExceptionFilter).to(ExceptionFilter);
	bind(DatabaseService).to(DatabaseService);
	bind(ConfigService).to(ConfigService);
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
