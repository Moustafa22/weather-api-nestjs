import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';
import { CurrentUser } from '../../utils/decorator/current-user.decorator';

@Controller('user')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  public async findOne(@CurrentUser() currentUser) {
    const user = await this.userService.findOne(currentUser.userId);
    user.hideSensitives();

    return user;
  }
}
