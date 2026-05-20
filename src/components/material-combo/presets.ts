import type { MaterialComboGroup } from './types'

/** 基于现有表单物料的预设组合 */
export const materialComboGroups: MaterialComboGroup[] = [
  {
    groupName: '信息采集',
    combos: [
      {
        id: 'basic-profile',
        name: '个人基本信息',
        description: '姓名、手机、邮箱，适用于注册与资料收集',
        category: '信息采集',
        items: [
          {
            type: 'question-input',
            title: '姓名',
            props: { title: '您的姓名', placeholder: '请输入真实姓名' },
          },
          {
            type: 'question-phone-input',
            title: '手机',
            props: { title: '手机号码', placeholder: '请输入11位手机号' },
          },
          {
            type: 'question-email-input',
            title: '邮箱',
            props: { title: '电子邮箱', placeholder: 'example@email.com' },
          },
        ],
      },
      {
        id: 'contact-info',
        name: '联系方式',
        description: '手机与邮箱，适合回访与通知',
        category: '信息采集',
        items: [
          {
            type: 'question-phone-input',
            props: { title: '联系电话', placeholder: '便于我们与您联系' },
          },
          {
            type: 'question-email-input',
            props: { title: '联系邮箱', placeholder: '用于发送确认信息' },
          },
        ],
      },
      {
        id: 'account-register',
        name: '账号注册',
        description: '用户名、密码、邮箱、手机',
        category: '信息采集',
        items: [
          {
            type: 'question-input',
            title: '用户名',
            props: { title: '用户名', placeholder: '4-20 个字符' },
          },
          {
            type: 'question-password-input',
            title: '密码',
            props: { title: '登录密码', placeholder: '请设置密码' },
          },
          {
            type: 'question-email-input',
            props: { title: '绑定邮箱' },
          },
          {
            type: 'question-phone-input',
            props: { title: '绑定手机' },
          },
        ],
      },
      {
        id: 'demographics',
        name: '性别与年龄',
        description: '人口统计学常用字段',
        category: '信息采集',
        items: [
          {
            type: 'question-radio',
            title: '性别',
            props: {
              title: '您的性别',
              options: [
                { value: 'male', text: '男' },
                { value: 'female', text: '女' },
                { value: 'other', text: '不愿透露' },
              ],
            },
          },
          {
            type: 'question-number-input',
            title: '年龄',
            props: {
              title: '您的年龄',
              placeholder: '请输入年龄',
              min: 1,
              max: 120,
            },
          },
        ],
      },
    ],
  },
  {
    groupName: '调研反馈',
    combos: [
      {
        id: 'satisfaction-survey',
        name: '满意度调研',
        description: '星级评分 + 文字反馈',
        category: '调研反馈',
        items: [
          {
            type: 'question-rate',
            title: '整体评分',
            props: { label: '请为本次体验打分', count: 5 },
          },
          {
            type: 'question-textarea',
            title: '改进建议',
            props: {
              title: '您有什么建议？',
              placeholder: '请描述您的想法，帮助我们改进…',
            },
          },
        ],
      },
      {
        id: 'nps-feedback',
        name: '推荐意愿',
        description: '推荐度单选 + 原因说明',
        category: '调研反馈',
        items: [
          {
            type: 'question-radio',
            title: '推荐度',
            props: {
              title: '您有多大意愿向朋友推荐我们？',
              isVertical: false,
              options: [
                { value: '0', text: '0 - 完全不会' },
                { value: '5', text: '5 - 中立' },
                { value: '10', text: '10 - 非常愿意' },
              ],
            },
          },
          {
            type: 'question-textarea',
            title: '推荐原因',
            props: {
              title: '请简要说明您的评分原因',
              placeholder: '选填',
            },
          },
        ],
      },
      {
        id: 'quick-feedback',
        name: '快速反馈',
        description: '评分 + 是否愿意回访',
        category: '调研反馈',
        items: [
          {
            type: 'question-rate',
            props: { label: '本次服务满意度' },
          },
          {
            type: 'question-radio',
            title: '回访意愿',
            props: {
              title: '是否愿意接受回访？',
              options: [
                { value: 'yes', text: '愿意' },
                { value: 'no', text: '不愿意' },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    groupName: '登记预约',
    combos: [
      {
        id: 'event-signup',
        name: '活动报名',
        description: '姓名、手机、场次选择',
        category: '登记预约',
        items: [
          {
            type: 'question-input',
            props: { title: '报名人姓名', placeholder: '请输入姓名' },
          },
          {
            type: 'question-phone-input',
            props: { title: '联系电话' },
          },
          {
            type: 'question-select',
            title: '场次',
            props: {
              placeholder: '请选择参加场次',
              options: [
                { value: 'morning', label: '上午场 09:00-12:00' },
                { value: 'afternoon', label: '下午场 14:00-17:00' },
                { value: 'evening', label: '晚间场 19:00-21:00' },
              ],
            },
          },
        ],
      },
      {
        id: 'appointment-slot',
        name: '预约时段',
        description: '日期、时间、备注',
        category: '登记预约',
        items: [
          {
            type: 'question-date',
            title: '预约日期',
            props: { label: '请选择预约日期', placeholder: '选择日期' },
          },
          {
            type: 'question-time-picker',
            title: '预约时间',
            props: { title: '请选择时间段', placeholder: '选择时间' },
          },
          {
            type: 'question-textarea',
            title: '备注',
            props: {
              title: '其他说明',
              placeholder: '如有特殊需求请填写',
            },
          },
        ],
      },
      {
        id: 'address-detail',
        name: '地址信息',
        description: '省市区级联 + 详细地址',
        category: '登记预约',
        items: [
          {
            type: 'question-cascader',
            title: '所在地区',
            props: { placeholder: '请选择省 / 市 / 区' },
          },
          {
            type: 'question-textarea',
            title: '详细地址',
            props: {
              title: '街道、门牌号等',
              placeholder: '请输入详细地址',
            },
          },
        ],
      },
    ],
  },
  {
    groupName: '选择与偏好',
    combos: [
      {
        id: 'preference-poll',
        name: '偏好调研',
        description: '多选兴趣 + 补充说明',
        category: '选择与偏好',
        items: [
          {
            type: 'question-checkbox',
            title: '兴趣方向',
            props: {
              title: '您感兴趣的方向（可多选）',
              list: [
                { value: 'tech', text: '科技', checked: false },
                { value: 'design', text: '设计', checked: false },
                { value: 'business', text: '商业', checked: false },
                { value: 'life', text: '生活', checked: false },
              ],
            },
          },
          {
            type: 'question-textarea',
            props: {
              title: '其他补充',
              placeholder: '如有其他想法请填写',
            },
          },
        ],
      },
      {
        id: 'single-with-detail',
        name: '单选 + 说明',
        description: '单项选择后可填写详情',
        category: '选择与偏好',
        items: [
          {
            type: 'question-radio',
            props: {
              title: '请选择最符合的选项',
              options: [
                { value: 'a', text: '选项 A' },
                { value: 'b', text: '选项 B' },
                { value: 'c', text: '选项 C' },
              ],
            },
          },
          {
            type: 'question-textarea',
            props: {
              title: '补充说明',
              placeholder: '选填，可进一步描述',
            },
          },
        ],
      },
    ],
  },
]
