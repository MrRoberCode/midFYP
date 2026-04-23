import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateSignupDto, CreateLoginDto } from '../dto/allDTO';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createSignupDto: CreateSignupDto): Promise<any> {
    // 1. Validate password is provided
    if (!createSignupDto.password) {
      throw new BadRequestException('Password is required');
    }

    // 2. Check if email already exists
    const existingUser = await this.userService.findUserByEmail(
      createSignupDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createSignupDto.password, salt);

    // 4. Create user
    const user = await this.userService.registerUser({
      ...createSignupDto,
      password: hashedPassword,
    });

    // 5. Generate JWT token
    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email,
    );
    const refreshToken = this.generateRefreshToken(
      user._id.toString(),
      user.email,
    );

    // 6. Return response without password
    return {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async login(createLoginDto: CreateLoginDto): Promise<any> {
    // 1. Validate credentials are provided
    if (!createLoginDto.email || !createLoginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    // 2. Find user by email
    const user = await this.userService.findUserByEmail(createLoginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Compare password
    const passwordMatch = await bcrypt.compare(
      createLoginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. Generate JWT token
    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email,
    );
    const refreshToken = this.generateRefreshToken(
      user._id.toString(),
      user.email,
    );

    // 5. Return response
    return {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  private generateAccessToken(userId: string, email: string): string {
    const payload = { userId, email };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      expiresIn: '1h', // 🔥 ACCESS TOKEN = 1 HOUR
    });
  }

  private generateRefreshToken(userId: string, email: string): string {
    const payload = { userId, email };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      expiresIn: '7d', // 🔁 REFRESH TOKEN = 7 DAYS
    });
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
