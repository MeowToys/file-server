import * as jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { createAccessToken } from './token.utils'

describe('jwt module test', () => {
  describe('create access token test', () => {
    [...Array(5).keys()].map(index => {
      test(`create access token test ${index}: type == string`, async () => {
        const payload = uuid()
        const ans = jwt.verify(jwt.sign(payload, `secret${index}`), `secret${index}`)
        const token = await createAccessToken(payload, `secret${index}`, false)
        const moduleAns = jwt.verify(token, `secret${index}`)
        expect(moduleAns).toBe(ans)
      })
    });

    [...Array(5).keys()].map(index => {
      test(`create access token test ${index}: type == object`, async () => {
        const payload = {
          test: uuid(),
          test2: uuid(),
        }
        const ans = jwt.verify(jwt.sign(payload, `secret${index}`, { expiresIn: '3m' }), `secret${index}`)
        const token = await createAccessToken(payload, `secret${index}`)
        const moduleAns = jwt.verify(token, `secret${index}`)
        expect(moduleAns).toEqual(ans)
      })
    })
  })
})