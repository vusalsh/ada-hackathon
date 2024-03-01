import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, ReportModule],
})
export class AppModule {}
