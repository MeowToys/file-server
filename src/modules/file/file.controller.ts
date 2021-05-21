import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilesService } from './file.service'
import * as fs from 'fs'
import * as md5 from 'md5'
import * as path from 'path'
import { uploadFileDto } from './dto/upload.controller.dto'
import { getHashed } from '_src/utils/bcrypt.utils'
import { error } from '_src/utils/logger.utils'

@Controller('file')
export class FilesController {

  constructor(private readonly fileService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  upload(@UploadedFiles() files: Array<Express.Multer.File>, @Body() upload: uploadFileDto) {
    const res = files.map(async file => {
      try {
        console.log(file)
        const md5ed = md5(fs.readFileSync(file.path))
        fs.renameSync(file.path, path.resolve(path.join(file.destination, md5ed)))
        const dbFile = await this.fileService.create({
          filename: file.filename,
          hashedFileName: md5ed,
          adminOnly: upload.isAdmin || false,
          isProtect: Boolean(upload.passwd || false),
          fileSize: file.size,
          type: file.mimetype,
          path: file.path,
          preview: upload.preview || false,
          uploadTime: upload.timestamp || new Date().toTimeString(),
          hashedPasswd: upload.passwd && await getHashed(upload.passwd)
        })
        return {
          file: dbFile,
          isSuccess: true,
        }
      } catch(e) {
        error(`File create failed${e && `: ${e}`}\n`)
        return {
          file: file,
          isSuccess: false,
        }
      }
    })
    return {
      files: res,
      count: res.length,
    }
  }
}
