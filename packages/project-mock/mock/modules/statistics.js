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
]
