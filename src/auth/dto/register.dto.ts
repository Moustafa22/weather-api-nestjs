import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  isString,
  IsAlpha,
} from 'class-validator';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export class RegisterDto {
  @IsAlpha()
  @MinLength(2, { message: 'firstName must have atleast 2 characters.' })
  @MaxLength(20, { message: 'firstName must have atmost 20 characters.' })
  @IsNotEmpty()
  firstName: string;

  @IsAlpha()
  @MinLength(2, { message: 'lastName must have atleast 2 characters.' })
  @MaxLength(20, { message: 'lastName must have atmost 20 characters.' })
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one special character`,
  })
  password: string;
}
