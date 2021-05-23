import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { getHashed, hashCompare } from './bcrypt.utils'

describe('bcrypt module test', () => {
  describe('bcrypt hash module test', () => {
    [...Array(10).keys()].map(index => {
      test(`bcrypt hash test ${index}`, async () => {
        const str = uuid()
        const ans = bcrypt.hashSync(str, 10)
        const moduleAns = await getHashed(str)
        expect(bcrypt.compareSync(str, ans) && bcrypt.compareSync(str, moduleAns)).toBeTruthy()
      })
    })
  })

  describe('bcrypt compare module test', () => {
    [...Array(10).keys()].map(index => {
      test(`bcrypt compare test ${index}`, async () => {
        const str = uuid()
        const hashedStr = bcrypt.hashSync(str, 10)
        const ans = bcrypt.compareSync(str, hashedStr)
        const moduleAns = await hashCompare(str, hashedStr)
        expect(moduleAns).toBe(ans)
      })
    })
  })
})