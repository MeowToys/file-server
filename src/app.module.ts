import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FileService } from './modules/file/file.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
