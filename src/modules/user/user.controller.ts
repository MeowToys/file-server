import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { UserLoginDto } from './dto/user.controller.dto'
import { Response } from 'express'
import { warning, log } from '_src/utils/logger.utils'

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    
    await this.userService.login(body)
              .then(payload => {
                res.status(200).send(payload)
                log(`New Login with Password: ${body.passwd}`)
              })
              .catch(err => {
                warning(`Failed Login with Password: ${body.passwd}\n${err}`)
                res.status(403).send()
              })
  }
}