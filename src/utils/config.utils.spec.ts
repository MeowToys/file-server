import { defaultConfig, ServerConfig, defaultPath } from './config.utils'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'

describe('config initital', () => {

  describe('no path', () => {

    const existFile = fs.existsSync(defaultPath)
    let tempFile = ''
    if(existFile) {
      tempFile = fs.readFileSync(defaultPath, { encoding: 'utf-8' })
      fs.rmSync(defaultPath)
    }

    afterAll(() => {
      if(fs.existsSync(defaultPath)) {
        if(!existFile) {
          fs.rmSync(defaultPath)
        } else {
          fs.appendFileSync(defaultPath, tempFile)
        }
      }
    })

    test('no config.json provided', () => {
      const config = new ServerConfig()
      expect(config.config).toEqual(defaultConfig)
    })
  })
  describe('default path', () => {

    const existFile = fs.existsSync(defaultPath)
    let tempFile = ''
    if(existFile) {
      
      tempFile = fs.readFileSync(defaultPath, { encoding: 'utf-8' })
    }
    let testObj = {}

    beforeEach(() => {
      if(fs.existsSync(defaultPath)) { 
        fs.rmSync(defaultPath)
      }
      testObj = {
        test: '1234',
        test4: '222',
      }
      fs.appendFileSync(defaultPath, JSON.stringify(testObj))
    })

    afterEach(() => {
      if(existFile) {
        fs.rmSync(defaultPath)
        fs.appendFileSync(defaultPath, tempFile)
      } else {
        fs.rmSync(defaultPath)
      }
    })

    test('default path test 1', () => {
      const config = new ServerConfig()
      expect(config.config).toEqual({
        ...defaultConfig,
        ...testObj,
      })
    })
  })
  describe('custom path', () => {
    let testObj = {}
    let fileName = ''
    let filePath = ''

    beforeEach(() => {
      filePath = uuid()
      fileName = uuid() + '.json'
      const tempFileName = path.resolve(path.join(__dirname, `${filePath}/${fileName}`))
      const tempFilePath = path.resolve(path.join(__dirname, filePath))
      if(fs.existsSync(tempFileName)) fs.rmSync(tempFileName)
      testObj = {
        test: uuid(),
        test114514: 114514,
        testBoolean: false,
      }
      fs.mkdirSync(tempFilePath)
      fs.appendFileSync(tempFileName, JSON.stringify(testObj))
    })

    afterEach(() => {
      const tempFilePath = path.resolve(path.join(__dirname, filePath))
      if(fs.existsSync(tempFilePath)) fs.rmSync(tempFilePath, { recursive: true, force: true })
    })

    for(let i = 0; i < 10; i++) {
      test(`custom path test ${i}`, () => {
        const config = new ServerConfig(path.resolve(path.join(__dirname, `${filePath}/${fileName}`)))
        expect(config.config).toEqual({
          ...defaultConfig,
          ...testObj,
        })
      })
    }
  })
})