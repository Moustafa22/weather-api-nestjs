import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // get token from headers
    const token = this.extractTokenFromHeader(request);

    // check if token passed
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // verify the token, and get the data
      const payload = await this.authService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // inject user data in the request
      request.authUser = payload;
      // pass the request for next middleware/interceptor
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
