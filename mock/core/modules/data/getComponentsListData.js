/**
 * 生成组件列表数据
 * */
const Mock = require('mockjs')
const Random = Mock.Random

function getComponentsListData() {
  return [
    // Title
    {
      fe_id: 'c1',
      type: 'question-title',
      title: '标题',
      isHidden: false,
      isLocked: false,
      props: {
        text: '个人信息调研问卷',
        level: 1,
        isCenter: false,
        animateType: 'none',
        typewriter: {
          isOpen: true,
          config: {
            speed: 50,
            cursor: '⎟',
          },
        },
      },
    },
    // Input
    {
      fe_id: 'c2',
      type: 'question-input',
      title: '输入框1',
      isHidden: false,
      isLocked: false,
      props: {
        title: '你的姓名',
        placeholder: '请输入你的姓名...',
      },
    },
    // Input
    {
      fe_id: 'c3',
      type: 'question-input',
      title: '输入框2',
      isHidden: false,
      isLocked: false,
      props: {
        title: '你的电话号码',
        placeholder: '请输入你的电话号码...',
      },
    },
    {
      fe_id: 'c4',
      type: 'question-input',
      title: '输入框3',
      isHidden: false,
      isLocked: false,
      props: {
        title: '你的住址',
        placeholder: '请输入你的住址...',
      },
    },
    {
      fe_id: 'c5',
      type: 'question-textarea',
      title: '',
      isHidden: false,
      isLocked: false,
      props: {
        title: '你对本次调研的建议',
        placeholder: '请输入你的建议...',
      },
    },
    {
      fe_id: 'c6',
      type: 'question-paragraph',
      title: '',
      isHidden: false,
      isLocked: false,
      props: {
        text: '感谢你参与本次调研，我们将会根据调研结果及时向您反馈。',
        isCenter: true,
      },
    },
    {
      fe_id: 'c7',
      type: 'question-radio',
      title: '性别',
      isHidden: false,
      isLocked: false,
      props: {
        type: '单选标题',
        isVertical: false,
        options: [
          {
            text: '男',
            value: 'male',
          },
          {
            text: '女',
            value: 'female',
          },
          {
            text: '保密',
            value: 'secret',
          },
        ],
      },
    },
    {
      fe_id: 'c8',
      type: 'question-checkbox',
      title: '兴趣爱好',
      isHidden: false,
      isLocked: false,
      props: {
        type: '多选标题',
        isVertical: false,
        list: [
          {
            text: '篮球',
            value: 'basketball',
            checked: false,
          },
          {
            text: '足球',
            value: 'football',
            checked: false,
          },
        ],
      },
    },
  ]
}

module.exports = getComponentsListData
