import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { Role, RoleSchema } from './schemas/role.schema'
import { RbacModule } from '../rbac/rbac.module'
import { AdminLogModule } from '../admin-log/admin-log.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RbacModule,
    AdminLogModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

