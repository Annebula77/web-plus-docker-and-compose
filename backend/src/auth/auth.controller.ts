/* eslint-disable prettier/prettier */
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestUserDto } from './dto/login-request.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { USER_ALREADY_EXISTS_CONFLICT, USER_NOT_FOUND } from '../utils/consts';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService) { }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({ type: LoginRequestUserDto })
  @ApiResponse({ status: 200, description: 'User signed in', type: LoginResponseDto })
  @ApiNotFoundResponse({ description: USER_NOT_FOUND })
  async signinUser(@Request() req: Request & { user: User }): Promise<LoginResponseDto> {
    try {
      const loginResponse = await this.authService.login(req.user);
      return loginResponse;
    } catch (error) {
      throw error;
    }
  }
  @Post("signup")
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiResponse({ status: 201, description: 'User signed up', type: LoginResponseDto })
  @ApiBody({ type: CreateUserDto })
  @ApiNotFoundResponse({ description: USER_NOT_FOUND })
  @ApiConflictResponse({ description: USER_ALREADY_EXISTS_CONFLICT })
  async signupUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    /* При регистрации логиним пользователя и определяем для него токен */
    return this.authService.login(user);
  }

}