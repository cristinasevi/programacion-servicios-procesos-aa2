import { Module, NestModule, MiddlewareConsumer, Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from './users/user.entity';
import { Guild } from './guilds/guild.entity';
import { Channel } from './channels/channel.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GuildsModule } from './guilds/guilds.module';
import { ChannelsModule } from './channels/channels.module';

@Injectable()
class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const inicio = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - inicio;
      this.logger.log(`${method} ${originalUrl} ${res.statusCode} - ${ms}ms`);
    });

    next();
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'discord_user',
      password: process.env.DB_PASS || 'discord_pass',
      database: process.env.DB_NAME || 'discord_db',
      entities: [User, Guild, Channel],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    GuildsModule,
    ChannelsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
