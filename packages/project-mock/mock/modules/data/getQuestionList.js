/*
* @description: 问卷列表模拟数据
* */
const Mock = require('mockjs')
const Random = Mock.Random

const getQuestionList = ( options = {} ) => {

    const { len = 10, isDeleted = false,  isStar = false, page = 1 } = options
    const list = []

    console.log(options)

    for(let i = 0; i < len; i++) {
        list.push({
            _id: Random.id(),
            title: Random.ctitle(),
            isPublish: Random.boolean(),
            isStar: isStar,
            answerCount: Random.integer(0, 100),
            createdAt: Random.datetime(),
            isDeleted: isDeleted  // 软删除
        })
    }
    return list
}

module.exports = getQuestionList