import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtVerifyOptions } from '@nestjs/jwt/dist/interfaces';
import { PasswordService } from './password.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export interface AuthResults {
  access_token: string;
  user: Partial<User>;
}

export interface TokenPayload {
  sub: number;
  userId: number;
  email: string;
  username: string;
}

@Injectable()
export class AuthService {
  public constructor(
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private usersService: UserService,
  ) {}

  /**
   * Sign in the user, takes the credentials and returns the JWT token
   * @param username username passed from signin form
   * @param pass password entered from signing form
   * @returns Promise<AuthResults>
   * @throws BadRequestException
   */
  public async signIn(loginDto: LoginDto): Promise<AuthResults> {
    const username = loginDto.username;
    const password = loginDto.password;

    const user = await this.validateCredentials(username, password);

    // form the payload
    const payload: TokenPayload = this.formTokenPayload(user);

    // hide user's sesitive data before return the user object to the client
    user.hideSensitives();

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  public async register(registerDto: RegisterDto): Promise<AuthResults> {
    const username = registerDto.username;
    const email = registerDto.email;
    const password = registerDto.password;

    await this.validateCredentialExistance(username, email);

    // hash the password
    registerDto.password = await this.passwordService.hashPassword(password);

    // create the user in the database
    const user = await this.usersService.create(registerDto);

    // form a login Dto
    const loginDto: LoginDto = { password, username };

    // log the user in and return the token
    return this.signIn(loginDto);
  }

  /**
   * Verify token and get encrypted payload
   * @param token string
   * @param options JwtVerifyOptions
   * @returns Promise<TokenPayload> decrypted data
   * @throws Exception when the token is invalid
   */
  public async verify(token: string, options?: JwtVerifyOptions): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, options);
  }

  /**
   * Prepare the token payload to be encrypted in the token
   * @param user user object
   * @returns TokenPayload
   */
  private formTokenPayload(user: User): TokenPayload {
    return {
      sub: user.id,
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }

  /**
   * Validates the credentials
   * throws 'wrong username or password' in both cases to not expose valid user emails
   * @param username
   * @param password
   * @returns User
   * @thorws BadRequestException
   */
  private async validateCredentials(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      // couldn't find the user
      throw new BadRequestException(['wrong username or password']);
    }

    const correctPass = await this.passwordService.verifyPassword(user.password, password);
    if (!correctPass) {
      // the password is wrong
      throw new BadRequestException(['wrong username or password']);
    }
    return user;
  }

  /**
   * Validates the existancec of the credentials, throws error when usename/email is taken
   * @param username
   * @param email
   * @returns void
   * @throws BadRequestException
   */
  private async validateCredentialExistance(username: string, email: string) {
    var checkUsername = await this.usersService.findOneByUsername(username);
    if (checkUsername) {
      throw new BadRequestException(['username is already taken']);
    }

    var checkEmail = await this.usersService.findOneByEmail(email);
    if (checkEmail) {
      throw new BadRequestException(['email is already taken']);
    }
  }
}
