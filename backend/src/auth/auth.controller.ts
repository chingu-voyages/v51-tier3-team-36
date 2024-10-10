import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from './interfaces/authenticat-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({summary: 'Register a user'})
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async register(@Body() user: RegisterDto) {
    return this.authService.validateUserRegistration(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({summary: 'Login a user'})
  @ApiBody({type: LoginDto})
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUser
    return this.authService.login(user as any);
  }

  @ApiOperation({summary: 'Initiate google login'})
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    
  }

  @ApiOperation({summary: 'Google auth callback'})
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {


    const token = await this.authService.login(req.user as UserDocument)

    res.cookie('access_token', token.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    // redirect  to  frontend with JWT token when available
    // res.redirect(`http://localhost:5173/api/auth/success?token=${token.access_token}`);

    // temporary success page
    res.redirect(`/api/auth/success?token=${token.access_token}`);
  }

  @ApiOperation({summary: 'Get user profile'})
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('success')
  @ApiOperation({ summary: 'Handle OAuth success' })
  handleSuccess(@Req() req: Request, @Res() res: Response) {
    const token = req.query.token as string ;

    if (!token) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Authentication Failed</title>
          </head>
          <body>
            <h1>Authentication Failed!</h1>
            <p>No token provided.</p>
          </body>
        </html>
      `);
    }

    res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <h1>Authentication Successful!</h1>
          <p>You can close this window.</p>
          <p>Your token: ${token}</p>
        </body>
      </html>
    `);
  }
}
