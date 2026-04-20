import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild } from './guild.entity';
import { GuildsService } from './guilds.service';
import { GuildsController } from './guilds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Guild])],
  controllers: [GuildsController],
  providers: [GuildsService],
})
export class GuildsModule {}
