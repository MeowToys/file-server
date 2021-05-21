export interface CreateFileDto {
  path: string
  filename: string
  hashedFileName: string
  isProtect: boolean
  hashedPasswd?: string
  preview: boolean
  adminOnly: boolean
  uploadTime: string
  fileSize: number
  type: string
}