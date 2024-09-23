import { Injectable } from "@nestjs/common";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { GoogleUserDto } from "../dto/google-auth.dto";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService : ConfigService, private authService: AuthService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackUrl: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email'],
        })
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const {id, name, email} = profile;

        const googleUser: GoogleUserDto = {
            name: `${name.giveName} ${name.familyName}`,
            email: email[0].value,
            googleId: id

        }
        try {
            const user = this.authService.validateGoogleUser(googleUser)
            done(null, user)
        } catch (error) {
            done(error, false)
        }
        
    }

}