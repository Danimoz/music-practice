import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./users.dto";
import { Public } from "./decorators/public.decorators";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res) {
    const user = await this.usersService.registerUser(registerDto);
    const tokens = await this.usersService.generateAndSaveTokens(user.user.id, user.user.email);
    return res.json({ 
      user: user.user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    })
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully'})
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto)
  }

  
  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.usersService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google/login')
  async googleAuth() {
    // Initiates the Google OAuth flow
  }
  
  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res){
    const user = req.user;
    const tokens = await this.usersService.generateAndSaveTokens(user.id, user.email);
    return res.redirect(`http://localhost:3000/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  }
}