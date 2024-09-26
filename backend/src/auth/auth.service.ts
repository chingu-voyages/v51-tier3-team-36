import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { RegisterDto } from './dto/create-auth.dto';
import { GoogleUserDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    
    return null;
  }

  // manual registration
  async validateUserRegistration(user: RegisterDto): Promise<{access_token: string}> {
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
  async validateGoogleUser(googleUser: GoogleUserDto): Promise<{ access_token: string }> {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);
      if (user) {
        user.googleId = googleUser.googleId;
        await user.save();
      } else {
        user = await this.usersService.createUserGoogle({
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId
        });
      }
    }

    const payload: JwtPayload = { email: user.email, sub: user._id.toString() };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload: JwtPayload = { email: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}