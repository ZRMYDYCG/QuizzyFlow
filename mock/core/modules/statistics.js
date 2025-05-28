const Mock = require('mockjs')
const getStatisticsListData = require('./data/getStatisticsData')

const Random = Mock.Random

module.exports = [
  // 答卷统计列表
  {
    url: '/api/statistics/:questionId',
    method: 'get',
    response() {
      return {
        errno: 0,
        data: {
          total: 100,
          list: getStatisticsListData(21),
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
