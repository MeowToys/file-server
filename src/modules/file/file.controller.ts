import { Body, Controller, Get, Headers, Param, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilesService } from './file.service'
import { Response, Request } from 'express'
import * as fs from 'fs'
import * as md5 from 'md5'
import * as path from 'path'
import { UploadFileDto, UploadFileHeaderDto } from './dto/upload.controller.dto'
import { getHashed, hashCompare } from '_src/utils/bcrypt.utils'
import { error, warning } from '_src/utils/logger.utils'
import { DownloadFileBodyDto, DownloadFileHeaderDto } from './dto/download.controller.dto'
import { ROOTDIR } from '_src/constants/common.constants'
import { checkAccessToken } from '_src/utils/token.utils'
import { FileListBodyDto } from './dto/list.controller.dto'

@Controller('file')
export class FilesController {

  constructor(private readonly fileService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>, @Body() upload: UploadFileDto, @Headers() header: UploadFileHeaderDto, @Res() response: Response) {
    
    await checkAccessToken(header['authorization'] && header['authorization'].split(' ')[1])
            .catch(() => {
              response.status(403).send()
              return Promise.reject('Unauthorized')
            })
      
    const res = files.map(async file => {
      try {
        const md5ed = md5(fs.readFileSync(file.path))
        if(!fs.existsSync(path.resolve(path.join(file.destination, md5ed))))
          fs.renameSync(file.path, path.resolve(path.join(file.destination, md5ed)))
        else 
          fs.rmSync(file.path)
        const dbFile = await this.fileService.create({
          filename: file.filename.split('.')[1],
          hashedFileName: md5ed,
          adminOnly: upload.isAdmin || false,
          isProtect: Boolean(upload.passwd || false),
          fileSize: file.size,
          type: file.mimetype,
          path: path.resolve(path.join(file.destination, md5ed)),
          preview: upload.preview || false,
          uploadTime: upload.timestamp || new Date().toTimeString(),
          hashedPasswd: upload.passwd && await getHashed(upload.passwd),
        })
        return {
          file: dbFile,
          isSuccess: true,
        }
      } catch(e) {
        error(`File create failed: ${e}`)
        return {
          file: file,
          isSuccess: false,
        }
      }
    })
    response.status(200).send({
      files: res,
      count: res.length,
    })
  }

  @Get(':hashedFileName/download')
  async download(@Body() body: DownloadFileBodyDto, @Headers() header: DownloadFileHeaderDto, @Param() params, @Res() res: Response) {
    try {
      const fileInfo = await this.fileService.findByHashedFileName(params.hashedFileName)
      await checkAccessToken(header['authorization'] && header['authorization'].split(' ')[1])
              .catch(async () => {
                if(fileInfo.isProtected) {
                  if(!body.passwd) {
                    res.status(403).send('Unauthorized')
                    return
                  }
                  if(!await hashCompare(body.passwd, fileInfo.hashedPasswd)) {
                    res.status(403).send('Unauthorized')
                    return
                  }
                }
                if(fileInfo.adminOnly) {
                  res.status(403).send('Unauthorized')
                  return
                }
            })
        
      res.download(path.resolve(path.join(ROOTDIR, './uploads', fileInfo.hashedFileName)), `${fileInfo.filename}.${fileInfo.type.split('/')[1]}`)
    } catch (e) {
      warning(`Access Denied: ${e}`)
      res.status(500).send()
    }
  }

  @Get(':hashedFileName/info')
  async getInfo(@Headers() header: DownloadFileHeaderDto, @Body() body: DownloadFileBodyDto, @Res() res: Response, @Param() params, @Req() req: Request) {
    let isAdmin = false
    await this.fileService.findByHashedFileName(params.hashedFileName)
            .then(async file => {
              if(file.adminOnly) {
                await checkAccessToken(header['authorization'] && header['authorization'].split(' ')[1])
                        .then(() => { isAdmin = true })
                        .catch(err => {
                          warning(`Failed filed access from ip ${req.ip}, ${err}`)
                          res.status(403).send('Unauthorized')
                          return
                        })
              }
              if(file.isProtected) {
                if(!isAdmin) {
                  if(!body.passwd) {
                    res.status(403).send('Unauthorized')
                    return
                  }
                  if(!await hashCompare(body.passwd, file.hashedPasswd)) {
                    res.status(403).send('Unauthorized')
                    return
                  }                  
                }
              }
              const response = {
                filename: file.filename,
                size: file.fileSize,
                uploadTime: file.uploadTime,
                hashedFileName: file.hashedFileName,
                type: file.type,
                preview: file.preview,
              }
              res.status(200).send(response)
            })
            .catch(() => {
              res.status(404).send('File Not Found')
            })
  }

  @Get(':hashedFileName/preview') 
  async getPreview(@Body() body: DownloadFileBodyDto, @Headers() header: DownloadFileHeaderDto, @Param() params, @Res() res: Response) {
    try {
      const file = await this.fileService.findByHashedFileName(params.hashedFileName)
      if(!file.preview) {
        res.status(403).send('Can\'t be previewed')
        return 
      }
      await checkAccessToken(header['authorization'] && header['authorization'].split(' ')[1])
              .catch(async () => {
                if(file.isProtected) {
                  if(!body.passwd) {
                    res.status(403).send('Unauthorized')
                    return
                  }
                  if(!await hashCompare(body.passwd, file.hashedPasswd)) {
                    res.status(403).send('Unauthorized')
                    return
                  }
                }
                if(file.adminOnly) {
                  res.status(403).send('Unauthorized')
                  return
                }
            })
        
      res.sendFile(path.resolve(path.join(ROOTDIR, './uploads', file.hashedFileName)), `${file.filename}.${file.type.split('/')[1]}`)
    } catch (e) {
      warning(`Access Denied: ${e}`)
      res.status(500).send()
    }
  }

  @Get()
  async getAll(@Body() body: FileListBodyDto, @Res() res: Response) {
    await this.fileService.findAll(body.pageSize || 12, body.page || 1)
            .then(files => {
              res.status(200).send({
                files,
                count: files.length,
              })
            })
            .catch(() => {
              res.status(500).send()
            })  
  }
}
