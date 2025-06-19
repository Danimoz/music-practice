import { PrismaService } from "prisma/prisma.service";
import { LoginDto, RegisterDto } from "./users.dto";
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { compare, compareSync, hash } from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // User Management Methods
  async registerUser(registerDto: RegisterDto) {
    const { name, email, password, avatar, googleId } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // If password is provided and meets the length requirement, hash it
    let hashedPassword: undefined | string;
    if (password && password.length >= 6){
      hashedPassword = await hash(password, 10);
    }

    try {
      const newUser = await this.prisma.user.create({
        data: { name, email, password: hashedPassword, avatar, googleId },
        select: { id: true, name: true, email: true, avatar: true }
      });

      return {
        success: true,
        message: "User created successfully",
        user: newUser,
      }

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError){
        throw new BadRequestException("Invalid user data");
      }

      throw new InternalServerErrorException("Failed to create user");
    }
  }

  async validateUser(email: string, password: string){
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (user && (await compare(password, user.password as string))){
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }
    const tokens = await this.generateAndSaveTokens(user.id, user.email);
    return tokens    
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, avatar: true }
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async logout(userId: string, refreshToken: string) {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId }
    });

    const matchedToken = storedTokens.find((tokenRecord) =>
      compareSync(refreshToken, tokenRecord.token) // correctly compares bcrypt
    );

    if (matchedToken) {
      await this.prisma.refreshToken.delete({
        where: { id: matchedToken.id }
      });
    }

    return { success: true, message: "Logged out successfully" };
  }

  // Auth tokens
  async generateAndSaveTokens(userId: string, email: string){
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: '15m', secret: this.configService.get<string>('JWT_SECRET') }
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: '30d', secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
      )
    ])
  
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    return { accessToken, refreshToken }
  }

  async refreshTokens(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken)
    if (!payload) {
      throw new BadRequestException("Invalid refresh token");
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    const tokens = await this.generateAndSaveTokens(user!.id, user!.email);
    return tokens;
  }
}