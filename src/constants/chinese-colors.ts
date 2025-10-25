/**
 * 中国传统色彩数据
 * 数据来源: https://zhongguose.com/
 */

export interface ChineseColor {
  name: string          // 中文名称
  pinyin: string        // 拼音
  hex: string          // 十六进制颜色值
  rgb: {
    r: number
    g: number
    b: number
  }
  cmyk: {
    c: number
    m: number
    y: number
    k: number
  }
}

export const chineseColors: ChineseColor[] = [
  // 红色系
  {
    name: '胭脂',
    pinyin: 'YANZHI',
    hex: '#9d2933',
    rgb: { r: 157, g: 41, b: 51 },
    cmyk: { c: 0, m: 74, y: 68, k: 38 }
  },
  {
    name: '朱红',
    pinyin: 'ZHUHONG',
    hex: '#ff4c00',
    rgb: { r: 255, g: 76, b: 0 },
    cmyk: { c: 0, m: 70, y: 100, k: 0 }
  },
  {
    name: '妃色',
    pinyin: 'FEISE',
    hex: '#ed5736',
    rgb: { r: 237, g: 87, b: 54 },
    cmyk: { c: 0, m: 63, y: 77, k: 7 }
  },
  {
    name: '海棠红',
    pinyin: 'HAITANGHONG',
    hex: '#db5a6b',
    rgb: { r: 219, g: 90, b: 107 },
    cmyk: { c: 0, m: 59, y: 51, k: 14 }
  },
  {
    name: '嫣红',
    pinyin: 'YANHONG',
    hex: '#ef7a82',
    rgb: { r: 239, g: 122, b: 130 },
    cmyk: { c: 0, m: 49, y: 46, k: 6 }
  },

  // 橙色系
  {
    name: '橘黄',
    pinyin: 'JUHUANG',
    hex: '#ff8936',
    rgb: { r: 255, g: 137, b: 54 },
    cmyk: { c: 0, m: 46, y: 79, k: 0 }
  },
  {
    name: '杏黄',
    pinyin: 'XINGHUANG',
    hex: '#ffa631',
    rgb: { r: 255, g: 166, b: 49 },
    cmyk: { c: 0, m: 35, y: 81, k: 0 }
  },
  {
    name: '橙皮',
    pinyin: 'CHENGPI',
    hex: '#ff9d2e',
    rgb: { r: 255, g: 157, b: 46 },
    cmyk: { c: 0, m: 38, y: 82, k: 0 }
  },

  // 黄色系
  {
    name: '赤金',
    pinyin: 'CHIJIN',
    hex: '#f2be45',
    rgb: { r: 242, g: 190, b: 69 },
    cmyk: { c: 0, m: 21, y: 71, k: 5 }
  },
  {
    name: '姜黄',
    pinyin: 'JIANGHUANG',
    hex: '#ffc773',
    rgb: { r: 255, g: 199, b: 115 },
    cmyk: { c: 0, m: 22, y: 55, k: 0 }
  },
  {
    name: '缃色',
    pinyin: 'XIANGSE',
    hex: '#f0c239',
    rgb: { r: 240, g: 194, b: 57 },
    cmyk: { c: 0, m: 19, y: 76, k: 6 }
  },
  {
    name: '鹅黄',
    pinyin: 'EHUANG',
    hex: '#fff143',
    rgb: { r: 255, g: 241, b: 67 },
    cmyk: { c: 0, m: 5, y: 74, k: 0 }
  },

  // 绿色系
  {
    name: '青翠',
    pinyin: 'QINGCUI',
    hex: '#00bc12',
    rgb: { r: 0, g: 188, b: 18 },
    cmyk: { c: 100, m: 0, y: 90, k: 26 }
  },
  {
    name: '碧绿',
    pinyin: 'BILV',
    hex: '#2add9c',
    rgb: { r: 42, g: 221, b: 156 },
    cmyk: { c: 81, m: 0, y: 29, k: 13 }
  },
  {
    name: '松花绿',
    pinyin: 'SONGHUALV',
    hex: '#057748',
    rgb: { r: 5, g: 119, b: 72 },
    cmyk: { c: 96, m: 0, y: 39, k: 53 }
  },
  {
    name: '松柏绿',
    pinyin: 'SONGBAILV',
    hex: '#21a675',
    rgb: { r: 33, g: 166, b: 117 },
    cmyk: { c: 80, m: 0, y: 29, k: 35 }
  },

  // 青色系
  {
    name: '蔚蓝',
    pinyin: 'WEILAN',
    hex: '#70f3ff',
    rgb: { r: 112, g: 243, b: 255 },
    cmyk: { c: 56, m: 5, y: 0, k: 0 }
  },
  {
    name: '碧蓝',
    pinyin: 'BILAN',
    hex: '#3eede7',
    rgb: { r: 62, g: 237, b: 231 },
    cmyk: { c: 74, m: 0, y: 2, k: 7 }
  },
  {
    name: '青碧',
    pinyin: 'QINGBI',
    hex: '#48c0a3',
    rgb: { r: 72, g: 192, b: 163 },
    cmyk: { c: 62, m: 0, y: 15, k: 25 }
  },
  {
    name: '青矾',
    pinyin: 'QINGFAN',
    hex: '#21c8b6',
    rgb: { r: 33, g: 200, b: 182 },
    cmyk: { c: 84, m: 0, y: 9, k: 22 }
  },

  // 蓝色系
  {
    name: '靛青',
    pinyin: 'DIANQING',
    hex: '#177cb0',
    rgb: { r: 23, g: 124, b: 176 },
    cmyk: { c: 87, m: 30, y: 0, k: 31 }
  },
  {
    name: '宝蓝',
    pinyin: 'BAOLAN',
    hex: '#4b5cc4',
    rgb: { r: 75, g: 92, b: 196 },
    cmyk: { c: 62, m: 53, y: 0, k: 23 }
  },
  {
    name: '藏蓝',
    pinyin: 'ZANGLAN',
    hex: '#3b2e7e',
    rgb: { r: 59, g: 46, b: 126 },
    cmyk: { c: 53, m: 63, y: 0, k: 51 }
  },
  {
    name: '黛蓝',
    pinyin: 'DAILAN',
    hex: '#425066',
    rgb: { r: 66, g: 80, b: 102 },
    cmyk: { c: 35, m: 22, y: 0, k: 60 }
  },

  // 紫色系
  {
    name: '紫棠',
    pinyin: 'ZITANG',
    hex: '#56004f',
    rgb: { r: 86, g: 0, b: 79 },
    cmyk: { c: 0, m: 100, y: 8, k: 66 }
  },
  {
    name: '紫藤',
    pinyin: 'ZITENG',
    hex: '#8b2671',
    rgb: { r: 139, g: 38, b: 113 },
    cmyk: { c: 0, m: 73, y: 19, k: 45 }
  },
  {
    name: '紫薇',
    pinyin: 'ZIWEI',
    hex: '#c4549f',
    rgb: { r: 196, g: 84, b: 159 },
    cmyk: { c: 0, m: 57, y: 19, k: 23 }
  },
  {
    name: '丁香',
    pinyin: 'DINGXIANG',
    hex: '#cca4e3',
    rgb: { r: 204, g: 164, b: 227 },
    cmyk: { c: 10, m: 28, y: 0, k: 11 }
  },
  {
    name: '藕荷',
    pinyin: 'OUHE',
    hex: '#edd1d8',
    rgb: { r: 237, g: 209, b: 216 },
    cmyk: { c: 0, m: 12, y: 9, k: 7 }
  },

  // 粉色系
  {
    name: '桃红',
    pinyin: 'TAOHONG',
    hex: '#f47983',
    rgb: { r: 244, g: 121, b: 131 },
    cmyk: { c: 0, m: 50, y: 46, k: 4 }
  },
  {
    name: '粉红',
    pinyin: 'FENHONG',
    hex: '#ffb3a7',
    rgb: { r: 255, g: 179, b: 167 },
    cmyk: { c: 0, m: 30, y: 35, k: 0 }
  },
  {
    name: '品红',
    pinyin: 'PINHONG',
    hex: '#f00056',
    rgb: { r: 240, g: 0, b: 86 },
    cmyk: { c: 0, m: 100, y: 64, k: 6 }
  },

  // 棕色系
  {
    name: '赭石',
    pinyin: 'ZHESHI',
    hex: '#862617',
    rgb: { r: 134, g: 38, b: 23 },
    cmyk: { c: 0, m: 72, y: 83, k: 47 }
  },
  {
    name: '驼色',
    pinyin: 'TUOSE',
    hex: '#a88462',
    rgb: { r: 168, g: 132, b: 98 },
    cmyk: { c: 0, m: 21, y: 42, k: 34 }
  },
  {
    name: '棕红',
    pinyin: 'ZONGHONG',
    hex: '#9b4400',
    rgb: { r: 155, g: 68, b: 0 },
    cmyk: { c: 0, m: 56, y: 100, k: 39 }
  },
  {
    name: '琥珀',
    pinyin: 'HUPO',
    hex: '#ca6924',
    rgb: { r: 202, g: 105, b: 36 },
    cmyk: { c: 0, m: 48, y: 82, k: 21 }
  },

  // 灰色系
  {
    name: '银白',
    pinyin: 'YINBAI',
    hex: '#e9e7ef',
    rgb: { r: 233, g: 231, b: 239 },
    cmyk: { c: 2, m: 3, y: 0, k: 6 }
  },
  {
    name: '月白',
    pinyin: 'YUEBAI',
    hex: '#d6ecf0',
    rgb: { r: 214, g: 236, b: 240 },
    cmyk: { c: 11, m: 2, y: 0, k: 6 }
  },
  {
    name: '苍灰',
    pinyin: 'CANGHUI',
    hex: '#bac1c8',
    rgb: { r: 186, g: 193, b: 200 },
    cmyk: { c: 7, m: 3, y: 0, k: 22 }
  },
  {
    name: '青灰',
    pinyin: 'QINGHUI',
    hex: '#5f6f81',
    rgb: { r: 95, g: 111, b: 129 },
    cmyk: { c: 26, m: 14, y: 0, k: 49 }
  },
  {
    name: '乌黑',
    pinyin: 'WUHEI',
    hex: '#392f41',
    rgb: { r: 57, g: 47, b: 65 },
    cmyk: { c: 12, m: 28, y: 0, k: 75 }
  },

  // 金色系
  {
    name: '金色',
    pinyin: 'JINSE',
    hex: '#eacd76',
    rgb: { r: 234, g: 205, b: 118 },
    cmyk: { c: 0, m: 12, y: 50, k: 8 }
  },
  {
    name: '银色',
    pinyin: 'YINSE',
    hex: '#c0c0c0',
    rgb: { r: 192, g: 192, b: 192 },
    cmyk: { c: 0, m: 0, y: 0, k: 25 }
  },
]

