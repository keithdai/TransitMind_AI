# 企业级主题更新为深圳数据交易所设计规范 Spec

## Why

当前 enterprise 主题基于 Ant Design 规范，配色与深圳数据交易所设计规范有显著差异。需要按照《深圳数据交易所前端界面设计规范》全面更新 enterprise 主题的配色、字体、间距、圆角、阴影等样式，确保符合专业权威的数据交易所形象。

## What Changes

- 更新 enterprise 主题配色方案（主色从 #1890FF 改为 #1459FA）
- 更新字体规范（使用系统字体栈）
- 更新间距规范（基础单位 4px）
- 更新圆角规范（4px/8px/12px）
- 更新阴影规范（蓝色调阴影）
- 更新按钮样式（渐变效果）
- 更新卡片样式（悬浮效果）
- 更新表单样式
- 更新导航样式（渐变背景）
- 更新表格样式
- 更新状态标签样式
- 更新消息提示样式

## Impact

- Affected specs: index.css, ThemeContext
- Affected code: 
  - `src/index.css` - 所有 enterprise 主题变量和样式
  - `src/pages/Login.tsx` - 登录页面样式
  - `src/pages/Home.tsx` - 首页样式
  - `src/pages/Marketplace.tsx` - 智能体市场样式
  - `src/pages/Workspace.tsx` - 工作台样式
  - `src/pages/KnowledgeBase.tsx` - 知识库样式
  - `src/pages/Settings.tsx` - 设置页面样式
  - `src/components/Layout.tsx` - 布局组件样式

## ADDED Requirements

### Requirement: 深圳数据交易所配色方案

系统应按照深圳数据交易所设计规范更新 enterprise 主题配色：

#### Scenario: 主色调
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下主色调：
  - 主色-蓝：#1459FA (rgb(20, 89, 250))
  - 主色-深蓝：#0032A6
  - 主色-浅蓝：#CFE3FE (rgb(207, 227, 254))
  - 主色-淡蓝：#F0F5FE (rgb(240, 245, 254))

#### Scenario: 辅助色
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下辅助色：
  - 成功-绿：#00B578
  - 警告-橙：#FF8F1F
  - 错误-红：#F53F3F
  - 信息-蓝：#165DFF

#### Scenario: 中性色
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下中性色：
  - 标题黑：#1D2129
  - 正文黑：#4E5969
  - 辅助灰：#86909C
  - 边框灰：#E5E6EB
  - 背景灰：#F7F9FC
  - 纯白：#FFFFFF

### Requirement: 字体规范

系统应按照深圳数据交易所设计规范更新字体：

#### Scenario: 字体家族
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下字体：
  - 主字体：-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif

#### Scenario: 字号层级
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下字号：
  - H1：28px/36px/600
  - H2：22px/30px/600
  - H3：18px/26px/500
  - H4：16px/24px/500
  - 正文：14px/22px/400
  - 辅助：12px/20px/400

### Requirement: 间距规范

系统应按照深圳数据交易所设计规范更新间距：

#### Scenario: 基础间距
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下间距：
  - xs：4px
  - sm：8px
  - md：16px
  - lg：24px
  - xl：32px
  - xxl：48px

### Requirement: 圆角规范

系统应按照深圳数据交易所设计规范更新圆角：

#### Scenario: 圆角层级
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下圆角：
  - 小圆角：4px（按钮、标签、小卡片）
  - 中圆角：8px（卡片、弹窗、下拉框）
  - 大圆角：12px（大卡片、模块容器）
  - 圆形：50%（头像、图标按钮）

### Requirement: 阴影规范

系统应按照深圳数据交易所设计规范更新阴影：

#### Scenario: 阴影层级
- **WHEN** 用户使用 enterprise 主题
- **THEN** 系统使用以下阴影：
  - 卡片阴影：0 2px 12px rgba(0, 50, 166, 0.08)
  - 悬浮阴影：0 4px 16px rgba(0, 50, 166, 0.12)
  - 弹窗阴影：0 8px 32px rgba(0, 50, 166, 0.16)
  - 下拉菜单阴影：0 4px 12px rgba(0, 50, 166, 0.1)

### Requirement: 按钮样式

系统应按照深圳数据交易所设计规范更新按钮样式：

#### Scenario: 主要按钮
- **WHEN** 用户使用 enterprise 主题
- **THEN** 主要按钮样式：
  - 背景：#1459FA
  - 悬停背景：#3D7AFF
  - 按下背景：#0032A6
  - 圆角：4px
  - 阴影：0 2px 8px rgba(20, 89, 250, 0.3)

