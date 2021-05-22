export interface UploadFileDto {
  passwd?: string
  isAdmin?: boolean
  preview?: boolean
  timestamp?: string
  [prop: string]: any
}

export interface UploadFileHeaderDto {
  authorization?: string
}