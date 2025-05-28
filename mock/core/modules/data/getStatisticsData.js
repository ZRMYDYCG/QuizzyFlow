/**
 * 生成统计列表
 * */
const Mock = require('mockjs')
const getComponentsListData = require('./getComponentsListData')

const Random = Mock.Random

module.exports = function getStatisticsListData(len = 10) {
  const res = []
  const componentsListData = getComponentsListData()

  for (let i = 0; i < len; i++) {
    const stat = {
      _id: Random.id(),
    }

    componentsListData.forEach((item) => {
      const { fe_id, type, props } = item

      switch (type) {
        case 'question-input':
          stat[fe_id] = Random.ctitle()
          break
        case 'question-textarea':
          stat[fe_id] = Random.ctitle()
          break
        case 'question-radio':
          stat[fe_id] = props.options[0].text
          break
        case 'question-checkbox':
          stat[fe_id] = `${props.list[0].text}, ${props.list[1].text}`
          break
      }
    })
    res.push(stat)
  }

  return res
}
