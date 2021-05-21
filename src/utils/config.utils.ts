import * as fs from 'fs'
import * as path from 'path'
import { warning, info } from './logger.utils'

export interface IConfig {
  database: {
    address: string
    port: number
  }
  [prop: string]: any
}

export const defaultConfig: IConfig = {
  database: {
    address: 'localhost',
    port: 27017,
  },
}

export const defaultPath = path.resolve(path.join(__dirname, '../../config/config.json'))

export class ServerConfig {
  configPath: fs.PathLike
  config: IConfig

  /**
   * set config file, if file is not provided, use default settings instead
   * @param configPath path of config.json, defaults to be 'file-server/config/config.json'
   */
  constructor(configPath: fs.PathLike = process.env['CONFIG_PATH'] || defaultPath) {
    this.configPath = configPath
    if(!fs.existsSync(this.configPath)) {
      warning(`No config file found on ${this.configPath}, use default config instead\n`)
      this.config = defaultConfig
      return
    }
    info(`config.json found on ${this.configPath}\n`)
    const overrideConfig = JSON.parse(fs.readFileSync(this.configPath, { encoding: 'utf-8' }))
    this.config = {
      ...defaultConfig,
      ...overrideConfig,
    }
  }

  get() {
    return this.config
  }

}