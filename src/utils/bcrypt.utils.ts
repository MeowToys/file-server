import * as bcrypt from 'bcrypt'

export const getHashed = async (str: string) => {
  const hashed = await bcrypt.hash(str, 10)
  return hashed
}

export const hashCompare = async (str: string, hashedStr: string) => {
  return await bcrypt.compare(str, hashedStr)
}