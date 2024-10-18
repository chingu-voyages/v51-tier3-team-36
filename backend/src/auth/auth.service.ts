import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { RegisterDto } from './dto/create-auth.dto';
import { GoogleUserDto } from './dto/google-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { AuthenticatedUser } from './interfaces/authenticat-user.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}




  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    if(!user.password) {
      throw new BadRequestException("User has not set a password, Please set a password to enable login with email.")
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
      }
    
    return null;
  }

  // manual registration and Google OAuth registration
  async validateUserRegistration(user: RegisterDto): Promise<{ access_token: string; user: AuthenticatedUser }> {
    const userCheck = await this.usersService.findByEmail(user.email);

    if (userCheck) {
      throw new ConflictException('Email already exists')
    }

    ;
    const newUser = await this.usersService.create({
      name: user.name,
      email: user.email,
      password: user.password
    });
    
    return this.login(newUser)

  }

  // Google OAuth registration
  async validateGoogleUser(googleUser: GoogleUserDto): Promise<{ access_token: string; user: AuthenticatedUser }> {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);
      if (user) {

        if (user.googleId && user.googleId !== googleUser.googleId) {
          throw new ConflictException("This Email is already linked with another account")
        }
        user.googleId = googleUser.googleId;
        await user.save();
      } else {
        user = await this.usersService.create({
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId
        });
      }
    }

    return this.login(user )
  }

  async login(user: UserDocument): Promise<{ access_token: string; user: AuthenticatedUser }> {
    const payload: JwtPayload = { email: user.email, sub: user._id.toString() };
    const token = this.jwtService.sign(payload)

    const userData = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
    }

    return {
      access_token: token,
      user: userData,
    };
  }
}