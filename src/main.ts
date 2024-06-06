import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { userContainer } from './user/user.container';
import { ExceptionFilter } from './filters/exception.filter';
import { DatabaseService } from './database/database.service';
import { ConfigService } from './configs/config.service';
import { authContainer } from './auth/auth.container';
import { FileService } from './file/file.service';

const appContainer = new ContainerModule((bind) => {
	bind(App).to(App);
	bind(LoggerService).to(LoggerService);
	bind(ExceptionFilter).to(ExceptionFilter);
	bind(DatabaseService).to(DatabaseService);
	bind(ConfigService).to(ConfigService);
	bind(FileService).to(FileService);
});

const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.load(appContainer);
	container.load(userContainer);
	container.load(authContainer);

	const app = container.get(App);
	app.setGlobalPrefix('v1');
	await app.init();
};

bootstrap();
