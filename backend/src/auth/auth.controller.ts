import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.validateUserRegistration(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as UserDocument);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = req.user as {access_token: string };
    
    res.cookie('access_token', token.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    const jwt = req.user as { access_token: string };
    // redirect  to  frontend with JWT token
    res.redirect(`http://localhost:5173/auth/success?token=${jwt.access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}

