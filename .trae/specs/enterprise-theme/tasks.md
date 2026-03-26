# Tasks

## Phase 1: 主题核心配置

- [x] Task 1: 更新 ThemeContext.tsx
  - [x] SubTask 1.1: 在 Theme 类型中添加 'enterprise'
  - [x] SubTask 1.2: 将默认主题改为 'enterprise'
  - [x] SubTask 1.3: 确保 localStorage 正确读取默认主题

- [x] Task 2: 在 index.css 中添加 enterprise 主题样式变量
  - [x] SubTask 2.1: 定义企业级主题配色变量
  - [x] SubTask 2.2: 定义企业级按钮样式
  - [x] SubTask 2.3: 定义企业级卡片样式
  - [x] SubTask 2.4: 定义企业级表单样式
  - [x] SubTask 2.5: 定义企业级表格样式
  - [x] SubTask 2.6: 定义企业级导航样式

## Phase 2: 页面适配

- [x] Task 3: 更新登录页面 Login.tsx
  - [x] SubTask 3.1: 更新登录页面背景样式
  - [x] SubTask 3.2: 更新登录卡片样式
  - [x] SubTask 3.3: 更新登录按钮样式
  - [x] SubTask 3.4: 更新输入框样式

- [x] Task 4: 更新布局组件 Layout.tsx
  - [x] SubTask 4.1: 更新侧边栏样式
  - [x] SubTask 4.2: 更新顶部导航样式
  - [x] SubTask 4.3: 更新底部版权样式

- [x] Task 5: 更新首页 Home.tsx
  - [x] SubTask 5.1: 更新卡片布局样式
  - [x] SubTask 5.2: 更新快捷建议样式
  - [x] SubTask 5.3: 更新常用智能体样式

- [x] Task 6: 更新智能体市场 Marketplace.tsx
  - [x] SubTask 6.1: 更新分类标签样式
  - [x] SubTask 6.2: 更新智能体卡片样式
  - [x] SubTask 6.3: 更新详情弹窗样式
  - [x] SubTask 6.4: 更新上架弹窗样式

- [x] Task 7: 更新工作台 Workspace.tsx
  - [x] SubTask 7.1: 更新对话界面样式
  - [x] SubTask 7.2: 更新消息气泡样式
  - [x] SubTask 7.3: 更新输入区域样式

- [x] Task 8: 更新知识库页面 KnowledgeBase.tsx
  - [x] SubTask 8.1: 更新表格样式
  - [x] SubTask 8.2: 更新外部知识库卡片样式
  - [x] SubTask 8.3: 更新弹窗样式

- [x] Task 9: 更新设置页面 Settings.tsx
  - [x] SubTask 9.1: 添加 enterprise 主题选项
  - [x] SubTask 9.2: 更新设置项样式
  - [x] SubTask 9.3: 更新开关样式

## Phase 3: 组件适配

- [x] Task 10: 更新其他组件样式
  - [x] SubTask 10.1: 更新按钮组件样式
  - [x] SubTask 10.2: 更新标签组件样式
  - [x] SubTask 10.3: 更新徽章组件样式

## Phase 4: 验证

- [x] Task 11: 全面验证主题适配
  - [x] SubTask 11.1: 验证登录页面样式
  - [x] SubTask 11.2: 验证首页样式
  - [x] SubTask 11.3: 验证智能体市场样式
  - [x] SubTask 11.4: 验证工作台样式
  - [x] SubTask 11.5: 验证知识库样式
  - [x] SubTask 11.6: 验证设置页面样式
  - [x] SubTask 11.7: 验证主题切换功能
  - [x] SubTask 11.8: 验证主题持久化

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 1, Task 2]
- [Task 5] depends on [Task 1, Task 2, Task 4]
- [Task 6] depends on [Task 1, Task 2, Task 4]
- [Task 7] depends on [Task 1, Task 2, Task 4]
- [Task 8] depends on [Task 1, Task 2, Task 4]
- [Task 9] depends on [Task 1, Task 2, Task 4]
- [Task 10] depends on [Task 2]
- [Task 11] depends on [Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9, Task 10]
