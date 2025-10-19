import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Anchor } from 'antd'

const Privacy: React.FC = () => {
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
                  { key: 'intro', href: '#intro', title: '1. 引言' },
                  { key: 'collect', href: '#collect', title: '2. 我们收集的信息' },
                  { key: 'use', href: '#use', title: '3. 信息使用方式' },
                  { key: 'share', href: '#share', title: '4. 信息共享与披露' },
                  { key: 'storage', href: '#storage', title: '5. 数据存储与安全' },
                  { key: 'cookies', href: '#cookies', title: '6. Cookie和追踪技术' },
                  { key: 'rights', href: '#rights', title: '7. 您的权利' },
                  { key: 'children', href: '#children', title: '8. 儿童隐私' },
                  { key: 'international', href: '#international', title: '9. 国际数据传输' },
                  { key: 'updates', href: '#updates', title: '10. 政策更新' },
                  { key: 'contact', href: '#contact', title: '11. 联系我们' },
                ]}
              />
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">隐私政策</h1>
            <p className="text-lg text-gray-600 mb-8">
              我们重视您的隐私，本政策说明我们如何收集、使用和保护您的个人信息。
            </p>

            <div className="prose prose-blue max-w-none">
              {/* 1. 引言 */}
              <section id="intro" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 引言</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  欢迎使用 QuizzyFlow！我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本隐私政策适用于您通过 QuizzyFlow 平台（包括网站、移动应用及相关服务）提供的所有个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  使用我们的服务即表示您同意本隐私政策。如不同意，请不要使用我们的服务或提供个人信息。
                </p>
              </section>

              {/* 2. 我们收集的信息 */}
              <section id="collect" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 我们收集的信息</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>2.1 您主动提供的信息</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>账户信息：</strong>邮箱地址、昵称、密码（加密存储）</li>
                  <li><strong>个人资料：</strong>头像、个人简介、联系方式（可选）</li>
                  <li><strong>问卷内容：</strong>您创建的问卷、问题、答案等</li>
                  <li><strong>支付信息：</strong>订单记录、支付方式（支付信息由第三方支付平台处理）</li>
                  <li><strong>客服沟通：</strong>与我们联系时提供的信息</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>2.2 自动收集的信息</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>设备信息：</strong>设备型号、操作系统、浏览器类型</li>
                  <li><strong>日志信息：</strong>IP地址、访问时间、页面浏览记录</li>
                  <li><strong>使用数据：</strong>功能使用情况、点击行为、停留时长</li>
                  <li><strong>Cookie数据：</strong>用于识别用户和记录偏好设置</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>2.3 第三方来源信息</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  如您选择通过第三方账号（如Google）登录，我们会从该平台获取您授权的基本信息。
                </p>
              </section>

              {/* 3. 信息使用方式 */}
              <section id="use" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 信息使用方式</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们使用收集的信息用于：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>提供服务：</strong>创建和管理您的账户，提供问卷设计、分发、数据分析等功能</li>
                  <li><strong>改进服务：</strong>分析使用情况，优化产品功能和用户体验</li>
                  <li><strong>安全保护：</strong>检测和防范欺诈、滥用等安全威胁</li>
                  <li><strong>客户支持：</strong>回应您的咨询和问题</li>
                  <li><strong>营销推广：</strong>发送产品更新、功能介绍（您可以随时取消订阅）</li>
                  <li><strong>法律义务：</strong>遵守适用法律法规的要求</li>
                  <li><strong>统计分析：</strong>生成匿名化的使用统计和行业报告</li>
                </ul>
              </section>

              {/* 4. 信息共享与披露 */}
              <section id="share" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 信息共享与披露</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们承诺不会出售您的个人信息。仅在以下情况下共享您的信息：
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>4.1 经您同意的共享</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  在获得您明确同意的情况下，我们会与第三方共享您的信息。
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>4.2 服务提供商</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们可能与以下类型的服务提供商共享信息：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>云存储服务商</li>
                  <li>数据分析工具</li>
                  <li>支付处理平台</li>
                  <li>客户服务系统</li>
                  <li>邮件发送服务</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>4.3 法律要求</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  在以下情况下，我们可能需要披露您的信息：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>遵守法律法规、法院命令或政府要求</li>
                  <li>保护我们的权利、财产或安全</li>
                  <li>防止欺诈或安全威胁</li>
                  <li>履行法律义务</li>
                </ul>
              </section>

              {/* 5. 数据存储与安全 */}
              <section id="storage" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 数据存储与安全</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>5.1 数据存储</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>您的数据存储在安全的云服务器上</li>
                  <li>我们会在提供服务所需的期限内保留您的数据</li>
                  <li>账户删除后，您的个人信息将在30天内被删除（法律要求保留的除外）</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>5.2 安全措施</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们采取以下安全措施保护您的信息：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>传输层安全协议（TLS/SSL）加密数据传输</li>
                  <li>密码采用单向加密存储</li>
                  <li>定期安全审计和漏洞扫描</li>
                  <li>严格的访问控制和权限管理</li>
                  <li>员工安全培训和保密协议</li>
                  <li>数据备份和灾难恢复计划</li>
                </ul>
              </section>

              {/* 6. Cookie和追踪技术 */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookie和追踪技术</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们使用Cookie和类似技术来改善用户体验：
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Cookie类型：</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>必要Cookie：</strong>维持账户登录状态，确保网站正常运行</li>
                  <li><strong>功能Cookie：</strong>记住您的偏好设置</li>
                  <li><strong>分析Cookie：</strong>了解网站使用情况，改进服务</li>
                  <li><strong>广告Cookie：</strong>提供相关的广告内容</li>
                </ul>

                <p className="text-gray-700 leading-relaxed">
                  您可以通过浏览器设置管理Cookie，但禁用某些Cookie可能影响功能使用。
                </p>
              </section>

              {/* 7. 您的权利 */}
              <section id="rights" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 您的权利</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  根据适用法律，您对个人信息享有以下权利：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>访问权：</strong>查看我们持有的您的个人信息</li>
                  <li><strong>更正权：</strong>更新或修正不准确的信息</li>
                  <li><strong>删除权：</strong>要求删除您的个人信息</li>
                  <li><strong>限制处理权：</strong>在特定情况下限制我们处理您的信息</li>
                  <li><strong>数据可携权：</strong>以结构化格式获取您的数据</li>
                  <li><strong>反对权：</strong>反对我们处理您的个人信息</li>
                  <li><strong>撤回同意：</strong>随时撤回您给予的同意</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  如需行使这些权利，请通过本政策末尾的联系方式与我们联系。
                </p>
              </section>

              {/* 8. 儿童隐私 */}
              <section id="children" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 儿童隐私</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们的服务面向18岁及以上用户。我们不会有意收集18岁以下儿童的个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  如果您发现儿童向我们提供了个人信息，请立即联系我们，我们将尽快删除相关信息。
                </p>
              </section>

              {/* 9. 国际数据传输 */}
              <section id="international" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 国际数据传输</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  您的信息可能会被传输到您所在国家/地区以外的服务器进行处理和存储。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  我们会采取适当措施确保您的数据在传输和存储过程中得到充分保护，符合适用的数据保护法律。
                </p>
              </section>

              {/* 10. 政策更新 */}
              <section id="updates" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 政策更新</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们可能会不时更新本隐私政策。重大变更将通过以下方式通知您：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>在网站上发布醒目通知</li>
                  <li>通过电子邮件通知您</li>
                  <li>在您下次登录时显示更新提示</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  建议您定期查看本政策，了解我们如何保护您的信息。
                </p>
              </section>

              {/* 11. 联系我们 */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. 联系我们</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  如对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <p className="text-gray-700">
                    <strong>数据保护负责人：</strong> 隐私团队
                  </p>
                  <p className="text-gray-700">
                    <strong>邮箱：</strong> privacy@quizzyflow.com
                  </p>
                  <p className="text-gray-700">
                    <strong>地址：</strong> 中国上海市浦东新区张江高科技园区
                  </p>
                  <p className="text-gray-700">
                    <strong>响应时间：</strong> 我们将在30天内回复您的请求
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  如果您对我们的回复不满意，您有权向相关数据保护监管机构投诉。
                </p>
              </section>

              {/* 特别声明 */}
              <section className="mb-12">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">重要声明</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    我们承诺严格遵守适用的数据保护法律法规，包括但不限于《中华人民共和国个人信息保护法》、
                    《中华人民共和国数据安全法》、欧盟《通用数据保护条例》(GDPR)等。
                    您的信任对我们至关重要，我们将持续改进隐私保护措施。
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
          <p>© 2024 QuizzyFlow. 保留所有权利。 | <Link to="/terms" className="text-blue-600 hover:text-blue-700">服务条款</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Privacy

