## JSON Schame 示例

```json
{
  "componentList": [
    {
      "fe_id": "c1",
      "type": "question-title",
      "title": "标题",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "text": "个人信息调研问卷",
        "level": 1,
        "isCenter": false,
        "animateType": "none",
        "typewriter": {
          "isOpen": true,
          "config": {
            "speed": 50,
            "cursor": "⎟"
          }
        }
      }
    },
    {
      "fe_id": "SuobjsWUFph9R2o4QdJaz",
      "title": "抽屉",
      "type": "question-drawer",
      "props": {
        "title": "详情",
        "content": "这里是抽屉的内容",
        "placement": "right",
        "width": 378,
        "height": 256,
        "closable": true,
        "mask": true,
        "maskClosable": true,
        "disabled": false
      }
    },
    {
      "fe_id": "TLTeI45w1JYF9GBCYUhaI",
      "title": "对话框",
      "type": "question-modal",
      "props": {
        "title": "提示",
        "content": "这里是对话框的内容",
        "footer": true,
        "width": 520,
        "centered": false,
        "okText": "确定",
        "cancelText": "取消",
        "closable": true,
        "disabled": false
      }
    },
    {
      "fe_id": "gQVUPlKSDnbbBa7VOIHyH",
      "title": "加载中",
      "type": "question-spin",
      "props": {
        "size": "default",
        "tip": "加载中...",
        "spinning": true,
        "delay": 0,
        "disabled": false
      }
    },
    {
      "fe_id": "NRrCcyYgVhEvm7NfxuwZ6",
      "title": "气泡卡片",
      "type": "question-popover",
      "props": {
        "title": "卡片标题",
        "content": "这里是卡片的详细内容信息",
        "trigger": "hover",
        "placement": "top",
        "buttonText": "点击这里",
        "disabled": false
      }
    },
    {
      "fe_id": "y_4YyyCs3b4Wm5FqKVMeb",
      "title": "文字提示",
      "type": "question-tooltip",
      "props": {
        "title": "这是一条提示信息",
        "text": "鼠标移到这里",
        "placement": "top",
        "trigger": "hover",
        "color": "",
        "disabled": false
      }
    },
    {
      "fe_id": "VtjeVNkyXTsELV1QjyeM5",
      "title": "结果页",
      "type": "questionResult",
      "props": {
        "status": "success",
        "title": "提交成功",
        "subTitle": "您的问卷已成功提交，感谢您的参与！",
        "showButton": true,
        "buttonText": "返回首页",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "22tp3M-3uqF3x5vVu7pm6",
      "title": "骨架屏",
      "type": "questionSkeleton",
      "props": {
        "active": true,
        "avatar": true,
        "paragraph": true,
        "rows": 3,
        "showTitle": true,
        "round": false,
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "D-YqM3BXGJNrzOp4e_zjg",
      "title": "空状态",
      "type": "questionEmpty",
      "props": {
        "description": "暂无数据",
        "imageStyle": "default",
        "showButton": false,
        "buttonText": "立即创建",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "xun42hWeV6DIwjZNsNHfW",
      "title": "穿梭框",
      "type": "question-transfer",
      "props": {
        "dataSource": [
          {
            "key": "1",
            "title": "选项 1",
            "disabled": false
          },
          {
            "key": "2",
            "title": "选项 2",
            "disabled": false
          },
          {
            "key": "3",
            "title": "选项 3",
            "disabled": false
          },
          {
            "key": "4",
            "title": "选项 4",
            "disabled": false
          },
          {
            "key": "5",
            "title": "选项 5",
            "disabled": false
          }
        ],
        "targetKeys": [],
        "showSearch": false,
        "titles": [
          "源列表",
          "目标列表"
        ],
        "operations": [
          ">",
          "<"
        ],
        "disabled": false
      }
    },
    {
      "fe_id": "sofcJ-HSpTG8TimbEo_zW",
      "title": "自动完成",
      "type": "question-autocomplete",
      "props": {
        "placeholder": "请输入",
        "options": [
          {
            "value": "option1",
            "label": "选项一"
          },
          {
            "value": "option2",
            "label": "选项二"
          },
          {
            "value": "option3",
            "label": "选项三"
          },
          {
            "value": "option4",
            "label": "选项四"
          },
          {
            "value": "option5",
            "label": "选项五"
          }
        ],
        "filterOption": true,
        "disabled": false,
        "allowClear": true
      }
    },
    {
      "fe_id": "DJPHoTi_7CM4_eNuV0vVt",
      "title": "级联选择",
      "type": "question-cascader",
      "props": {
        "placeholder": "请选择",
        "options": [
          {
            "value": "zhejiang",
            "label": "浙江",
            "children": [
              {
                "value": "hangzhou",
                "label": "杭州"
              },
              {
                "value": "ningbo",
                "label": "宁波"
              }
            ]
          },
          {
            "value": "jiangsu",
            "label": "江苏",
            "children": [
              {
                "value": "nanjing",
                "label": "南京"
              },
              {
                "value": "suzhou",
                "label": "苏州"
              }
            ]
          }
        ],
        "expandTrigger": "click",
        "changeOnSelect": false,
        "showSearch": false,
        "multiple": false,
        "disabled": false
      }
    },
    {
      "fe_id": "Yy8NbwfzBrZRVPLKTIQ0D",
      "title": "选择器",
      "type": "question-select",
      "props": {
        "placeholder": "请选择",
        "options": [
          {
            "value": "1",
            "label": "选项一",
            "disabled": false
          },
          {
            "value": "2",
            "label": "选项二",
            "disabled": false
          },
          {
            "value": "3",
            "label": "选项三",
            "disabled": false
          }
        ],
        "mode": "default",
        "allowClear": true,
        "showSearch": false,
        "disabled": false,
        "size": "middle",
        "maxTagCount": 3
      }
    },
    {
      "fe_id": "yQFxVxG81NfM21hYVVBCz",
      "title": "输入框",
      "type": "question-checkbox",
      "props": {
        "title": "多选标题",
        "isVertical": false,
        "list": [
          {
            "value": "option1",
            "text": "选项1",
            "checked": false
          },
          {
            "value": "option2",
            "text": "选项2",
            "checked": false
          },
          {
            "value": "option3",
            "text": "选项3",
            "checked": false
          }
        ],
        "disabled": false
      }
    },
    {
      "fe_id": "S5XfdqO4qMtNxVwEr6M2y",
      "title": "单选",
      "type": "question-radio",
      "props": {
        "title": "单选标题",
        "isVertical": false,
        "options": [
          {
            "value": 1,
            "text": "选项1"
          },
          {
            "value": 2,
            "text": "选项2"
          }
        ],
        "value": ""
      }
    },
    {
      "fe_id": "VYskXlvHKTgu3kFD0bcXw",
      "title": "菜单",
      "type": "question-menu",
      "props": {
        "mode": "vertical",
        "items": [
          {
            "key": "1",
            "label": "菜单项一",
            "icon": "HomeOutlined",
            "disabled": false
          },
          {
            "key": "2",
            "label": "菜单项二",
            "icon": "UserOutlined",
            "disabled": false,
            "children": [
              {
                "key": "2-1",
                "label": "子菜单 2-1",
                "disabled": false
              },
              {
                "key": "2-2",
                "label": "子菜单 2-2",
                "disabled": false
              }
            ]
          },
          {
            "key": "3",
            "label": "菜单项三",
            "icon": "SettingOutlined",
            "disabled": false
          }
        ],
        "theme": "light",
        "selectedKeys": [
          "1"
        ],
        "disabled": false
      }
    },
    {
      "fe_id": "p9Bsj4duUmTgKTYeV_5Da",
      "title": "下拉菜单",
      "type": "question-dropdown",
      "props": {
        "buttonText": "下拉菜单",
        "menu": [
          {
            "key": "1",
            "label": "选项一",
            "icon": "",
            "disabled": false,
            "danger": false
          },
          {
            "key": "2",
            "label": "选项二",
            "icon": "",
            "disabled": false,
            "danger": false
          },
          {
            "key": "3",
            "label": "选项三",
            "icon": "",
            "disabled": false,
            "danger": false
          }
        ],
        "placement": "bottomLeft",
        "trigger": "hover",
        "disabled": false
      }
    },
    {
      "fe_id": "y3nmRQZECv_DJtkzLQsBq",
      "title": "锚点",
      "type": "question-anchor",
      "props": {
        "items": [
          {
            "key": "1",
            "href": "#section1",
            "title": "第一部分"
          },
          {
            "key": "2",
            "href": "#section2",
            "title": "第二部分"
          },
          {
            "key": "3",
            "href": "#section3",
            "title": "第三部分"
          }
        ],
        "direction": "vertical",
        "affix": true,
        "offsetTop": 100,
        "disabled": false
      }
    },
    {
      "fe_id": "QjiCdvLHUZ-g-buyMT5MP",
      "title": "按钮",
      "type": "question-button",
      "props": {
        "text": "按钮",
        "type": "default",
        "size": "middle",
        "disabled": false,
        "loading": false,
        "icon": "",
        "shape": "default",
        "danger": false,
        "block": false,
        "onClick": ""
      }
    },
    {
      "fe_id": "cA2uInpcSzE-edBHvT1lk",
      "title": "文件上传",
      "type": "question-upload",
      "props": {
        "label": "上传文件",
        "accept": "*",
        "maxCount": 5,
        "maxSize": 10,
        "listType": "text",
        "multiple": true,
        "drag": false
      }
    },
    {
      "fe_id": "k2eOUSOMZ3UqrBhPsAxrX",
      "title": "日期选择",
      "type": "question-date",
      "props": {
        "mode": "date",
        "format": "YYYY-MM-DD",
        "label": "请选择日期",
        "placeholder": "请选择",
        "showTime": false
      }
    },
    {
      "fe_id": "wMR2ap2MIhzTntR4wyA0U",
      "title": "滑块",
      "type": "question-slider",
      "props": {
        "min": 0,
        "max": 100,
        "step": 1,
        "defaultValue": 50,
        "range": false,
        "marks": true,
        "label": "请选择数值",
        "showValue": true
      }
    },
    {
      "fe_id": "bcY_UBFfwO2uYmANfGkHh",
      "title": "评分",
      "type": "question-rate",
      "props": {
        "count": 5,
        "allowHalf": false,
        "allowClear": true,
        "color": "#fadb14",
        "defaultValue": 0,
        "label": "请评分",
        "showValue": true
      }
    },
    {
      "fe_id": "Xk23O0lC-hJIcbg7bE4L9",
      "title": "多行输入",
      "type": "question-textarea",
      "props": {
        "title": "输入框标题",
        "placeholder": "请输入内容..."
      }
    },
    {
      "fe_id": "f5Oqc4Rt4w5inArJwRxM0",
      "title": "输入框",
      "type": "question-input",
      "props": {
        "title": "输入框标题",
        "placeholder": "请输入内容..."
      }
    },
    {
      "fe_id": "j3dLEQCNu5OnxYafJFTKY",
      "title": "音频",
      "type": "question-audio",
      "props": {
        "src": "",
        "autoplay": false,
        "loop": false,
        "controls": true,
        "volume": 80
      }
    },
    {
      "fe_id": "k7qnjUa-QjvYJeL-loslH",
      "title": "视频",
      "type": "question-video",
      "props": {
        "src": "",
        "width": 640,
        "height": 360,
        "autoplay": false,
        "loop": false,
        "controls": true,
        "muted": false,
        "poster": ""
      }
    },
    {
      "fe_id": "ZJRP__3JU-XIxMzZAvrSx",
      "title": "图片",
      "type": "question-image",
      "props": {
        "src": "https://cdn-docs-new.pingcode.com/baike/wp-content/uploads/2024/10/7e7408434abfe70d5c58159c3014e5c3.webp",
        "alt": "图片",
        "width": 400,
        "height": 300,
        "borderRadius": 8,
        "bordered": false,
        "borderColor": "#d9d9d9",
        "fit": "cover",
        "preview": true
      }
    },
    {
      "fe_id": "EItLignqD9fc6GccjqYdf",
      "title": "二维码",
      "type": "question-qrcode",
      "props": {
        "value": "https://example.com",
        "size": 200,
        "level": "M",
        "bgColor": "#FFFFFF",
        "fgColor": "#000000",
        "includeMargin": true,
        "logo": "",
        "logoSize": 40,
        "align": "center",
        "description": "扫描二维码"
      }
    },
    {
      "fe_id": "M1MGOZsJjxLbIGdckHdEw",
      "title": "步骤条",
      "type": "question-steps",
      "props": {
        "steps": [
          {
            "title": "步骤一",
            "description": "这是步骤一的说明"
          },
          {
            "title": "步骤二",
            "description": "这是步骤二的说明"
          },
          {
            "title": "步骤三",
            "description": "这是步骤三的说明"
          }
        ],
        "current": 0,
        "direction": "vertical",
        "size": "default"
      }
    },
    {
      "fe_id": "Ph1-sK4DJtums8eJHYCan",
      "title": "进度条",
      "type": "question-progress",
      "props": {
        "percent": 60,
        "type": "line",
        "status": "normal",
        "strokeColor": "#1890ff",
        "showInfo": true,
        "label": "完成进度"
      }
    },
    {
      "fe_id": "J2Uj7PXWnHZ2lq6OWVLq6",
      "title": "表格",
      "type": "question-table",
      "props": {
        "columns": [
          {
            "title": "列1",
            "dataIndex": "col1"
          },
          {
            "title": "列2",
            "dataIndex": "col2"
          },
          {
            "title": "列3",
            "dataIndex": "col3"
          }
        ],
        "dataSource": [
          {
            "key": "1",
            "col1": "数据1-1",
            "col2": "数据1-2",
            "col3": "数据1-3"
          },
          {
            "key": "2",
            "col1": "数据2-1",
            "col2": "数据2-2",
            "col3": "数据2-3"
          }
        ],
        "bordered": true,
        "striped": false,
        "showHeader": true,
        "size": "middle"
      }
    },
    {
      "fe_id": "MQyqEXabRuJDapIY5A6i_",
      "title": "标签页",
      "type": "questionTabs",
      "props": {
        "items": [
          {
            "label": "选项卡1",
            "key": "1",
            "children": "这是选项卡1的内容"
          },
          {
            "label": "选项卡2",
            "key": "2",
            "children": "这是选项卡2的内容"
          },
          {
            "label": "选项卡3",
            "key": "3",
            "children": "这是选项卡3的内容"
          }
        ],
        "defaultActiveKey": "1",
        "tabPosition": "top",
        "size": "middle",
        "type": "line",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "-jokTCL4fRLNNPML_5l7q",
      "title": "卡片网格",
      "type": "questionCardGrid",
      "props": {
        "items": [
          {
            "title": "React 教程",
            "description": "学习现代化的 React 开发",
            "image": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          },
          {
            "title": "Vue 教程",
            "description": "渐进式 JavaScript 框架",
            "image": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          },
          {
            "title": "TypeScript",
            "description": "JavaScript 的超集",
            "image": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          }
        ],
        "columns": 3,
        "hoverable": true,
        "bordered": true,
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "QoLhA6IAE8TStVl5gSfJn",
      "title": "描述列表",
      "type": "questionDescriptions",
      "props": {
        "title": "用户信息",
        "items": [
          {
            "label": "姓名",
            "content": "张三"
          },
          {
            "label": "手机号",
            "content": "138****8888"
          },
          {
            "label": "邮箱",
            "content": "zhangsan@example.com"
          },
          {
            "label": "地址",
            "content": "北京市朝阳区"
          },
          {
            "label": "创建时间",
            "content": "2024-01-01 10:00:00"
          },
          {
            "label": "备注",
            "content": "这是一段备注信息"
          }
        ],
        "column": 2,
        "bordered": true,
        "size": "default",
        "layout": "horizontal",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "V7CaNcX2454eJonLOWouZ",
      "title": "树形结构",
      "type": "questionTree",
      "props": {
        "treeData": [
          {
            "title": "前端开发",
            "key": "0-0",
            "children": [
              {
                "title": "React",
                "key": "0-0-0",
                "children": [
                  {
                    "title": "Hooks",
                    "key": "0-0-0-0"
                  },
                  {
                    "title": "Redux",
                    "key": "0-0-0-1"
                  }
                ]
              },
              {
                "title": "Vue",
                "key": "0-0-1",
                "children": [
                  {
                    "title": "Vue3",
                    "key": "0-0-1-0"
                  },
                  {
                    "title": "Pinia",
                    "key": "0-0-1-1"
                  }
                ]
              }
            ]
          },
          {
            "title": "后端开发",
            "key": "0-1",
            "children": [
              {
                "title": "Node.js",
                "key": "0-1-0"
              },
              {
                "title": "Python",
                "key": "0-1-1"
              }
            ]
          }
        ],
        "showLine": true,
        "showIcon": false,
        "defaultExpandAll": true,
        "checkable": false,
        "selectable": true,
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "-FOcv3b-LaEvFiDH0ib5B",
      "title": "时间轴",
      "type": "questionTimeline",
      "props": {
        "items": [
          {
            "label": "2024-01",
            "children": "项目启动",
            "color": "green"
          },
          {
            "label": "2024-03",
            "children": "需求分析完成",
            "color": "blue"
          },
          {
            "label": "2024-06",
            "children": "开发阶段",
            "color": "gray"
          },
          {
            "label": "2024-09",
            "children": "测试上线",
            "color": "red"
          }
        ],
        "mode": "left",
        "pending": false,
        "reverse": false,
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "mvicVdo0pyAmekIYtA_aG",
      "title": "统计数字",
      "type": "questionStatistic",
      "props": {
        "title": "在线用户",
        "value": 128936,
        "suffix": "人",
        "precision": 0,
        "groupSeparator": ",",
        "valueStyle": "default",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "5LmVkK80P-gGpHJTxiD95",
      "title": "统计卡片",
      "type": "questionStatCard",
      "props": {
        "title": "总访问量",
        "value": 8846,
        "suffix": "次",
        "subtitle": "今日访问",
        "trend": "up",
        "trendValue": "+12.5%",
        "color": "#1890ff",
        "fe_id": "",
        "isLocked": false
      }
    },
    {
      "fe_id": "ZptqJfObW0w25dXQqzFaN",
      "title": "链接",
      "type": "question-link",
      "props": {
        "text": "链接文本",
        "href": "https://example.com",
        "target": "_blank",
        "underline": true,
        "disabled": false,
        "type": "default"
      }
    },
    {
      "fe_id": "FIywhZlZ1iZlPwgL8TC1G",
      "title": "高亮文本",
      "type": "question-highlight",
      "props": {
        "text": "这是高亮文本",
        "backgroundColor": "#fff566",
        "textColor": "#000000",
        "bold": false,
        "italic": false,
        "underline": false,
        "strikethrough": false,
        "animation": "none"
      }
    },
    {
      "fe_id": "vk3mLQhWuFRM9DnlFj-7e",
      "title": "输入框",
      "type": "question-info",
      "props": {
        "title": "文件标题",
        "desc": "问卷描述"
      }
    },
    {
      "fe_id": "aOcVjN1wXoxm99nocAiWz",
      "title": "折叠面板",
      "type": "question-collapse",
      "props": {
        "title": "点击展开查看详情",
        "content": "这里是折叠的内容，可以放置较长的文本说明或详细信息。",
        "defaultExpanded": false,
        "expandText": "展开",
        "collapseText": "收起",
        "showIcon": true,
        "bordered": true
      }
    },
    {
      "fe_id": "9-kVb95ow7JL1bVuXCF1Q",
      "title": "滚动通知",
      "type": "question-marquee",
      "props": {
        "messages": [
          {
            "id": "1",
            "text": "欢迎参加本次问卷调查！"
          }
        ],
        "direction": "horizontal",
        "speed": 5,
        "pauseOnHover": true,
        "loop": true,
        "backgroundColor": "#e6f7ff",
        "textColor": "#1890ff",
        "showIcon": true
      }
    },
    {
      "fe_id": "J9JlrhKlrBMNP8rXYtzaR",
      "title": "计时器",
      "type": "question-timer",
      "props": {
        "mode": "countdown",
        "duration": 300,
        "format": "MM:SS",
        "showProgress": true,
        "autoStart": false,
        "title": "答题倒计时",
        "warningTime": 60
      }
    },
    {
      "fe_id": "NefffPOHReoITYMjD6odM",
      "title": "徽章标签",
      "type": "question-badge",
      "props": {
        "badges": [
          {
            "text": "标签",
            "color": "#1890ff"
          }
        ],
        "preset": "custom",
        "shape": "default",
        "size": "default",
        "showIcon": false
      }
    },
    {
      "fe_id": "-HpcySzlMgFkct1kTnGCQ",
      "title": "列表",
      "type": "question-list",
      "props": {
        "items": "列表项 1\n列表项 2\n列表项 3",
        "listType": "unordered",
        "markerStyle": "disc",
        "indent": 1,
        "itemSpacing": "normal"
      }
    },
    {
      "fe_id": "Tg0Xt6DsDWU53WC8UtANb",
      "title": "提示卡片",
      "type": "question-alert",
      "props": {
        "message": "提示信息",
        "description": "",
        "type": "info",
        "showIcon": true,
        "closable": false,
        "bordered": true
      }
    },
    {
      "fe_id": "c5c0kitGxScUn78HwXBWd",
      "title": "代码块",
      "type": "question-code",
      "props": {
        "code": "// 在此输入代码\nfunction hello() {\n  console.log(\"Hello World!\");\n}",
        "language": "javascript",
        "showLineNumbers": true,
        "theme": "light",
        "title": "",
        "showCopyButton": true
      }
    },
    {
      "fe_id": "eOZnfC8O2EMGWHNvugmLH",
      "title": "引用块",
      "type": "question-quote",
      "props": {
        "text": "这是一段引用文本",
        "author": "",
        "isItalic": true,
        "iconType": "quote",
        "bgColor": "#f9f9f9",
        "borderColor": "#1890ff"
      }
    },
    {
      "fe_id": "tO_OfteW_56RhclUvSHp7",
      "title": "段落",
      "type": "question-paragraph",
      "props": {
        "text": "段落",
        "isCenter": false
      }
    },
    {
      "fe_id": "mqVsFPacIPHXOMVW5-D1H",
      "title": "标题",
      "type": "question-title",
      "props": {
        "text": "定义标题",
        "level": 1,
        "isCenter": false,
        "color": "#000000",
        "animateType": "none",
        "typewriter": {
          "isOpen": false,
          "config": {
            "speed": 50,
            "cursor": "⎟",
            "isInfinite": false,
            "loopCount": 1
          }
        }
      }
    },
    {
      "fe_id": "c2",
      "type": "question-input",
      "title": "输入框1",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "title": "你的姓名",
        "placeholder": "请输入你的姓名..."
      }
    },
    {
      "fe_id": "c3",
      "type": "question-input",
      "title": "输入框2",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "title": "你的电话号码",
        "placeholder": "请输入你的电话号码..."
      }
    },
    {
      "fe_id": "c4",
      "type": "question-input",
      "title": "输入框3",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "title": "你的住址",
        "placeholder": "请输入你的住址..."
      }
    },
    {
      "fe_id": "c5",
      "type": "question-textarea",
      "title": "",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "title": "你对本次调研的建议",
        "placeholder": "请输入你的建议..."
      }
    },
    {
      "fe_id": "c6",
      "type": "question-paragraph",
      "title": "",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "text": "感谢你参与本次调研，我们将会根据调研结果及时向您反馈。",
        "isCenter": true
      }
    },
    {
      "fe_id": "c7",
      "type": "question-radio",
      "title": "性别",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "type": "单选标题",
        "isVertical": false,
        "options": [
          {
            "text": "男",
            "value": "male"
          },
          {
            "text": "女",
            "value": "female"
          },
          {
            "text": "保密",
            "value": "secret"
          }
        ]
      }
    },
    {
      "fe_id": "c8",
      "type": "question-checkbox",
      "title": "兴趣爱好",
      "isHidden": false,
      "isLocked": false,
      "props": {
        "type": "多选标题",
        "isVertical": false,
        "list": [
          {
            "text": "篮球",
            "value": "basketball",
            "checked": false
          },
          {
            "text": "足球",
            "value": "football",
            "checked": false
          }
        ]
      }
    }
  ],
  "selectedId": "c1",
  "copiedComponent": null
}
```