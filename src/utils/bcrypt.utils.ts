import * as bcrypt from 'bcrypt'

export const getHashed = async (str: string, salt?: string) => {
  const hashed = await bcrypt.hash(str, salt || 10)
  return hashed
}

export const hashCompare = async (str: string, hashedStr: string) => {
  return await bcrypt.compare(str, hashedStr)
}