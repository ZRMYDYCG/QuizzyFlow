import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtConstants } from './auth.constants'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy, // ← 注册 Passport JWT Strategy
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
