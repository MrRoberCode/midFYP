import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/types/user.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSignupDto {
  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

   @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

 @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class CreateLoginDto {
   @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

   @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

// For backward compatibility
export class RegisterUserDto {
   @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

 @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

   @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
 
   @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
