import { Module } from '@nestjs/common';
import { PlayController } from './play.controller';

@Module({
  controllers: [PlayController],
})
export class PlayModule {}
