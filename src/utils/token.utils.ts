/* eslint-disable @typescript-eslint/no-var-requires */
import * as jwt from 'jsonwebtoken'
import * as conf from '../config/server.config.js'

export const createAccessToken = (body: Record<string, any>|string) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(body, conf.secret, { expiresIn: '3m' }, (err, encoded) => {
      if(err) return reject(err)
      return resolve(encoded)
    })
  })
  
}

export const checkAccessToken = (token: string) => {
  return new Promise<Record<string, any>|string>((resolve, reject) => {
    jwt.verify(token, conf.secret, (err: Error, payload: Record<string, any>|string) => {
      if(err) return reject(err)
      return resolve(payload)
    })
  })
  
}

export const createRefreshToken = async (body: Record<string, any>)  => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(body, conf.secret, { expiresIn: '3m' }, (err, encoded) => {
      if(err) return reject(err)
      return resolve(encoded)
    })
  })
  
}

export const checkRefreshToken = (token: string) => {
  return new Promise<Record<string, any>|string>((resolve, reject) => {
    jwt.verify(token, conf.secret, (err: Error, payload: Record<string, any>|string) => {
      if(err) reject(err)
      else resolve(payload)
    })
  })
}

export const refreshAccessToken = (token: string) => {
  return new Promise<string>(async (resolve, reject) => {
    await checkRefreshToken(token)
            .then(async payload => {
              return await createAccessToken(payload)
                            .then(encoded => resolve(encoded))
                            .catch(err => reject(err))
            })
            .catch(err => reject(err))
  })
  
}