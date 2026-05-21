const Mock = require('mockjs')
const getStatisticsListData = require('./data/getStatisticsData')

const Random = Mock.Random

module.exports = [
  {
    url: '/api/statistics/:questionId/overview',
    method: 'get',
    response() {
      return {
        errno: 0,
        data: {
          total: 100,
          avgDurationSeconds: 128,
          anonymousCount: 35,
          namedCount: 65,
          lastSubmittedAt: new Date().toISOString(),
          firstSubmittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      }
    },
  },
  {
    url: '/api/statistics/:questionId/export',
    method: 'get',
    response() {
      const list = getStatisticsListData(50)
      return {
        errno: 0,
        data: { total: list.length, list },
      }
    },
  },
  // 答卷统计列表
  {
    url: '/api/statistics/:questionId',
    method: 'get',
    response() {
      return {
        errno: 0,
        data: {
          total: 100,
          list: getStatisticsListData(10),
        },
      }
    },
  },
  // 获取单个组件的统计数据
  {
    url: '/api/statistics/:questionId/:componentId',
    method: 'get',
    response() {
      return {
        errno: 0,
        data: {
          stat: [
            {
              name: '选项1',
              count: Random.integer(0, 100),
            },
            {
              name: '选项2',
              count: Random.integer(0, 100),
            },
            {
              name: '选项3',
              count: Random.integer(0, 100),
            },
          ],
        },
      }
    },
  },
]
