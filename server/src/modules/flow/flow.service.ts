import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Flow, FlowDocument } from './schemas/flow.schema'
import { CreateFlowDto } from './dto/create-flow.dto'
import { UpdateFlowDto } from './dto/update-flow.dto'
import { QueryFlowDto } from './dto/query-flow.dto'

@Injectable()
export class FlowService {
  constructor(
    @InjectModel(Flow.name) private flowModel: Model<FlowDocument>,
  ) {}

  async create(username: string, createDto?: CreateFlowDto) {
    const flow = new this.flowModel({
      title: createDto?.title || '未命名工作流',
      description: createDto?.description || '',
      author: username,
      nodes: createDto?.nodes || [],
      edges: createDto?.edges || [],
      viewport: createDto?.viewport || { x: 0, y: 0, zoom: 1 },
      nodeCount: createDto?.nodes?.length || 0,
      edgeCount: createDto?.edges?.length || 0,
    })

    return await flow.save()
  }

  async findAll(username: string, query: QueryFlowDto) {
    const { keyword, page = 1, pageSize = 10, isStar, isDeleted = false } =
      query

    const filter: any = { author: username, isDeleted }

    if (isStar !== undefined) {
      filter.isStar = isStar
    }

    if (keyword) {
      filter.$text = { $search: keyword }
    }

    const skip = (page - 1) * pageSize

    const [list, total] = await Promise.all([
      this.flowModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select('-nodes -edges') // 列表不返回节点数据，减少数据量
        .exec(),
      this.flowModel.countDocuments(filter),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  async findOne(id: string, username: string) {
    const flow = await this.flowModel.findById(id)

    if (!flow) {
      throw new NotFoundException('工作流不存在')
    }

    if (flow.author !== username) {
      throw new ForbiddenException('无权访问此工作流')
    }

    return flow
  }

  async update(id: string, username: string, updateDto: UpdateFlowDto) {
    const flow = await this.findOne(id, username)

    Object.assign(flow, updateDto)

    // 更新统计
    if (updateDto.nodes) {
      flow.nodeCount = updateDto.nodes.length
    }
    if (updateDto.edges) {
      flow.edgeCount = updateDto.edges.length
    }

    return await flow.save()
  }

  async batchDelete(ids: string[], username: string) {
    const result = await this.flowModel.updateMany(
      {
        _id: { $in: ids },
        author: username,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
    )

    return {
      message: `成功删除 ${result.modifiedCount} 个工作流`,
      count: result.modifiedCount,
    }
  }

  async restore(id: string, username: string) {
    const flow = await this.flowModel.findOne({
      _id: id,
      author: username,
    })

    if (!flow) {
      throw new NotFoundException('工作流不存在')
    }

    flow.isDeleted = false
    flow.deletedAt = null

    return await flow.save()
  }

  async permanentDelete(id: string, username: string) {
    const result = await this.flowModel.deleteOne({
      _id: id,
      author: username,
      isDeleted: true,
    })

    if (result.deletedCount === 0) {
      throw new NotFoundException('工作流不存在或未在回收站中')
    }

    return { message: '永久删除成功' }
  }

  async duplicate(id: string, username: string) {
    const originalFlow = await this.findOne(id, username)

    const newFlow = new this.flowModel({
      title: `${originalFlow.title} (副本)`,
      description: originalFlow.description,
      author: username,
      nodes: originalFlow.nodes,
      edges: originalFlow.edges,
      viewport: originalFlow.viewport,
      nodeCount: originalFlow.nodeCount,
      edgeCount: originalFlow.edgeCount,
    })

    return await newFlow.save()
  }

  async updateThumbnail(id: string, thumbnail: string) {
    const flow = await this.flowModel.findById(id)

    if (!flow) {
      throw new NotFoundException('工作流不存在')
    }

    flow.thumbnail = thumbnail
    return await flow.save()
  }

  async getStatistics(username: string) {
    const [total, starCount, deletedCount] = await Promise.all([
      this.flowModel.countDocuments({ author: username, isDeleted: false }),
      this.flowModel.countDocuments({
        author: username,
        isStar: true,
        isDeleted: false,
      }),
      this.flowModel.countDocuments({ author: username, isDeleted: true }),
    ])

    return {
      total,
      starCount,
      deletedCount,
    }
  }
}

