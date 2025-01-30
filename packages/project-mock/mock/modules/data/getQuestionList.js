/*
* @description: 问卷列表模拟数据
* */
const Mock = require('mockjs')
const Random = Mock.Random

const getQuestionList = (len = 10, isDeleted = false) => {
    const list = []

    for(let i = 0; i < len; i++) {
        list.push({
            _id: Random.id(),
            title: Random.ctitle(),
            isPublished: Random.boolean(),
            isStar: Random.boolean(),
            answerCount: Random.integer(0, 100),
            createdAt: Random.datetime(),
            isDeleted: Random.boolean()  // 软删除
        })
    }

    return list
}

module.exports = getQuestionList