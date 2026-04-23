import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSignupDto, CreateLoginDto } from '../dto/allDTO';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({ status: 201, description: 'User created successfully!' })
  @ApiBody({ type: CreateSignupDto })
  signup(@Body() createSignupDto: CreateSignupDto) {
    return this.authService.signup(createSignupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }
}
