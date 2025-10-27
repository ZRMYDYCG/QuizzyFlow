import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminLogController } from './admin-log.controller'
import { AdminLogService } from './admin-log.service'
import { AdminLog, AdminLogSchema } from './schemas/admin-log.schema'
import { RbacModule } from '../rbac/rbac.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdminLog.name, schema: AdminLogSchema }]),
    forwardRef(() => RbacModule),
  ],
  controllers: [AdminLogController],
  providers: [AdminLogService],
  exports: [AdminLogService],
})
export class AdminLogModule {}

