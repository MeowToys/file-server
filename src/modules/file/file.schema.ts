import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type FileDocument = File & Document

@Schema()
export class File extends Document {
  @Prop()
  path: string

  @Prop()
  filename: string

  @Prop()
  hashedFileName: string

  @Prop()
  isProtected: boolean

  @Prop({
    required: false
  })
  hashedPasswd: string

  @Prop()
  preview: boolean

  @Prop()
  adminOnly: boolean

  @Prop()
  uploadTime: string

  @Prop()
  fileSize: number

  @Prop()
  type: string
}

export const FileSchema = SchemaFactory.createForClass(File)