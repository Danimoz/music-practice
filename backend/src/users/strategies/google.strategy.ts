import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { UsersService } from "../users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') as string,
      scope: ['email', 'profile'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { name, emails, photos, id } = profile;
    let existingUser = await this.usersService.findByEmail(emails[0].value);
    if (!existingUser) {
      const response = await this.usersService.registerUser({
        email: emails[0].value,
        avatar: photos[0].value,
        name: name.givenName + ' ' + name.familyName,
        googleId: id,
      });
      existingUser = response.user;
    }

    done(null, existingUser)
  }
}