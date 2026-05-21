import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { RoleService } from '../modules/role/role.service'
import { PermissionService } from '../modules/permission/permission.service'
import { UserService } from '../modules/user/user.service'
import { DEFAULT_ROLES } from '../common/constants/permissions'

/**
 * RBAC 系统初始化脚本
 * 初始化默认角色、权限和超级管理员账户
 */
async function bootstrap() {
  console.log('🚀 开始初始化 RBAC 系统...\n')

  const app = await NestFactory.createApplicationContext(AppModule)

  const roleService = app.get(RoleService)
  const permissionService = app.get(PermissionService)
  const userService = app.get(UserService)

  try {
    // 1. 初始化系统权限
    console.log('📋 正在初始化系统权限...')
    await permissionService.initializeSystemPermissions()
    const permissions = await permissionService.findAll({})
    console.log(`✅ 成功初始化 ${permissions.length} 个权限\n`)

    // 2. 创建默认角色
    console.log('👥 正在创建默认角色...')
    const existingRoles = await roleService.findAll({})
    
    if (existingRoles.length === 0) {
      for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
        await roleService.create(roleData as any, 'system')
        console.log(`  ✓ 创建角色: ${roleData.displayName} (${roleData.name})`)
      }
      console.log('✅ 默认角色创建完成\n')
    } else {
      console.log(`⚠️  已存在 ${existingRoles.length} 个角色，跳过创建\n`)
    }

    // 3. 创建超级管理员账户
    console.log('👤 正在创建超级管理员账户...')
    try {
      const existingSuperAdmin = await userService.findByUsername('admin@quizzyflow.com')
      if (!existingSuperAdmin) {
        await userService.create({
          username: 'admin@quizzyflow.com',
          password: 'admin123456',
          nickname: '超级管理员',
        })
        
        // 更新用户角色
        const adminUser = await userService.findByUsername('admin@quizzyflow.com')
        if (adminUser) {
          await userService.updateUserRole(
            adminUser._id.toString(),
            'super_admin',
            'system'
          )
        }
        
        console.log('✅ 超级管理员账户创建成功')
        console.log('   用户名: admin@quizzyflow.com')
        console.log('   密码: admin123456')
        console.log('   ⚠️  请在首次登录后立即修改密码！\n')
      } else {
        console.log('⚠️  超级管理员账户已存在，跳过创建\n')
      }
    } catch (error) {
      console.error('❌ 创建超级管理员失败:', error)
    }

    // 4. 显示统计信息
    const roles = await roleService.findAll({})
    const allPermissions = await permissionService.findAll({})
    
    console.log('📊 初始化完成统计:')
    console.log(`   - 总权限数: ${allPermissions.length}`)
    console.log(`   - 总角色数: ${roles.length}`)
    console.log('   - 角色列表:')
    for (const role of roles) {
      console.log(`     • ${role.displayName} (${role.name}) - ${role.permissions.length} 个权限`)
    }
    
    console.log('\n✨ RBAC 系统初始化完成！')
    console.log('\n下一步:')
    console.log('  1. 使用 admin@quizzyflow.com / admin123456 登录系统')
    console.log('  2. 访问 http://localhost:8000/admin/dashboard')
    console.log('  3. 在「用户管理 → 分配权限」中为员工分配路由与按钮权限')
    console.log('  4. 系统仅允许一名超级管理员，不可删除或降级\n')

  } catch (error) {
    console.error('❌ 初始化失败:', error)
    process.exit(1)
  }

  await app.close()
  process.exit(0)
}


// 脚本启动：pnpm exec ts-node -r tsconfig-paths/register src/scripts/init-rbac.ts
bootstrap()

