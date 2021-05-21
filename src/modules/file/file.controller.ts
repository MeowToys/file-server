import { Body, Controller, Get, Headers, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilesService } from './file.service'
import { Response } from 'express'
import * as fs from 'fs'
import * as md5 from 'md5'
import * as path from 'path'
import { UploadFileDto } from './dto/upload.controller.dto'
import { getHashed, hashCompare } from '_src/utils/bcrypt.utils'
import { error, warning } from '_src/utils/logger.utils'
import { DownloadFileBodyDto, DownloadFileHeadDto } from './dto/download.controller.dto'
import { ROOTDIR } from '_src/constants/common.constants'
@Controller('file')
export class FilesController {

  constructor(private readonly fileService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  upload(@UploadedFiles() files: Array<Express.Multer.File>, @Body() upload: UploadFileDto) {
    const res = files.map(async file => {
      try {
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

  @Get(':hashedFileName/download')
  async download(@Body() body: DownloadFileBodyDto, @Headers() head: DownloadFileHeadDto, @Param() params, @Res() res: Response) {
    try {
      const fileInfo = await this.fileService.findByHashedFileName(params.hashedFileName)
      if(fileInfo.isProtected) {
        if(!body.passwd) {
          res.status(403).send()
          return Promise.reject('Unathorized')
        }
        if(!await hashCompare(body.passwd, fileInfo.hashedPasswd)) {
          res.status(403).send()
          return Promise.reject('Unauthorized')
        }
      }
      res.download(path.resolve(path.join(ROOTDIR, './uploads', fileInfo.hashedFileName)), `${fileInfo.filename}.${fileInfo.type.split('/')[1]}`)
    } catch (e) {
      warning(`Access Denied: ${e}`)
      res.status(500).send()
    }
  }
}
