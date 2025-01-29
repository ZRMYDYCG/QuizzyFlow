const Mock = require('mockjs');
const Random = Mock.Random;

module.exports = [
    {
        url: '/api/question/:id',
        method: 'get',
        response() {
            return {
                code: 200,
                data: {
                    id: Random.id(),
                    title: Random.ctitle(),
                },
            };
        },
    },
    {
        url: '/api/question',
        method: 'post',
        response() {
            return {
                code: 200,
                data: {
                    id: Random.id(),
                }
            }
        }
    }
];
