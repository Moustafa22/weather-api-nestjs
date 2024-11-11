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

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{6,20}$/;

export class CreateUserDto {
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
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 6 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  password: string;
}
