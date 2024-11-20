import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt ,Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { UserDocument } from "src/users/schemas/user.schema";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from "../interfaces/authenticat-user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService : ConfigService ,private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        })
    }

    async validate(payload: JwtPayload): Promise<UserDocument> {
        const user = await this.usersService.findOne(payload.sub)
        if (!user) {
            throw new UnauthorizedException('Invalid Token')
        }
        return user

}
}