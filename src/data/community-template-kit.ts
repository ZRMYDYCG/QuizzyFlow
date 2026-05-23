import type { QuestionComponentType } from '@/store/modules/question-component'
import type { CommunityTemplate } from '@/types/community-template'

export function comp(
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

export function schema(
  title: string,
  desc: string,
  components: QuestionComponentType[]
): CommunityTemplate['schema'] {
  return { title, desc, componentList: components }
}

type FieldSpec = {
  type: string
  title: string
  props: Record<string, unknown>
}

export function buildFields(prefix: string, fields: FieldSpec[]): QuestionComponentType[] {
  return fields.map((field, index) =>
    comp(`${prefix}_${index + 1}`, field.type, field.title, field.props)
  )
}

const radio = (title: string, options: string[], vertical = false) => ({
  type: 'question-radio',
  title,
  props: {
    title,
    isVertical: vertical,
    options: options.map((text, i) => ({ value: `opt_${i + 1}`, text })),
  },
})

const checkbox = (title: string, items: string[]) => ({
  type: 'question-checkbox',
  title,
  props: {
    title,
    isVertical: false,
    list: items.map((text, i) => ({ value: `opt_${i + 1}`, text, checked: false })),
  },
})

const select = (title: string, labels: string[], placeholder?: string) => ({
  type: 'question-select',
  title,
  props: {
    placeholder: placeholder || '请选择',
    options: labels.map((label, i) => ({ value: String(i + 1), label })),
  },
})

const rate = (label: string) => ({
  type: 'question-rate',
  title: label,
  props: { label, count: 5, allowHalf: true, allowClear: true, showValue: true },
})

const input = (title: string, placeholder?: string) => ({
  type: 'question-input',
  title,
  props: { title, placeholder: placeholder || `请输入${title}` },
})

const textarea = (title: string, placeholder?: string) => ({
  type: 'question-textarea',
  title,
  props: { title, placeholder: placeholder || '请输入您的回答...' },
})

const numberInput = (title: string, placeholder = '请输入数字') => ({
  type: 'question-number-input',
  title,
  props: { title, placeholder },
})

const email = (title: string) => ({
  type: 'question-email-input',
  title,
  props: { title, placeholder: 'example@email.com' },
})

const phone = (title: string) => ({
  type: 'question-phone-input',
  title,
  props: { title, placeholder: '请输入手机号' },
})

const url = (title: string) => ({
  type: 'question-url-input',
  title,
  props: { title, placeholder: 'https://', showValidation: true },
})

const date = (title: string) => ({
  type: 'question-date',
  title,
  props: { label: title, format: 'YYYY-MM-DD', placeholder: '请选择日期' },
})

const time = (title: string) => ({
  type: 'question-time-picker',
  title,
  props: { title, placeholder: '请选择时间', format: 'HH:mm' },
})

const dateRange = (title: string) => ({
  type: 'question-range-picker',
  title,
  props: {
    title,
    placeholder: ['开始日期', '结束日期'],
    format: 'YYYY-MM-DD',
    showTime: false,
  },
})

const timeRange = (title: string) => ({
  type: 'question-time-range-picker',
  title,
  props: {
    title,
    placeholder: ['开始时间', '结束时间'],
    format: 'HH:mm',
    use12Hours: false,
  },
})

const month = (title: string) => ({
  type: 'question-month-picker',
  title,
  props: { title, placeholder: '请选择月份', format: 'YYYY-MM' },
})

const week = (title: string) => ({
  type: 'question-week-picker',
  title,
  props: { title, placeholder: '请选择周', format: 'YYYY-wo' },
})

const year = (title: string) => ({
  type: 'question-year-picker',
  title,
  props: { title, placeholder: '请选择年份', format: 'YYYY' },
})

const password = (title: string) => ({
  type: 'question-password-input',
  title,
  props: { title, placeholder: '请输入密码', visibilityToggle: true },
})

const cascader = (title: string) => ({
  type: 'question-cascader',
  title,
  props: {
    placeholder: '请选择',
    options: [
      {
        value: 'east',
        label: '华东',
        children: [
          { value: 'sh', label: '上海' },
          { value: 'hz', label: '杭州' },
        ],
      },
      {
        value: 'south',
        label: '华南',
        children: [
          { value: 'gz', label: '广州' },
          { value: 'sz', label: '深圳' },
        ],
      },
    ],
  },
})

const treeSelect = (title: string) => ({
  type: 'question-tree-select',
  title,
  props: {
    title,
    placeholder: '请选择',
    showSearch: true,
    treeData: [
      {
        value: 'dept_a',
        title: '产品部',
        children: [
          { value: 'dept_a1', title: '设计组' },
          { value: 'dept_a2', title: '研发组' },
        ],
      },
      {
        value: 'dept_b',
        title: '运营部',
        children: [
          { value: 'dept_b1', title: '市场组' },
          { value: 'dept_b2', title: '客服组' },
        ],
      },
    ],
  },
})

const autocomplete = (title: string, options: string[]) => ({
  type: 'question-autocomplete',
  title,
  props: {
    placeholder: '输入或选择',
    allowClear: true,
    options: options.map((label, i) => ({ value: `ac_${i + 1}`, label })),
  },
})

const mentions = (title: string) => ({
  type: 'question-mentions',
  title,
  props: {
    title,
    placeholder: '输入 @ 提及同事',
    options: [
      { value: 'zhangsan', label: '张三' },
      { value: 'lisi', label: '李四' },
      { value: 'wangwu', label: '王五' },
    ],
  },
})

const mentionTextarea = (title: string) => ({
  type: 'question-mention-textarea',
  title,
  props: {
    title,
    placeholder: '详细说明，可 @ 相关人员',
    rows: 4,
    options: [
      { value: 'pm', label: '产品经理' },
      { value: 'dev', label: '研发负责人' },
    ],
  },
})

/** 通用 18 项物料基础包（覆盖主要输入类组件） */
export function baseMaterialKit(prefix: string, theme: 'survey' | 'register' | 'feedback') {
  const common = [
    input('姓名'),
    phone('联系电话'),
    email('电子邮箱'),
    select(
      theme === 'register' ? '参与身份' : '用户类型',
      theme === 'register'
        ? ['个人用户', '企业用户', '学生', '其他']
        : ['新用户', '老用户', 'VIP 用户', '访客']
    ),
    radio(theme === 'survey' ? '整体满意度' : '是否首次参与', [
      '非常满意 / 是',
      '比较满意 / 否',
      '一般',
      '不太满意',
    ]),
    checkbox('关注重点', ['价格', '品质', '服务', '交付速度', '售后保障']),
    rate('综合评分'),
    textarea(theme === 'feedback' ? '详细反馈' : '补充说明'),
    numberInput('期望预算（元）'),
    date('期望日期'),
    time('方便联系时段'),
    url('相关链接（选填）'),
    cascader('所在地区'),
    treeSelect('所属部门 / 团队'),
    autocomplete('行业关键词', ['互联网', '教育', '零售', '制造业', '医疗']),
    dateRange('项目周期'),
    timeRange('可沟通时间段'),
    month('计划启动月份'),
  ]

  if (theme === 'register') {
    common.splice(10, 0, password('设置访问密码（选填）'))
  }

  return buildFields(prefix, common.slice(0, 18))
}

export function springSaleKit(prefix: string) {
  return buildFields(prefix, [
    input('联系人姓名'),
    phone('手机号'),
    email('接收优惠信息的邮箱'),
    radio('您最关注的促销品类', ['服饰鞋包', '数码家电', '美妆护肤', '食品生鲜', '家居生活']),
    checkbox('感兴趣的促销形式', ['满减', '折扣', '买赠', '秒杀', '会员专享']),
    rate('对往期促销力度满意度'),
    select('月消费频次', ['每周多次', '每周 1 次', '每月 2-3 次', '偶尔购买']),
    numberInput('单次客单价（元）'),
    radio('偏好的触达渠道', ['短信', 'App 推送', '微信', '邮件']),
    autocomplete('常购品牌', ['品牌 A', '品牌 B', '品牌 C', '其他']),
    date('最近一次大促参与日期'),
    textarea('希望增加的促销玩法'),
    cascader('收货城市'),
    week('偏好购物周'),
    url('常逛的电商主页'),
    mentionTextarea('对本次活动的具体建议'),
    timeRange('方便接收回访的时间'),
    year('开始关注本品牌年份'),
  ])
}

export function employeeSurveyKit(prefix: string) {
  return buildFields(prefix, [
    input('员工姓名'),
    select('所在部门', ['研发', '产品', '设计', '市场', '人力', '财务']),
    treeSelect('所属团队'),
    rate('整体工作满意度'),
    rate('直属上级管理满意度'),
    radio('工作压力感受', ['适中', '偏大', '偏大且可持续', '难以承受']),
    checkbox('您最看重的工作因素', ['薪酬福利', '成长空间', '团队氛围', '工作弹性', '办公环境']),
    radio('是否愿意长期留任', ['非常愿意', '可以考虑', '观望中', '已有离职打算']),
    select('办公形式偏好', ['全勤到岗', '混合办公', '远程为主']),
    numberInput('日均加班时长（小时）'),
    date('入职日期'),
    month('最近一次调薪月份'),
    textarea('对公司文化的感受'),
    mentions('希望表扬的同事'),
    autocomplete('最常用协作工具', ['飞书', '钉钉', '企业微信', 'Slack']),
    cascader('办公地点'),
    time('最高效的工作时段'),
    mentionTextarea('改进建议与诉求'),
  ])
}

export function eventRegistrationKit(prefix: string) {
  return buildFields(prefix, [
    input('姓名'),
    phone('手机号'),
    email('电子邮箱'),
    select('参与场次', ['上午场 09:30', '下午场 14:00', '晚间场 19:30']),
    radio('参与身份', ['观众', '嘉宾', '媒体', '合作伙伴']),
    checkbox('感兴趣议题', ['主题演讲', '圆桌论坛', '产品体验', '社交环节']),
    numberInput('同行人数'),
    date('到达日期'),
    time('预计到达时间'),
    cascader('出发城市'),
    url('公司官网（选填）'),
    textarea('饮食 / 特殊需求'),
    autocomplete('如何得知本次活动', ['朋友推荐', '公众号', '官网', '社群']),
    week('可参与的备选周'),
    password('签到验证码（现场发放）'),
    dateRange('可参与日期范围'),
    mentionTextarea('想交流的话题'),
  ])
}

export function productResearchKit(prefix: string) {
  return buildFields(prefix, [
    input('产品昵称 / 代号'),
    select('使用角色', ['管理员', '编辑者', '查看者', '未使用']),
    checkbox('常用功能模块', ['问卷编辑', '数据统计', '模板市场', '协作分享', 'AI 助手']),
    radio('使用频率', ['每天', '每周', '每月', '偶尔']),
    rate('整体易用性'),
    rate('性能与稳定性'),
    numberInput('团队规模（人）'),
    autocomplete('替代工具', ['问卷星', '金数据', 'Google Forms', 'Typeform']),
    radio('付费意愿', ['愿意付费', '看功能决定', '仅使用免费版']),
    cascader('所在行业'),
    treeSelect('主要使用场景'),
    url('产品访问地址'),
    date('首次使用时间'),
    textarea('最希望新增的功能'),
    mentionTextarea('当前最大痛点'),
    timeRange('方便用户访谈时间'),
    month('预计采购月份'),
  ])
}

export function customerNpsKit(prefix: string) {
  return buildFields(prefix, [
    input('客户名称 / 编号'),
    email('联系邮箱'),
    phone('联系电话（选填）'),
    radio('推荐意愿（NPS）', ['9-10 分 · 非常愿意', '7-8 分 · 比较愿意', '0-6 分 · 不太愿意']),
    rate('产品满意度'),
    rate('服务响应满意度'),
    checkbox('您认可的优势', ['功能完整', '稳定可靠', '性价比高', '响应及时', '文档清晰']),
    radio('与竞品相比', ['明显更好', '略好', '差不多', '略差']),
    select('使用时长', ['小于 3 个月', '3-12 个月', '1-3 年', '3 年以上']),
    numberInput('团队使用人数'),
    autocomplete('主要使用模块', ['编辑器', '统计', '模板', '权限管理']),
    textarea('推荐理由或不推荐原因'),
    url('案例 / 主页链接'),
    date('最近一次联系支持日期'),
    mentions('希望感谢的支持同学'),
    cascader('客户所在区域'),
    time('方便回访时段'),
    mentionTextarea('还希望我们改进什么'),
  ])
}

export function itAssetKit(prefix: string) {
  return buildFields(prefix, [
    input('申请人姓名'),
    select('所属部门', ['研发', '产品', '设计', '市场', '行政']),
    treeSelect('成本中心'),
    checkbox('申领设备类型', ['笔记本电脑', '显示器', '键盘鼠标', '耳机', '移动硬盘']),
    radio('设备用途', ['日常办公', '开发测试', '设计渲染', '外勤出差']),
    select('操作系统偏好', ['Windows', 'macOS', 'Linux', '无要求']),
    numberInput('申领数量'),
    date('期望到货日期'),
    textarea('配置要求说明'),
    url('参考配置链接'),
    autocomplete('常用软件', ['Office', 'Adobe', 'IDE', 'Figma']),
    radio('是否需要管理员权限', ['需要', '不需要', '待评估']),
    phone('紧急联系电话'),
    email('公司邮箱'),
    cascader('办公地点'),
    timeRange('可签收时间段'),
    mentionTextarea('补充说明（可 @ IT 值班）'),
  ])
}

export function medicalAppointmentKit(prefix: string) {
  return buildFields(prefix, [
    input('患者姓名'),
    phone('手机号'),
    email('报告接收邮箱'),
    select('就诊科室', ['内科', '外科', '儿科', '口腔', '体检中心']),
    radio('初诊 / 复诊', ['初诊', '复诊']),
    date('期望就诊日期'),
    time('期望时段'),
    checkbox('症状描述（可多选）', ['发热', '咳嗽', '头痛', '肠胃不适', '其他']),
    numberInput('年龄'),
    textarea('过敏史 / 既往病史'),
    autocomplete('医保类型', ['城镇职工', '城乡居民', '自费', '商业保险']),
    cascader('居住区域'),
    url('既往检查报告链接（选填）'),
    week('可候补周次'),
    month('长期随访月份'),
    mentionTextarea('其他需要告知医生的信息'),
    password('就诊卡查询密码（选填）'),
  ])
}

export function performanceReviewKit(prefix: string) {
  return buildFields(prefix, [
    input('员工姓名'),
    select('职级', ['初级', '中级', '高级', '专家']),
    treeSelect('汇报团队'),
    rate('目标完成度自评'),
    rate('协作贡献自评'),
    checkbox('本周期主要成果', ['关键项目交付', '流程优化', '人才培养', '创新探索']),
    radio('下一周期发展意愿', ['深耕专业', '带团队', '跨部门轮岗', '保持现状']),
    numberInput('参与项目数量'),
    textarea('代表性项目与贡献'),
    autocomplete('掌握的新技能', ['项目管理', '数据分析', '公开演讲', '跨团队协作']),
    url('成果文档链接'),
    date('入职日期'),
    month('评估周期'),
    mentions('希望感谢的协作者'),
    cascader('工作 Base 地'),
    timeRange('方便 1:1 沟通时间'),
    mentionTextarea('需要的支持与资源'),
  ])
}

export function saasTrialKit(prefix: string) {
  return buildFields(prefix, [
    input('公司名称'),
    email('工作邮箱'),
    phone('联系电话'),
    select('公司规模', ['1-20 人', '21-100 人', '101-500 人', '500 人以上']),
    checkbox('试用功能', ['问卷编辑', '逻辑跳转', '数据统计', 'API 集成', 'SSO 登录']),
    rate('上手难度评分'),
    rate('界面美观度'),
    radio('是否会采购', ['会', '可能', '暂不需要']),
    numberInput('预计问卷数量 / 月'),
    autocomplete('当前使用工具', ['Excel', '其他 SaaS', '自研系统', '暂无']),
    url('公司官网'),
    textarea('试用过程中的问题'),
    cascader('总部所在地区'),
    date('试用开始日期'),
    week('计划决策周'),
    mentionTextarea('希望销售跟进的内容'),
    time('方便演示时段'),
  ])
}

export function weddingRsvpKit(prefix: string) {
  return buildFields(prefix, [
    input('来宾姓名'),
    phone('手机号'),
    email('邮箱（接收电子请柬）'),
    radio('是否出席', ['准时出席', '尽量出席', '遗憾无法到场']),
    numberInput('出席人数（含本人）'),
    checkbox('饮食偏好', ['无特殊要求', '素食', '清真', '过敏需说明']),
    select('与新人关系', ['亲戚', '同学', '同事', '朋友']),
    textarea('祝福语'),
    date('到达日期（外地宾客）'),
    time('预计到达时间'),
    autocomplete('交通方式', ['自驾', '高铁', '飞机', '本地']),
    cascader('出发城市'),
    url('社交主页（选填）'),
    week('可参与婚前活动周'),
    mentionTextarea('特殊需求说明'),
    month('纪念日月份（选填）'),
  ])
}

export function realEstateViewingKit(prefix: string) {
  return buildFields(prefix, [
    input('客户姓名'),
    phone('手机号'),
    email('邮箱'),
    select('意向户型', ['一居', '两居', '三居', '四居及以上']),
    radio('购房目的', ['自住', '投资', '学区', '改善']),
    checkbox('关注因素', ['地铁', '学区', '商圈', '物业', '得房率']),
    numberInput('预算上限（万元）'),
    cascader('意向区域'),
    autocomplete('意向楼盘', ['楼盘 A', '楼盘 B', '楼盘 C', '待推荐']),
    date('方便看房日期'),
    timeRange('可看房时间段'),
    textarea('其他需求'),
    url('参考链接'),
    week('备选看房周'),
    month('计划下定月份'),
    year('预计入住年份'),
    mentionTextarea('备注（可 @ 置业顾问）'),
  ])
}

export function customerTicketKit(prefix: string) {
  return buildFields(prefix, [
    input('联系人'),
    email('联系邮箱'),
    phone('手机号'),
    select('问题类型', ['功能咨询', 'Bug 反馈', '账单问题', '账号问题', '其他']),
    radio('紧急程度', ['紧急', '高', '中', '低']),
    checkbox('影响范围', ['仅本人', '团队', '全公司', '外部用户']),
    url('问题页面链接'),
    textarea('问题描述'),
    autocomplete('出现频率', ['必现', '高频', '偶发', '仅一次']),
    date('首次出现日期'),
    time('最近出现时间'),
    numberInput('受影响账号数'),
    mentions('相关同事'),
    cascader('所在地区'),
    password('临时授权码（选填）'),
    mentionTextarea('已尝试的解决方案'),
    week('方便远程协助周'),
  ])
}

export function courseFeedbackKit(prefix: string) {
  return buildFields(prefix, [
    input('学员姓名'),
    email('邮箱'),
    select('课程名称', ['数据分析入门', '产品设计实战', 'AI 应用开发', '其他']),
    rate('课程整体评分'),
    rate('讲师表达评分'),
    radio('是否愿意推荐', ['非常愿意', '可以考虑', '不太愿意']),
    checkbox('收获最大的环节', ['理论讲解', '案例演示', '实操练习', '答疑互动']),
    radio('难度感受', ['偏易', '适中', '偏难']),
    numberInput('课程时长是否合适（1-5 分自评）'),
    textarea('课程改进建议'),
    autocomplete('后续想学的方向', ['进阶课', '专项工作坊', '认证考试', '暂无']),
    date('上课日期'),
    time('最佳听课时段偏好'),
    url('课程资料链接'),
    mentions('想感谢的讲师 / 助教'),
    cascader('所在城市'),
    week('可参与回访周'),
    mentionTextarea('其他意见'),
  ])
}

export function healthCheckinKit(prefix: string) {
  return buildFields(prefix, [
    input('姓名'),
    radio('今日精神状态', ['很好', '一般', '疲惫', '焦虑']),
    radio('今日运动情况', ['30 分钟以上', '15-30 分钟', '几乎没动']),
    checkbox('今日症状（如有）', ['无', '头痛', '咳嗽', '肌肉酸痛', '失眠']),
    numberInput('睡眠时长（小时）'),
    numberInput('今日步数'),
    rate('今日情绪自评'),
    select('饮水量', ['充足', '一般', '偏少']),
    textarea('饮食 / 备注'),
    date('记录日期'),
    time('起床时间'),
    autocomplete('今日运动类型', ['跑步', '力量', '瑜伽', '游泳', '其他']),
    week('本周目标完成周'),
    month('坚持打卡月份'),
    url('运动记录链接（选填）'),
    mentionTextarea('需要关注的健康问题'),
  ])
}

export function restaurantReviewKit(prefix: string) {
  return buildFields(prefix, [
    input('就餐人数'),
    select('就餐时段', ['午餐', '下午茶', '晚餐', '夜宵']),
    rate('整体评分'),
    rate('菜品口味'),
    rate('服务态度'),
    checkbox('满意环节', ['菜品口味', '服务态度', '就餐环境', '上菜速度', '性价比']),
    radio('是否会再次光顾', ['一定再来', '可能会', '不太会']),
    numberInput('人均消费（元）'),
    autocomplete('推荐菜品', ['招牌菜 A', '招牌菜 B', '季节限定', '甜品']),
    textarea('具体评价'),
    url('晒单链接（选填）'),
    date('就餐日期'),
    time('到店时间'),
    cascader('餐厅所在商圈'),
    mentions('想表扬的服务员'),
    week('常来星期'),
    mentionTextarea('改进建议'),
  ])
}

export function travelPreferenceKit(prefix: string) {
  return buildFields(prefix, [
    input('称呼'),
    email('邮箱'),
    checkbox('偏好旅行类型', ['自然风光', '城市漫步', '美食之旅', '文化体验', '海岛度假']),
    select('预算范围', ['3000 以下', '3000-8000', '8000-15000', '15000 以上']),
    radio('出行方式', ['自由行', '跟团', '半自助']),
    numberInput('同行人数'),
    rate('对上次行程满意度'),
    autocomplete('想去的目的地', ['日本', '东南亚', '欧洲', '国内小众', '待推荐']),
    cascader('出发城市'),
    dateRange('计划出行日期'),
    textarea('特殊需求（亲子 / 老人等）'),
    url('参考攻略链接'),
    week('可出行周次'),
    month('意向出发月份'),
    timeRange('方便电话沟通时间'),
    mentionTextarea('行程定制诉求'),
  ])
}

export function voteKit(prefix: string) {
  return buildFields(prefix, [
    input('投票人昵称'),
    email('邮箱（用于防刷）'),
    radio('最佳创意奖', ['作品 A · 城市光影', '作品 B · 夏日物语', '作品 C · 未来想象']),
    radio('最佳人气奖', ['作品 A', '作品 B', '作品 C']),
    radio('最佳技术奖', ['作品 A', '作品 B', '作品 C']),
    checkbox('您看重的评选维度', ['创意', '完成度', '实用性', '美观', '表达']),
    rate('对本次赛事组织满意度'),
    textarea('投票理由（选填）'),
    select('您与参赛者的关系', ['观众', '参赛者亲友', '同事', '其他']),
    autocomplete('从何得知本次投票', ['官网', '社群', '朋友', '线下活动']),
    url('作品详情页'),
    date('观展 / 体验日期'),
    phone('手机号（选填）'),
    cascader('所在城市'),
    mentions('支持的创作者'),
    week('参与活动时间'),
    mentionTextarea('对下一届赛事建议'),
  ])
}

export function onboardingKit(prefix: string) {
  return buildFields(prefix, [
    input('姓名'),
    email('公司邮箱'),
    phone('手机号'),
    date('入职日期'),
    select('入职岗位', ['研发', '产品', '设计', '运营', '销售', '其他']),
    treeSelect('汇报团队'),
    radio('办公设备是否就绪', ['已领取', '待领取', '自备']),
    checkbox('已完成入职事项', ['签署合同', '账号开通', '安全培训', '部门介绍']),
    textarea('对这份工作的期待'),
    autocomplete('过往熟悉工具', ['Jira', 'Notion', 'Figma', 'GitLab']),
    url('个人作品集（选填）'),
    cascader('办公地点'),
    password('临时系统密码（HR 发放）'),
    week('第一周可全职到岗周'),
    month('试用期目标月份'),
    timeRange('方便导师沟通时间'),
    mentionTextarea('需要 HR 协助的事项'),
  ])
}

export function clubRecruitKit(prefix: string) {
  return buildFields(prefix, [
    input('姓名'),
    phone('手机号'),
    email('邮箱'),
    select('意向部门', ['内容运营', '活动策划', '视觉设计', '外联公关']),
    radio('年级 / 身份', ['大一', '大二', '大三', '大四', '研究生']),
    checkbox('可投入时间', ['工作日晚上', '周末', '寒暑假', '均可']),
    textarea('自我介绍'),
    url('作品集 / 社媒链接'),
    autocomplete('特长标签', ['摄影', '写作', '视频剪辑', '主持', '设计']),
    rate('对社团了解程度'),
    date('可参加面试日期'),
    time('面试时间偏好'),
    cascader('校区 / 学院'),
    mentions('认识的社团成员'),
    week('可参与招新周'),
    mentionTextarea('想参与的项目想法'),
  ])
}

export function brandUxKit(prefix: string) {
  return buildFields(prefix, [
    input('用户昵称'),
    email('邮箱'),
    rate('品牌好感度'),
    rate('视觉识别满意度'),
    checkbox('了解渠道', ['社交媒体', '朋友推荐', '搜索引擎', '线下活动', '广告']),
    radio('购买 / 使用频率', ['每周', '每月', '偶尔', '首次了解']),
    select('主要接触触点', ['官网', 'App', '门店', '客服', '社群']),
    autocomplete('联想到的关键词', ['专业', '年轻', '可靠', '创新', '高端']),
    textarea('品牌印象描述'),
    url('相关体验链接'),
    numberInput('NPS 打分（0-10）'),
    cascader('所在地区'),
    date('最近一次体验日期'),
    mentions('印象深刻的互动'),
    week('参与调研周'),
    mentionTextarea('品牌体验改进建议'),
  ])
}

export function meetingFeedbackKit(prefix: string) {
  return buildFields(prefix, [
    input('会议主题'),
    select('会议类型', ['周会', '评审', '培训', '头脑风暴', '其他']),
    rate('会议效率评分'),
    rate('议程清晰度'),
    checkbox('会议问题（可多选）', ['偏题', '超时', '准备不足', '结论不明', '无问题']),
    radio('会议时长是否合适', ['太短', '合适', '偏长']),
    numberInput('实际参会人数'),
    textarea('改进建议'),
    autocomplete('最佳会议形式', ['线下', '线上', '混合', '异步文档']),
    date('会议日期'),
    timeRange('会议时间段'),
    url('会议纪要链接'),
    mentions('表现突出的同事'),
    week('下一期可调整周'),
    month('复盘月份'),
    mentionTextarea('下次会议期望'),
  ])
}

export function refundRequestKit(prefix: string) {
  return buildFields(prefix, [
    input('订单号'),
    phone('联系电话'),
    email('联系邮箱'),
    radio('申请类型', ['退货退款', '换货', '仅退款']),
    select('商品类别', ['服饰', '数码', '美妆', '食品', '其他']),
    checkbox('退换原因', ['尺码不合', '质量问题', '描述不符', '不喜欢', '其他']),
    numberInput('退款金额（元）'),
    textarea('原因说明'),
    url('商品链接'),
    date('下单日期'),
    date('收货日期'),
    autocomplete('物流公司', ['顺丰', '京东', '中通', '圆通', '其他']),
    cascader('收货地址城市'),
    password('订单查询密码（选填）'),
    week('方便上门取件周'),
    mentionTextarea('补充凭证说明'),
  ])
}

export function gymSurveyKit(prefix: string) {
  return buildFields(prefix, [
    input('会员编号 / 姓名'),
    phone('手机号'),
    checkbox('常参加课程', ['瑜伽', '力量训练', '有氧操', '普拉提', '游泳']),
    rate('器械与设施满意度'),
    rate('教练专业度'),
    radio('续卡意愿', ['一定续费', '考虑中', '不续费']),
    select('常去时段', ['清晨', '中午', '傍晚', '夜间']),
    numberInput('每周到店次数'),
    textarea('希望新增的课程'),
    autocomplete('健身目标', ['减脂', '增肌', '体态', '康复', '社交']),
    date('最近到店日期'),
    url('体测报告链接（选填）'),
    cascader('常去门店'),
    week('方便调研周'),
    month('会员到期月份'),
    mentionTextarea('其他建议'),
  ])
}

export function appFeatureVoteKit(prefix: string) {
  return buildFields(prefix, [
    input('用户 ID / 昵称'),
    email('邮箱'),
    radio('最希望优先上线', ['AI 智能分析', '团队协作', '移动端优化', '第三方集成']),
    checkbox('次要需求（可多选）', ['深色模式', '批量导出', 'Webhook', '多语言', '离线编辑']),
    rate('当前版本满意度'),
    select('使用平台', ['Web', 'iOS', 'Android', '多端']),
    numberInput('每周使用天数'),
    textarea('功能场景描述'),
    autocomplete('竞品功能参考', ['Notion', 'Airtable', '飞书', '其他']),
    url('相关讨论帖链接'),
    date('开始使用时间'),
    cascader('所在地区'),
    mentions('希望一起内测的同事'),
    week('可参与内测周'),
    mentionTextarea('对路线图建议'),
  ])
}

export function propertySurveyKit(prefix: string) {
  return buildFields(prefix, [
    input('楼栋 / 房号'),
    phone('联系电话'),
    rate('整体满意度'),
    rate('保洁服务'),
    rate('安保响应'),
    checkbox('需改进服务', ['保洁', '绿化', '维修响应', '停车管理', '噪音管理']),
    radio('是否愿意推荐本小区', ['愿意', '一般', '不愿意']),
    textarea('具体意见'),
    select('居住时长', ['1 年以内', '1-3 年', '3 年以上']),
    autocomplete('最常使用的设施', ['健身房', '会所', '快递柜', '儿童区']),
    date('最近一次报修日期'),
    url('报修单链接（选填）'),
    cascader('所在城市'),
    week('方便回访周'),
    month('入住月份'),
    mentionTextarea('物业沟通记录补充'),
  ])
}

export function onlineCourseKit(prefix: string) {
  return buildFields(prefix, [
    input('姓名'),
    email('联系邮箱'),
    phone('手机号'),
    select('课程方向', ['数据分析入门', '产品设计实战', 'AI 应用开发']),
    radio('学习目的', ['职业转型', '技能提升', '兴趣爱好', '公司指派']),
    checkbox('可上课时间', ['工作日晚间', '周末', '线上随时', '线下集训']),
    numberInput('可投入每周小时数'),
    textarea('学习背景与目标'),
    autocomplete('编程 / 工具基础', ['无基础', 'Excel', 'Python', 'SQL', 'Figma']),
    url('个人简历链接（选填）'),
    cascader('所在城市'),
    date('希望开课日期'),
    week('可入学周'),
    month('计划完成月份'),
    password('优惠码（选填）'),
    mentionTextarea('对课程内容的期望'),
  ])
}

export function startupValidateKit(prefix: string) {
  return buildFields(prefix, [
    input('称呼'),
    email('邮箱'),
    radio('痛点程度', ['非常严重', '有些影响', '影响不大', '没有此问题']),
    checkbox('现有解决方案', ['手动处理', '使用其他工具', '外包', '尚未解决']),
    numberInput('愿意支付的月费（元）'),
    rate('对概念兴趣度'),
    select('您的角色', ['决策者', '使用者', '两者皆是', '仅了解']),
    autocomplete('所在行业', ['SaaS', '电商', '教育', '医疗', '其他']),
    textarea('目前如何解决这个问题'),
    url('竞品链接'),
    cascader('所在地区'),
    date('最近一次遇到该问题的日期'),
    phone('愿意深度访谈请留电话'),
    week('可访谈周'),
    month('预计采购月份'),
    mentionTextarea('还希望产品具备什么能力'),
  ])
}
