export interface UploadFileDto {
  passwd?: string
  isAdmin?: boolean
  preview?: boolean
  [prop: string]: any
}

export interface UploadFileHeaderDto {
  authorization?: string
}