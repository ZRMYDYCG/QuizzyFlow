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
          // 该问卷的组件列表
          componentList: [
            // Title
            {
              fe_id: Random.id(),
              type: 'question-title',
              title: '标题',
              props: {
                text: '个人信息调研问卷',
                level: 1,
                isCenter: false,
              },
            },
            // Input
            {
              fe_id: Random.id(),
              type: 'question-input',
              title: '输入框',
              props: {
                title: '你的姓名',
                placeholder: '请输入你的姓名...',
              },
            },
            // Input
            {
              fe_id: Random.id(),
              type: 'question-input',
              title: '输入框',
              props: {
                title: '你的电话号码',
                placeholder: '请输入你的电话号码...',
              },
            },
          ],
        },
      }
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
        },
      }
    },
  },
  {
    /**
     * @api {get} /api/question 获取问卷列表
     * */
    url: '/api/question',
    method: 'get',
    response(ctx) {
      const isDeleted = ctx.query.isDeleted
      const isStar = ctx.query.isPublish
      const page = ctx.query.page || 1
      const pageSize = ctx.query.pageSize || 10

      console.log(isDeleted, isStar, page, pageSize)

      return {
        errno: 0,
        data: {
          list: getQuestionList({ isDeleted, isStar, page, len: pageSize }), // 当前页的列表
          total: 100, // 总数
        },
      }
    },
  },
  {
    /**
     * @api {patch} /api/question/:id 更新问卷
     * */
    url: '/api/question/:id',
    method: 'patch',
    response() {
      return {
        errno: 0,
      }
    },
  },
  {
    /**
     *  @api {post} /api/question/duplicate/:id 复制问卷
     * */
    url: '/api/question/duplicate/:id',
    method: 'post',
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
        },
      }
    },
  },
  {
    /**
     * @api {delete} /api/question/:id 批量删除问卷
     * */
    url: '/api/question',
    method: 'delete',
    response() {
      return {
        errno: 0,
      }
    },
  },
]
