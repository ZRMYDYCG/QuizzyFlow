import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  BadRequestException,
  Request,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UserService } from './user.service'

// 文件上传配置
const storage = diskStorage({
  destination: './uploads/avatars', // 存储路径
  filename: (req, file, callback) => {
    // 生成唯一文件名: 时间戳-随机数.扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = extname(file.originalname)
    callback(null, `avatar-${uniqueSuffix}${ext}`)
  },
})

// 文件过滤器（只允许图片）
const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return callback(
      new BadRequestException('只允许上传图片文件（jpg, jpeg, png, gif, webp）'),
      false,
    )
  }
  callback(null, true)
}

@ApiTags('用户')
@Controller('user')
export class UploadController {
  constructor(private readonly userService: UserService) {}

  /**
   * 上传头像
   * POST /api/user/avatar
   */
  @ApiOperation({
    summary: '上传头像',
    description: '上传用户头像图片',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '上传成功',
    schema: {
      properties: {
        message: { type: 'string', example: '头像上传成功' },
        avatar: { type: 'string', example: '/uploads/avatars/avatar-xxx.jpg' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '文件格式不正确或文件过大',
  })
  @ApiBearerAuth()
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 限制 5MB
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file: any, @Request() req) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    const userId = req.user.sub

    // 生成访问路径
    const avatarUrl = `/uploads/avatars/${file.filename}`

    // 更新用户头像
    await this.userService.updateProfile(userId, { avatar: avatarUrl })

    return {
      avatar: avatarUrl,
      message: '头像上传成功',
    }
  }
}

