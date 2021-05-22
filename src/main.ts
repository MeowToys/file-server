import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ServerConfig } from './utils/config.utils'
import { getHashed } from './utils/bcrypt.utils'
import { warning, info, error } from './utils/logger.utils'
import * as inquirer from 'inquirer'
import { v4 as uuid } from 'uuid'
import { exit } from 'process'

const config = new ServerConfig()

async function start(port: number) {
  info('Generating token secret...')
  config.append({
    secret: uuid()
  })
  info('Token secret generated!')
  info(`Nest start at localhost:${port}`)
  const app = await NestFactory.create(AppModule)
  await app.listen(port)  
}

async function bootstrap() {
  
  if(!config.config.hasOwnProperty('hashedPassword')) {
    warning('No Password Found!')
    inquirer.prompt([
      {
        type: 'password',
        name: 'passwd',
        message: 'Enter your password:',
        validate: val => {
          return val ? true : 'No Input!'
        }
      }
    ])
    .then(async answer => {
      config.append({
        hashedPassword: await getHashed(answer.passwd)
      })
      info('Password created successfully')
      await start(3000)
    })
    .catch(msg => {
      error(`Initial Error: ${msg}`)
      exit(1)
    })
  } else {
    await start(3000)
  }
}
bootstrap()
