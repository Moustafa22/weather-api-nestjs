import { IsAlpha, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsAlpha()
  @MinLength(2, { message: 'city must have atleast 2 characters.' })
  @MaxLength(50, { message: 'city must have atmost 50 characters.' })
  @IsNotEmpty()
  city: string;
}
