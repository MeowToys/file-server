import { Injectable } from '@nestjs/common'
import { hashCompare } from '_src/utils/bcrypt.utils'
import { createAccessToken, createRefreshToken } from '_src/utils/token.utils'
import { warning, error } from '_src/utils/logger.utils'

@Injectable()
export class UserService {
  login(payload: Record<string, any>) {
    return new Promise<Record<string, string>>(async (resolve, reject) => {
      const passwd = payload.passwd || ''
      const { config } = await import('../../config/server.config.js')
      await hashCompare(passwd, config.hashedPassword)
              .then(async res => {
                if(res) {
                  const response = {
                    accessToken: await createAccessToken(payload),
                    refreshToken: await createRefreshToken(payload),
                  }
                  resolve(response)
                } else {
                  warning(`New Failed Login, Password: ${passwd}`)
                  reject('Login Failed')
                }
              })
              .catch(err => {
                error(`Login Error: ${err}`)
                reject(err)
              })
    })
  }
}