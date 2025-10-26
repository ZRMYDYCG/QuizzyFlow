import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RbacService } from './rbac.service'
import { Role, RoleSchema } from '../role/schemas/role.schema'
import { Permission, PermissionSchema } from '../permission/schemas/permission.schema'
import { User, UserSchema } from '../user/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}