// 按色系分类
export const colorCategories = [
  { 
    name: '红色系', 
    colors: chineseColors.filter((_, i) => i >= 0 && i < 5) 
  },
  { 
    name: '橙色系', 
    colors: chineseColors.filter((_, i) => i >= 5 && i < 8) 
  },
  { 
    name: '黄色系', 
    colors: chineseColors.filter((_, i) => i >= 8 && i < 12) 
  },
  { 
    name: '绿色系', 
    colors: chineseColors.filter((_, i) => i >= 12 && i < 16) 
  },
  { 
    name: '青色系', 
    colors: chineseColors.filter((_, i) => i >= 16 && i < 20) 
  },
  { 
    name: '蓝色系', 
    colors: chineseColors.filter((_, i) => i >= 20 && i < 24) 
  },
  { 
    name: '紫色系', 
    colors: chineseColors.filter((_, i) => i >= 24 && i < 29) 
  },
  { 
    name: '粉色系', 
    colors: chineseColors.filter((_, i) => i >= 29 && i < 32) 
  },
  { 
    name: '棕色系', 
    colors: chineseColors.filter((_, i) => i >= 32 && i < 36) 
  },
  { 
    name: '灰色系', 
    colors: chineseColors.filter((_, i) => i >= 36 && i < 41) 
  },
  { 
    name: '金银系', 
    colors: chineseColors.filter((_, i) => i >= 41 && i < 43) 
  },
]

// 默认推荐的中国风主题色
export const recommendedThemes = [
  {
    name: '故宫红',
    primary: '#9d2933',
    description: '庄重典雅的中国红'
  },
  {
    name: '青花瓷',
    primary: '#3b2e7e',
    description: '古典雅致的青花蓝'
  },
  {
    name: '竹青',
    primary: '#057748',
    description: '清新自然的竹林绿'
  },
  {
    name: '赤金',
    primary: '#f2be45',
    description: '富贵华丽的金黄色'
  },
  {
    name: '月白',
    primary: '#d6ecf0',
    description: '淡雅清新的月光白'
  },
  {
    name: '紫薇',
    primary: '#c4549f',
    description: '浪漫优雅的紫薇色'
  },
]

