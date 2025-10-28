import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SystemConfigController } from './system-config.controller'
import { SystemConfigService } from './system-config.service'
import {
  SystemConfig,
  SystemConfigSchema,
} from './schemas/system-config.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemConfig.name, schema: SystemConfigSchema },
    ]),
  ],
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}

