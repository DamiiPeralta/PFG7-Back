import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from "./config/typeorm"
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import { SprintModule } from './sprint/sprint.module';
import { MailchimpModule } from './mailchimp/mailchimp.module';
import { PayPalModule } from './paypal/paypal.module';
import { PayPalController } from './paypal/paypal.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [typeOrmConfig]

    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService: ConfigService) => 
      configService.get("typeorm")
    }),
    JwtModule.register({
      global:true,
      signOptions:{expiresIn:"1h"},
      secret:process.env.JWT_SECRET
    }),
    AuthModule, UserModule, TaskModule, TeamModule, FileUploadModule, SprintModule,MailchimpModule,PayPalModule
    ],
  controllers: [PayPalController],
  providers: [],
})
export class AppModule {}
