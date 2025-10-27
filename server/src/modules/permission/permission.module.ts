import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'
import { Permission, PermissionSchema } from './schemas/permission.schema'
import { RbacModule } from '../rbac/rbac.module'
import { AdminLogModule } from '../admin-log/admin-log.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    forwardRef(() => RbacModule),
    forwardRef(() => AdminLogModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}

