import { Injectable } from '@nestjs/common'
import { hashCompare } from '_src/utils/bcrypt.utils'
import { createAccessToken, createRefreshToken } from '_src/utils/token.utils'
import { warning, error } from '_src/utils/logger.utils'
import * as conf from '_src/config/server.config.js'

@Injectable()
export class UserService {
  login(payload: Record<string, any>) {
    return new Promise<Record<string, string>>(async (resolve, reject) => {
      const passwd = payload.passwd || ''
      await hashCompare(passwd, conf.hashedPassword)
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