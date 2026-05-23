import type { QuestionComponentType } from '@/store/modules/question-component'
import type { CommunityTemplate } from '@/types/community-template'

function comp(
  fe_id: string,
  type: string,
  title: string,
  props: Record<string, unknown>
): QuestionComponentType {
  return {
    fe_id,
    type,
    title,
    isHidden: false,
    isLocked: false,
    props: props as QuestionComponentType['props'],
  }
}

function schema(
  title: string,
  desc: string,
  components: QuestionComponentType[]
): CommunityTemplate['schema'] {
  return { title, desc, componentList: components }
}

export const communityTemplates: CommunityTemplate[] = [
  {
    id: 'tpl-spring-sale',
    title: '春季促销问卷',
    author: 'QuizzyFlow 官方',
    cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: 320,
    tags: ['营销', '促销'],
    likes: 1280,
    views: 5600,
    description: '适合电商春季大促活动的用户调研与偏好收集。',
    schema: schema('春季促销问卷', '帮助我们了解您的购物偏好', [
      comp('c_spring_radio', 'question-radio', '您最关注的促销品类', {
        title: '您最关注的促销品类',
        isVertical: false,
        options: [
          { value: 'option1', text: '服饰鞋包' },
          { value: 'option2', text: '数码家电' },
          { value: 'option3', text: '美妆护肤' },
          { value: 'option4', text: '食品生鲜' },
        ],
      }),
      comp('c_spring_rate', 'question-rate', '促销力度满意度', {
        label: '对本次促销力度的满意度',
        count: 5,
        allowHalf: true,
        allowClear: true,
        showValue: true,
      }),
    ]),
  },
  {
    id: 'tpl-employee-survey',
    title: '员工满意度调查',
    author: 'HR 小助手',
    cover: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    height: 420,
    tags: ['HR', '企业'],
    likes: 890,
    views: 3200,
    description: '年度员工满意度与工作环境反馈模板。',
    schema: schema('员工满意度调查', '您的反馈对我们很重要', [
      comp('c_emp_rate', 'question-rate', '整体工作满意度', {
        label: '整体工作满意度',
        count: 5,
        allowHalf: false,
        allowClear: true,
        showValue: true,
      }),
      comp('c_emp_checkbox', 'question-checkbox', '您最看重的工作因素', {
        title: '您最看重的工作因素',
        isVertical: false,
        list: [
          { value: 'option1', text: '薪酬福利', checked: false },
          { value: 'option2', text: '成长空间', checked: false },
          { value: 'option3', text: '团队氛围', checked: false },
          { value: 'option4', text: '工作弹性', checked: false },
        ],
      }),
      comp('c_emp_textarea', 'question-textarea', '改进建议', {
        title: '还有哪些可以改进？',
        placeholder: '欢迎提出您的建议...',
      }),
    ]),
  },
  {
    id: 'tpl-course-feedback',
    title: '课程反馈表',
    author: '教育达人',
    cover: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    height: 300,
    tags: ['教育', '培训'],
    likes: 654,
    views: 2100,
    description: '培训结束后收集学员反馈的标准模板。',
    schema: schema('课程反馈表', '请对本次课程进行评价', [
      comp('c_course_rate', 'question-rate', '课程整体评分', {
        label: '课程整体评分',
        count: 5,
        allowHalf: true,
        allowClear: true,
        showValue: true,
      }),
      comp('c_course_radio', 'question-radio', '是否愿意推荐', {
        title: '是否愿意推荐给同事？',
        isVertical: false,
        options: [
          { value: 'option1', text: '非常愿意' },
          { value: 'option2', text: '可以考虑' },
          { value: 'option3', text: '不太愿意' },
        ],
      }),
      comp('c_course_textarea', 'question-textarea', '课程建议', {
        title: '您的建议',
        placeholder: '请写下您的想法...',
      }),
    ]),
  },
  {
    id: 'tpl-event-register',
    title: '活动报名表',
    author: '活动策划',
    cover: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    height: 360,
    tags: ['活动', '报名'],
    likes: 432,
    views: 1800,
    description: '线下活动、沙龙、发布会的快速报名收集。',
    schema: schema('活动报名表', '填写信息完成报名', [
      comp('c_event_name', 'question-input', '姓名', {
        title: '姓名',
        placeholder: '请输入您的姓名',
      }),
      comp('c_event_phone', 'question-phone-input', '手机号', {
        title: '手机号码',
        placeholder: '请输入手机号',
      }),
      comp('c_event_email', 'question-email-input', '邮箱', {
        title: '电子邮箱',
        placeholder: 'example@email.com',
      }),
      comp('c_event_select', 'question-select', '参与场次', {
        placeholder: '请选择场次',
        options: [
          { value: '1', label: '上午场 09:30' },
          { value: '2', label: '下午场 14:00' },
          { value: '3', label: '晚间场 19:30' },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-product-research',
    title: '产品需求调研',
    author: '产品经理',
    cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    height: 400,
    tags: ['产品', '调研'],
    likes: 756,
    views: 2900,
    description: '新产品上线前的用户需求与痛点调研。',
    schema: schema('产品需求调研', '帮助我们打造更好的产品', [
      comp('c_prod_checkbox', 'question-checkbox', '常用功能', {
        title: '您常用的功能',
        isVertical: false,
        list: [
          { value: 'option1', text: '数据分析', checked: false },
          { value: 'option2', text: '表单设计', checked: false },
          { value: 'option3', text: '协作分享', checked: false },
          { value: 'option4', text: '模板市场', checked: false },
        ],
      }),
      comp('c_prod_radio', 'question-radio', '使用频率', {
        title: '您的产品使用频率',
        isVertical: false,
        options: [
          { value: 'option1', text: '每天' },
          { value: 'option2', text: '每周' },
          { value: 'option3', text: '偶尔' },
        ],
      }),
      comp('c_prod_textarea', 'question-textarea', '功能期望', {
        title: '最希望新增的功能',
        placeholder: '描述您期待的功能...',
      }),
    ]),
  },
  {
    id: 'tpl-health-check',
    title: '健康打卡问卷',
    author: '健康社区',
    cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    height: 280,
    tags: ['健康', '打卡'],
    likes: 321,
    views: 1500,
    description: '每日健康状态记录与打卡模板。',
    schema: schema('健康打卡', '记录今日健康状态', [
      comp('c_health_radio', 'question-radio', '今日精神状态', {
        title: '今日精神状态',
        isVertical: false,
        options: [
          { value: 'option1', text: '很好' },
          { value: 'option2', text: '一般' },
          { value: 'option3', text: '疲惫' },
        ],
      }),
      comp('c_health_number', 'question-number-input', '睡眠时长', {
        title: '昨晚睡眠时长（小时）',
        placeholder: '请输入数字',
      }),
      comp('c_health_textarea', 'question-textarea', '备注', {
        title: '其他备注',
        placeholder: '如有不适请说明...',
      }),
    ]),
  },
  {
    id: 'tpl-restaurant-review',
    title: '餐厅满意度',
    author: '美食探店',
    cover: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    height: 340,
    tags: ['餐饮', '评价'],
    likes: 567,
    views: 2400,
    description: '餐厅就餐体验与菜品评价收集。',
    schema: schema('餐厅满意度', '您的评价是我们进步的动力', [
      comp('c_rest_rate', 'question-rate', '整体评分', {
        label: '整体评分',
        count: 5,
        allowHalf: true,
        allowClear: true,
        showValue: true,
      }),
      comp('c_rest_checkbox', 'question-checkbox', '满意环节', {
        title: '哪些环节让您满意？',
        isVertical: false,
        list: [
          { value: 'option1', text: '菜品口味', checked: false },
          { value: 'option2', text: '服务态度', checked: false },
          { value: 'option3', text: '就餐环境', checked: false },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-travel-plan',
    title: '旅行偏好调查',
    author: '旅行家',
    cover: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    height: 300,
    tags: ['旅行', '偏好'],
    likes: 445,
    views: 1900,
    description: '了解用户旅行偏好，定制个性化行程。',
    schema: schema('旅行偏好调查', '告诉我们您的旅行梦想', [
      comp('c_travel_checkbox', 'question-checkbox', '旅行类型', {
        title: '偏好的旅行类型',
        isVertical: false,
        list: [
          { value: 'option1', text: '自然风光', checked: false },
          { value: 'option2', text: '城市漫步', checked: false },
          { value: 'option3', text: '美食之旅', checked: false },
          { value: 'option4', text: '文化体验', checked: false },
        ],
      }),
      comp('c_travel_select', 'question-select', '预算范围', {
        placeholder: '请选择预算',
        options: [
          { value: '1', label: '3000 元以下' },
          { value: '2', label: '3000 - 8000 元' },
          { value: '3', label: '8000 元以上' },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-vote',
    title: '投票评选模板',
    author: '社区运营',
    cover: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    height: 260,
    tags: ['投票', '评选'],
    likes: 892,
    views: 4100,
    description: '社区作品投票、评选活动通用模板。',
    schema: schema('投票评选', '为您喜欢的作品投票', [
      comp('c_vote_radio', 'question-radio', '选择作品', {
        title: '选择您支持的作品',
        isVertical: true,
        options: [
          { value: 'option1', text: '作品 A · 城市光影' },
          { value: 'option2', text: '作品 B · 夏日物语' },
          { value: 'option3', text: '作品 C · 未来想象' },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-onboarding',
    title: '新人入职问卷',
    author: 'QuizzyFlow 官方',
    cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: 380,
    tags: ['HR', '入职'],
    likes: 234,
    views: 980,
    description: '新员工入职信息收集与期望调研。',
    schema: schema('新人入职问卷', '欢迎加入我们的团队', [
      comp('c_onboard_input', 'question-input', '姓名', {
        title: '姓名',
        placeholder: '请输入姓名',
      }),
      comp('c_onboard_date', 'question-date', '入职日期', {
        label: '入职日期',
        format: 'YYYY-MM-DD',
        placeholder: '请选择日期',
      }),
      comp('c_onboard_textarea', 'question-textarea', '入职期望', {
        title: '对这份工作的期待',
        placeholder: '分享您的目标与期待...',
      }),
    ]),
  },
  {
    id: 'tpl-nps',
    title: '客户 NPS 调研',
    author: '增长团队',
    cover: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    height: 290,
    tags: ['NPS', '客户'],
    likes: 612,
    views: 2750,
    description: '净推荐值调研，衡量客户忠诚度。',
    schema: schema('客户 NPS 调研', '您有多大意愿推荐我们？', [
      comp('c_nps_radio', 'question-radio', '推荐意愿', {
        title: '您向朋友推荐我们的可能性？',
        isVertical: false,
        options: [
          { value: 'option1', text: '9-10 分 · 非常愿意' },
          { value: 'option2', text: '7-8 分 · 比较愿意' },
          { value: 'option3', text: '0-6 分 · 不太愿意' },
        ],
      }),
      comp('c_nps_textarea', 'question-textarea', '推荐理由', {
        title: '请说明您的理由',
        placeholder: '您的反馈对我们很重要...',
      }),
    ]),
  },
  {
    id: 'tpl-club-recruit',
    title: '社团招新报名',
    author: '校园生活',
    cover: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    height: 310,
    tags: ['校园', '招新'],
    likes: 388,
    views: 1620,
    description: '高校社团纳新信息采集模板。',
    schema: schema('社团招新报名', '加入我们一起创造精彩', [
      comp('c_club_input', 'question-input', '姓名', {
        title: '姓名',
        placeholder: '请输入姓名',
      }),
      comp('c_club_select', 'question-select', '意向部门', {
        placeholder: '请选择意向部门',
        options: [
          { value: '1', label: '内容运营' },
          { value: '2', label: '活动策划' },
          { value: '3', label: '视觉设计' },
        ],
      }),
      comp('c_club_textarea', 'question-textarea', '自我介绍', {
        title: '简单自我介绍',
        placeholder: '说说你的特长与兴趣...',
      }),
    ]),
  },
  {
    id: 'tpl-brand-ux',
    title: '品牌体验调研',
    author: '品牌工作室',
    cover: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    height: 350,
    tags: ['品牌', '体验'],
    likes: 501,
    views: 1980,
    description: '品牌形象与触点体验用户调研。',
    schema: schema('品牌体验调研', '帮助我们优化品牌体验', [
      comp('c_brand_rate', 'question-rate', '品牌好感度', {
        label: '对品牌的整体好感度',
        count: 5,
        allowHalf: false,
        allowClear: true,
        showValue: true,
      }),
      comp('c_brand_checkbox', 'question-checkbox', '了解渠道', {
        title: '您通过哪些渠道了解我们？',
        isVertical: false,
        list: [
          { value: 'option1', text: '社交媒体', checked: false },
          { value: 'option2', text: '朋友推荐', checked: false },
          { value: 'option3', text: '搜索引擎', checked: false },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-meeting-feedback',
    title: '会议反馈表',
    author: '效率工具',
    cover: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    height: 270,
    tags: ['会议', '效率'],
    likes: 276,
    views: 1340,
    description: '会后收集议程质量与改进建议。',
    schema: schema('会议反馈表', '您的反馈将帮助我们改进会议质量', [
      comp('c_meet_rate', 'question-rate', '会议效率', {
        label: '本次会议效率评分',
        count: 5,
        allowHalf: true,
        allowClear: true,
        showValue: true,
      }),
      comp('c_meet_textarea', 'question-textarea', '改进建议', {
        title: '改进建议',
        placeholder: '哪些环节可以做得更好？',
      }),
    ]),
  },
  {
    id: 'tpl-refund-request',
    title: '退换货申请',
    author: '电商运营',
    cover: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    height: 330,
    tags: ['电商', '售后'],
    likes: 419,
    views: 2210,
    description: '电商售后退换货信息收集。',
    schema: schema('退换货申请', '请填写订单与退换原因', [
      comp('c_refund_input', 'question-input', '订单号', {
        title: '订单号',
        placeholder: '请输入订单号',
      }),
      comp('c_refund_radio', 'question-radio', '申请类型', {
        title: '申请类型',
        isVertical: false,
        options: [
          { value: 'option1', text: '退货退款' },
          { value: 'option2', text: '换货' },
          { value: 'option3', text: '仅退款' },
        ],
      }),
      comp('c_refund_textarea', 'question-textarea', '原因说明', {
        title: '退换原因',
        placeholder: '请描述具体情况...',
      }),
    ]),
  },
  {
    id: 'tpl-gym-survey',
    title: '健身房会员调查',
    author: '运动生活',
    cover: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    height: 300,
    tags: ['健身', '会员'],
    likes: 352,
    views: 1480,
    description: '健身房课程与设施满意度调查。',
    schema: schema('健身房会员调查', '帮助我们提升服务品质', [
      comp('c_gym_checkbox', 'question-checkbox', '常参加课程', {
        title: '您常参加的课程',
        isVertical: false,
        list: [
          { value: 'option1', text: '瑜伽', checked: false },
          { value: 'option2', text: '力量训练', checked: false },
          { value: 'option3', text: '有氧操', checked: false },
        ],
      }),
      comp('c_gym_rate', 'question-rate', '设施评分', {
        label: '器械与设施满意度',
        count: 5,
        allowHalf: false,
        allowClear: true,
        showValue: true,
      }),
    ]),
  },
  {
    id: 'tpl-app-feature',
    title: 'App 功能投票',
    author: '产品社区',
    cover: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    height: 280,
    tags: ['产品', '投票'],
    likes: 734,
    views: 3050,
    description: '收集用户最期待的新功能方向。',
    schema: schema('App 功能投票', '选出您最期待的功能', [
      comp('c_app_radio', 'question-radio', '功能优先级', {
        title: '最希望优先上线的功能',
        isVertical: true,
        options: [
          { value: 'option1', text: 'AI 智能分析' },
          { value: 'option2', text: '团队协作' },
          { value: 'option3', text: '移动端优化' },
          { value: 'option4', text: '第三方集成' },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-property-survey',
    title: '物业满意度',
    author: '社区服务',
    cover: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    height: 310,
    tags: ['物业', '社区'],
    likes: 298,
    views: 1260,
    description: '小区物业服务满意度调查。',
    schema: schema('物业满意度', '您的评价帮助我们改进服务', [
      comp('c_prop_rate', 'question-rate', '整体满意度', {
        label: '对物业服务的整体满意度',
        count: 5,
        allowHalf: true,
        allowClear: true,
        showValue: true,
      }),
      comp('c_prop_textarea', 'question-textarea', '意见反馈', {
        title: '其他意见',
        placeholder: '欢迎提出您的建议...',
      }),
    ]),
  },
  {
    id: 'tpl-online-course',
    title: '在线课程报名',
    author: '知识付费',
    cover: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    height: 340,
    tags: ['教育', '报名'],
    likes: 467,
    views: 1890,
    description: '在线课程意向登记与基础信息收集。',
    schema: schema('在线课程报名', '填写信息预约课程席位', [
      comp('c_oc_name', 'question-input', '姓名', {
        title: '姓名',
        placeholder: '请输入姓名',
      }),
      comp('c_oc_email', 'question-email-input', '邮箱', {
        title: '联系邮箱',
        placeholder: 'example@email.com',
      }),
      comp('c_oc_select', 'question-select', '课程方向', {
        placeholder: '请选择课程',
        options: [
          { value: '1', label: '数据分析入门' },
          { value: '2', label: '产品设计实战' },
          { value: '3', label: 'AI 应用开发' },
        ],
      }),
    ]),
  },
  {
    id: 'tpl-startup-validate',
    title: '创业想法验证',
    author: '创投社区',
    cover: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    height: 360,
    tags: ['创业', '调研'],
    likes: 523,
    views: 2140,
    description: '早期创业想法市场需求验证问卷。',
    schema: schema('创业想法验证', '帮助我们了解您的真实需求', [
      comp('c_start_radio', 'question-radio', '痛点程度', {
        title: '该问题对您的影响程度',
        isVertical: false,
        options: [
          { value: 'option1', text: '非常严重' },
          { value: 'option2', text: '有些影响' },
          { value: 'option3', text: '影响不大' },
        ],
      }),
      comp('c_start_checkbox', 'question-checkbox', '现有解决方案', {
        title: '您目前如何解决？',
        isVertical: false,
        list: [
          { value: 'option1', text: '手动处理', checked: false },
          { value: 'option2', text: '使用其他工具', checked: false },
          { value: 'option3', text: '尚未解决', checked: false },
        ],
      }),
      comp('c_start_number', 'question-number-input', '付费意愿', {
        title: '愿意支付的月费（元）',
        placeholder: '请输入数字',
      }),
    ]),
  },
]

export default communityTemplates
