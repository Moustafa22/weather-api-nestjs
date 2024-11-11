import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

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
      // inject user data into the request context
      request.authUser = payload;
      // pass the request for the next middleware/interceptor
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
