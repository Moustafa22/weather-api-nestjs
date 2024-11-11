import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.gaurd';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() =>
      JwtModule.register({
        secret: process.env.JWT_SECRET,
      }),
    ),
    // to avoid circular dependecy
    forwardRef(() => UserModule),
  ],
  providers: [PasswordService, AuthService, AuthGuard],
  exports: [PasswordService, AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
