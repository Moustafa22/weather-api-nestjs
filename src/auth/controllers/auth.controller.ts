import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  public constructor(protected authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
