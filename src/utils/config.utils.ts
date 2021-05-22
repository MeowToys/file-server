import * as fs from 'fs'
import * as path from 'path'
import { warning, info, error } from './logger.utils'
import { SRCDIR } from '../constants/common.constants'

export interface IConfig extends Object {
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

export const defaultPath = path.resolve(path.join(SRCDIR, './config/config.json'))
console.log('!!!', defaultPath)

export class ServerConfig {
  configPath: fs.PathLike
  configSavePath: string
  config: IConfig

  /**
   * set config file, if file is not provided, use default settings instead
   * @param configPath path of config.json, defaults to be 'file-server/config/config.json'
   */
  constructor(configPath: fs.PathLike = defaultPath) {
    this.configPath = configPath
    if(!fs.existsSync(this.configPath)) {
      warning(`No config file found on ${this.configPath}, use default config instead\n`)
      this.config = defaultConfig
    } else {
      info(`config.json found on ${this.configPath}\n`)
      const overrideConfig = JSON.parse(fs.readFileSync(this.configPath, { encoding: 'utf-8' }))
      this.config = {
        ...defaultConfig,
        ...overrideConfig,
      }
    }
    
    this.configSavePath = path.resolve(path.join(SRCDIR, './config'))

    ServerConfig.writeConfig(this.config, this.configSavePath)
  }

  /**
   * 
   * @param config config need to write in a js file
   * @param targetPath config FOLDER position, auto genenrete server.config.js, path need to be resolved, and generate .json at the same time
   */
  private static writeConfig(config: IConfig, targetPath: string) {
    try {
      if(!fs.existsSync(path.resolve(targetPath))) fs.mkdirSync(path.resolve(targetPath))
      if(fs.existsSync(path.resolve(path.join(targetPath, './server.config.js')))) fs.rmSync(path.resolve(path.join(targetPath, './server.config.js')))
      if(fs.existsSync(path.resolve(path.join(targetPath, './config.json')))) fs.rmSync(path.resolve(path.join(targetPath, './config.json')))
      fs.appendFileSync(path.resolve(path.join(targetPath, './config.json')), JSON.stringify(config, null, 2))
      fs.appendFileSync(path.resolve(path.join(targetPath, './server.config.js')), `const configFile = ${JSON.stringify(config, null, 2)}\nmodule.export = configFile`)
      info(`config write complete`)
    } catch (e) {
      error(`config write failed: ${e}`)
    }
  }

  get() {
    return this.config
  }

  append(config: Record<string, any>) {
    this.config = {
      ...this.config,
      ...config,
    }
    ServerConfig.writeConfig(this.config, this.configSavePath)
  }

}