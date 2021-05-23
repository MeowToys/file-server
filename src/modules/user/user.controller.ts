import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { UserLoginDto, UserRefreshHeaderDto } from './dto/user.controller.dto'
import { Response, Request } from 'express'
import { warning, log, info } from '_src/utils/logger.utils'
import { refreshAccessToken } from '_src/utils/token.utils'

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

  @Get('refresh')
  async refresh(@Headers() header: UserRefreshHeaderDto, @Res() res: Response, @Req() req: Request) {

    if(!header['authorization']) {
      res.status(403).send()
      warning(`New refresh request with no header from ip ${req.ip}`)
    }
    await refreshAccessToken(header['authorization'].split(' ')[1])
          .then(accessToken => {
            res.status(200).send({
              accessToken
            })
            info(`refresh success from ip ${req.ip}`)
          })
          .catch(err => {
            res.status(403).send()
            warning(`Failed refresh from ip ${req.ip}, ${err}`)
          })
  }
}