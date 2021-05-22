import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { error } from '_src/utils/logger.utils'
import { CreateFileDto } from './dto/create-file.service.dto'
import { FileDocument } from './file.schema'

@Injectable()
export class FilesService {
  constructor(@InjectModel('File') private fileModel: Model<FileDocument>) {}

  async create(createFileDto: CreateFileDto): Promise<FileDocument|string> {
    try {
      if(await this.fileModel.find({ hashedFileName: createFileDto.hashedFileName })) return Promise.reject('File Exist')
      const createFile = new this.fileModel(createFileDto)
      const savedFile = createFile.save()
      return savedFile
    } catch {
      error(`Create file failed\n`)
      return Promise.reject('Create Failed')
    }
  }

  async findByHashedFileName(hashedFileName: string) {
    try {
      const file = (await this.fileModel.findOne({ hashedFileName })).toObject()
      if(!file) return Promise.reject('File Not Exist')
      return file
    } catch (e) {
      error(`Query Error: ${e}`)
      return Promise.reject('Query Error')
    }
  }
}