#### Scenario: 次要按钮
- **WHEN** 用户使用 enterprise 主题
- **THEN** 次要按钮样式：
  - 背景：#FFFFFF
  - 边框：1px solid #1459FA
  - 文字颜色：#1459FA
  - 悬停背景：#F0F5FE

### Requirement: 卡片样式

系统应按照深圳数据交易所设计规范更新卡片样式：

#### Scenario: 基础卡片
- **WHEN** 用户使用 enterprise 主题
- **THEN** 卡片样式：
  - 背景：#FFFFFF
  - 圆角：8px
  - 内边距：20px 24px
  - 阴影：0 2px 12px rgba(0, 50, 166, 0.08)

#### Scenario: 卡片悬浮
- **WHEN** 用户悬浮卡片
- **THEN** 卡片样式：
  - 阴影：0 4px 16px rgba(0, 50, 166, 0.12)
  - 上移：2px

### Requirement: 导航样式

系统应按照深圳数据交易所设计规范更新导航样式：

#### Scenario: 顶部导航
- **WHEN** 用户使用 enterprise 主题
- **THEN** 顶部导航样式：
  - 高度：64px
  - 背景：linear-gradient(90deg, #1459FA 0%, #0032A6 100%)
  - 内边距：0 32px

#### Scenario: 侧边导航
- **WHEN** 用户使用 enterprise 主题
- **THEN** 侧边导航样式：
  - 宽度：220px
  - 背景：#FFFFFF
  - 边框：1px solid #F0F5FE
  - 选中项：背景 #E8F3FF，右边框 3px solid #1459FA

### Requirement: 表格样式

系统应按照深圳数据交易所设计规范更新表格样式：

#### Scenario: 表格基础样式
- **WHEN** 用户使用 enterprise 主题
- **THEN** 表格样式：
  - 表头背景：#F7F9FC
  - 表头文字：#1D2129
  - 行悬停背景：#F7F9FC
  - 边框：#E5E6EB

### Requirement: 状态标签样式

系统应按照深圳数据交易所设计规范更新状态标签样式：

#### Scenario: 状态标签
- **WHEN** 用户使用 enterprise 主题
- **THEN** 状态标签样式：
  - 成功：背景 #E8FFEA，边框 #9CE6A0，文字 #00B578
  - 处理中：背景 #E8F3FF，边框 #A8D4FF，文字 #1459FA
  - 警告：背景 #FFF7E8，边框 #FFD591，文字 #FF8F1F
  - 错误：背景 #FFECE8，边框 #FDCDC5，文字 #F53F3F
  - 默认：背景 #F7F9FC，边框 #E5E6EB，文字 #4E5969

### Requirement: 消息提示样式

系统应按照深圳数据交易所设计规范更新消息提示样式：

#### Scenario: Toast 提示
- **WHEN** 用户使用 enterprise 主题
- **THEN** Toast 样式：
  - 成功：背景 #E8FFEA，边框 #9CE6A0，文字 #00B578
  - 错误：背景 #FFECE8，边框 #FDCDC5，文字 #F53F3F
  - 警告：背景 #FFF7E8，边框 #FFD591，文字 #FF8F1F
  - 信息：背景 #E8F3FF，边框 #A8D4FF，文字 #1459FA

## MODIFIED Requirements

### Requirement: Enterprise 主题变量

更新 enterprise 主题的 CSS 变量：

```css
[data-theme="enterprise"] {
  /* 主色调 */
  --color-primary: #1459FA;
  --color-primary-hover: #3D7AFF;
  --color-primary-active: #0032A6;
  --color-primary-light: #CFE3FE;
  --color-primary-lighter: #F0F5FE;
  
  /* 辅助色 */
  --color-success: #00B578;
  --color-warning: #FF8F1F;
  --color-error: #F53F3F;
  --color-info: #165DFF;
  
  /* 文字颜色 */
  --color-text-primary: #1D2129;
  --color-text-secondary: #4E5969;
  --color-text-muted: #86909C;
  --color-text-disabled: #C9CDD4;
  
  /* 边框颜色 */
  --color-border: #E5E6EB;
  --color-border-light: #F0F5FE;
  
  /* 背景颜色 */
  --color-bg-page: #F7F9FC;
  --color-bg-card: #FFFFFF;
  --color-bg-hover: #F0F5FE;
  
  /* 阴影 */
  --shadow-card: 0 2px 12px rgba(0, 50, 166, 0.08);
  --shadow-hover: 0 4px 16px rgba(0, 50, 166, 0.12);
  --shadow-modal: 0 8px 32px rgba(0, 50, 166, 0.16);
}
```
