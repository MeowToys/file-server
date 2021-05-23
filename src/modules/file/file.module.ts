import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as path from 'path'
import { v4 as uuid} from 'uuid'
import { FilesController } from './file.controller'
import { FilesService } from './file.service'
import { FileSchema, File } from './file.schema'
import { ROOTDIR } from '_src/constants/common.constants'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: path.resolve(path.join(ROOTDIR, './uploads')),
        filename: (req, file, cb) => {
          const filename = `${uuid()}.${file.originalname}.${file.mimetype.split('/')[1]}`
          return cb(null, filename)
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}