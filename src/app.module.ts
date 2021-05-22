import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FilesModule } from './modules/file/file.module'
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost/dev`),
    FilesModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService, 
  ],
})
export class AppModule {}
