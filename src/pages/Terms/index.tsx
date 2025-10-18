import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Anchor } from 'antd'

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftOutlined />
                <span>返回</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">QuizzyFlow</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              最后更新：2024年1月1日
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* 左侧目录 */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">目录</h3>
              <Anchor
                affix={false}
                items={[
                  { key: 'acceptance', href: '#acceptance', title: '1. 服务条款的接受' },
                  { key: 'services', href: '#services', title: '2. 服务说明' },
                  { key: 'account', href: '#account', title: '3. 账户注册与使用' },
                  { key: 'content', href: '#content', title: '4. 用户内容' },
                  { key: 'prohibited', href: '#prohibited', title: '5. 禁止行为' },
                  { key: 'intellectual', href: '#intellectual', title: '6. 知识产权' },
                  { key: 'fees', href: '#fees', title: '7. 费用与支付' },
                  { key: 'termination', href: '#termination', title: '8. 服务终止' },
                  { key: 'liability', href: '#liability', title: '9. 免责声明' },
                  { key: 'changes', href: '#changes', title: '10. 条款变更' },
                  { key: 'contact', href: '#contact', title: '11. 联系我们' },
                ]}
              />
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">服务条款</h1>
            <p className="text-lg text-gray-600 mb-8">
              欢迎使用 QuizzyFlow！请仔细阅读以下服务条款。
            </p>

            <div className="prose prose-blue max-w-none">
              {/* 1. 服务条款的接受 */}
              <section id="acceptance" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 服务条款的接受</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  感谢您选择 QuizzyFlow（以下简称"我们"或"本平台"）。通过访问或使用我们的服务，您同意受本服务条款的约束。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  如果您不同意本条款的任何部分，请不要使用我们的服务。我们保留随时修改这些条款的权利，修改后的条款将在发布后立即生效。
                </p>
              </section>

              {/* 2. 服务说明 */}
              <section id="services" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 服务说明</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  QuizzyFlow 是一个在线问卷调查平台，提供以下服务：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>问卷设计与创建工具</li>
                  <li>问卷分发与数据收集</li>
                  <li>数据分析与报告生成</li>
                  <li>团队协作功能</li>
                  <li>其他相关增值服务</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  我们致力于提供稳定可靠的服务，但不保证服务不会中断或完全无错误。
                </p>
              </section>

              {/* 3. 账户注册与使用 */}
              <section id="account" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 账户注册与使用</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>3.1 注册要求</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>您必须年满18周岁或在监护人同意下使用本服务</li>
                  <li>提供真实、准确、完整的注册信息</li>
                  <li>及时更新您的账户信息以保持准确性</li>
                  <li>一个邮箱地址只能注册一个账户</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>3.2 账户安全</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>您对账户的所有活动负责</li>
                  <li>不得与他人共享账户密码</li>
                  <li>如发现账户被盗用，应立即通知我们</li>
                  <li>我们不对因账户信息泄露导致的损失负责</li>
                </ul>
              </section>

              {/* 4. 用户内容 */}
              <section id="content" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 用户内容</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  您在平台上创建、发布或分享的所有内容（包括但不限于问卷、问题、答案等）均为"用户内容"。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>4.1 内容所有权</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  您保留对用户内容的所有权。通过使用本服务，您授予我们在提供服务所需范围内使用、存储、展示、传输您的内容的权利。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>4.2 内容责任</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>您对用户内容的合法性、真实性负责</li>
                  <li>不得发布违法、侵权、有害的内容</li>
                  <li>我们有权删除违规内容而无需事先通知</li>
                </ul>
              </section>

              {/* 5. 禁止行为 */}
              <section id="prohibited" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 禁止行为</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  使用本服务时，您不得：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>违反任何适用的法律法规</li>
                  <li>侵犯他人的知识产权或其他权利</li>
                  <li>发布虚假、误导性或欺诈性信息</li>
                  <li>上传病毒、恶意软件或有害代码</li>
                  <li>干扰或破坏服务的正常运行</li>
                  <li>未经授权访问他人账户或数据</li>
                  <li>使用自动化工具大量抓取数据</li>
                  <li>从事任何商业间谍或不正当竞争行为</li>
                </ul>
              </section>

              {/* 6. 知识产权 */}
              <section id="intellectual" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 知识产权</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本平台及其所有内容（包括但不限于软件、设计、文本、图形、Logo、界面等）均受知识产权法保护，归我们或相关权利人所有。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  未经明确授权，您不得复制、修改、分发、出售或以其他方式使用本平台的任何内容。
                </p>
              </section>

              {/* 7. 费用与支付 */}
              <section id="fees" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 费用与支付</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们提供免费和付费服务计划。具体费用和付款条款请参考我们的定价页面。
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>付费服务按月或按年计费</li>
                  <li>除非另有说明，所有费用不可退还</li>
                  <li>我们有权随时调整价格，但会提前通知现有用户</li>
                  <li>未及时付款可能导致服务暂停或终止</li>
                </ul>
              </section>

              {/* 8. 服务终止 */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 服务终止</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>8.1 您可以随时终止使用</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  您可以随时停止使用我们的服务并删除您的账户。账户删除后，您的用户内容可能会被永久删除。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>8.2 我们可以终止或暂停服务</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  如果您违反本条款，我们有权立即暂停或终止您的账户，无需事先通知。
                </p>
              </section>

              {/* 9. 免责声明 */}
              <section id="liability" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 免责声明</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>服务按"现状"提供</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们尽力提供优质服务，但不保证服务：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>始终可用、及时、安全或无错误</li>
                  <li>满足您的所有需求和期望</li>
                  <li>与其他软件或硬件兼容</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  在法律允许的最大范围内，我们不对使用服务产生的任何直接、间接、偶然、特殊或后果性损害负责。
                </p>
              </section>

              {/* 10. 条款变更 */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 条款变更</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们保留随时修改本服务条款的权利。重大变更将通过邮件或平台通知的方式告知您。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  修改后继续使用服务即表示您接受新的条款。如不同意修改，请停止使用服务。
                </p>
              </section>

              {/* 11. 联系我们 */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. 联系我们</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  如对本服务条款有任何疑问或意见，请通过以下方式联系我们：
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p className="text-gray-700">
                    <strong>邮箱：</strong> support@quizzyflow.com
                  </p>
                  <p className="text-gray-700">
                    <strong>地址：</strong> 中国上海市浦东新区张江高科技园区
                  </p>
                  <p className="text-gray-700">
                    <strong>客服时间：</strong> 工作日 9:00-18:00
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2024 QuizzyFlow. 保留所有权利。</p>
        </div>
      </div>
    </div>
  )
}

export default Terms

