const Mock = require('mockjs')
const Random = Mock.Random
const getQuestionList = require('./data/getQuestionList')

module.exports = [
    {
        /**
         * @api {get} /api/question/:id 获取单个问卷详情
         * */
        url: '/api/question/:id',
        method: 'get',
        response() {
            return {
                errno: 0,
                data: {
                    id: Random.id(),
                    title: Random.ctitle(),
                },
            };
        },
    },
    {
        /**
         * @api {post} /api/question 新增问卷
         * */
        url: '/api/question',
        method: 'post',
        response() {
            return {
                errno: 0,
                data: {
                    id: Random.id(),
                }
            }
        }
    },
    {
        /**
         * @api {get} /api/question 获取问卷列表
         * */
        url: '/api/question',
        method: 'get',
        response() {
            return {
                errno: 0,
                data: {
                    list: getQuestionList(), // 当前页的列表
                    total: 100, // 总数
                }
            }
        }
    }
]
