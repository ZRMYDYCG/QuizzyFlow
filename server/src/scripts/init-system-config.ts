/**
 * 初始化系统配置脚本
 * 运行方式：npm run init-config
 */
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { SystemConfigService } from '../modules/system-config/system-config.service'

async function initSystemConfig() {
  console.log('🚀 开始初始化系统配置...')

  const app = await NestFactory.createApplicationContext(AppModule)
  const systemConfigService = app.get(SystemConfigService)

  try {
    const result = await systemConfigService.initializeDefaultConfig()
    console.log('✅ 系统配置初始化成功:', result)
  } catch (error) {
    console.error('❌ 系统配置初始化失败:', error.message)
  } finally {
    await app.close()
  }
}

initSystemConfig()

