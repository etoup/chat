// 主题配置
export const overrides = {
  common: {
    // 主色调
    primaryColor: '#646cff',
    primaryColorHover: '#747bff',
    primaryColorPressed: '#535bf2',
    primaryColorSuppl: 'rgba(100, 108, 255, 0.2)',
    
    // 文本颜色
    textColor1: '#333333', // 主要文本颜色
    textColor2: '#333333', // 次要文本颜色  
    textColor3: '#333333', // 辅助文本颜色
    textColorDisabled: 'rgba(100, 108, 255, 0.5)', // 禁用状态
    
    // 链接颜色也统一
    linkColor: '#646cff',
    linkColorHover: '#747bff',
    linkColorPressed: '#535bf2',
  },
  
  // 组件特定覆盖
  Button: {
    // textColor: '#646cff',
    textColorHover: '#747bff',
    textColorPressed: '#535bf2',
    textColorFocus: '#646cff',
  },
  Input: {
    textColor: '#646cff',
    placeholderColor: 'rgba(100, 108, 255, 0.6)',
  },
  Select: {
    textColor: '#646cff',
  },
  Dropdown: {
    textColor: '#646cff',
  },
  Menu: {
    // itemTextColor: '#646cff',
    itemTextColorHover: '#747bff',
    itemTextColorActive: '#535bf2',
  },
  Tabs: {
    // tabTextColor: 'rgba(100, 108, 255, 0.7)',
    tabTextColorActive: '#646cff',
  }
}
