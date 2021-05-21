import * as fs from 'fs'
import * as path from 'path'
import { red } from 'chalk'

export const defaultConfig = {
  address: 'localhost',
  port: 27017,
}

export const defaultPath = path.resolve(path.join(__dirname, '../../config/config.json'))

export class MeowFileServerConfig {
  configPath: fs.PathLike
  config: Record<string, unknown>

  /**
   * set config file, if file is not provided, use default settings instead
   * @param configPath path of config.json, defaults to be 'file-server/config/config.json'
   */
  constructor(configPath: fs.PathLike = defaultPath) {
    this.configPath = configPath
    if(!fs.existsSync(this.configPath)) {
      red(`No config file found, use default config instead\n`)
      this.config = defaultConfig
      return
    }
    const overrideConfig = JSON.parse(fs.readFileSync(this.configPath, { encoding: 'utf-8' }))
    this.config = {
      ...defaultConfig,
      ...overrideConfig,
    }
  }

  /**
   * update config, maintain current config if file is not provided
   * 
   * new config is a mixin of new config and current config
   * @param configPath path of new config.json
   */
  refreshConfig = (configPath: fs.PathLike) => {
    if(!fs.existsSync(configPath)) {
      red('No config file found, maintain current config')
      return
    }
    this.configPath = configPath
    const overrideConfig = JSON.parse(fs.readFileSync(this.configPath, { encoding: 'utf-8' }))
    this.config = {
      ...this.config,
      ...overrideConfig,
    }
  }

}