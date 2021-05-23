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
      if(await this.fileModel.findOne({ hashedFileName: createFileDto.hashedFileName })) return Promise.reject('File Exist')
      const createFile = new this.fileModel(createFileDto)
      const savedFile = await createFile.save()
      return savedFile
    } catch {
      error(`Create file failed\n`)
      return Promise.reject('Create Failed')
    }
  }

  async findByHashedFileName(hashedFileName: string) {
    try {
      const file = await this.fileModel.findOne({ hashedFileName }).lean()
      if(!file) return Promise.reject('File Not Exist')
      return Promise.resolve(file)
    } catch (e) {
      error(`Query Error: ${e}`)
      return Promise.reject('Query Error')
    }
  }

  async findAll(pageSize = 12, page = 1) {
    try {
      const files = await this.fileModel
                              .find()
                              .select('filename fileSize hashedFileName type uploadTime adminOnly preview isProtected -_id')
                              .sort('filename')
                              .skip(pageSize * (page - 1))
                              .limit(pageSize)
                              .lean()
      return Promise.resolve(files)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async deleteByHashedFileName(hashedFileName: string) {
    try {
      const file = await this.fileModel.findOneAndRemove({ hashedFileName })
      if(!file) return Promise.resolve(true)
      return Promise.resolve(true)
    } catch (e) {
      error(`Query Error: ${e}`)
      return Promise.reject('Query Error')
    }
  }
}
