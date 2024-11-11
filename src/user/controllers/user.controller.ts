import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';

@Controller('user')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  public async findOne(@Request() req) {
    // extract user from req's token
    const authUser = req.authUser;

    const user = await this.userService.findOne(authUser.userId);
    user.hideSensitives();

    return user;
  }
}
