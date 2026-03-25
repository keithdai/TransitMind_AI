# Tasks

## Phase 1: Mock数据编制

- [x] Task 1: 创建智能体Mock数据文件
  - [x] SubTask 1.1: 创建 src/data/agents.ts 文件
  - [x] SubTask 1.2: 定义Agent接口类型
  - [x] SubTask 1.3: 编制MVP阶段7个智能体的完整数据
  - [x] SubTask 1.4: 编制T2阶段7个智能体的完整数据
  - [x] SubTask 1.5: 为每个智能体添加演示场景数据

## Phase 2: 页面修改

- [x] Task 2: 更新Marketplace.tsx智能体市场
  - [x] SubTask 2.1: 更新分类数组
  - [x] SubTask 2.2: 更新智能体列表数据源
  - [x] SubTask 2.3: 添加MVP/T2阶段标识
  - [x] SubTask 2.4: 更新智能体详情页展示
  - [x] SubTask 2.5: 添加演示场景展示组件

- [x] Task 3: 更新Workspace.tsx工作台
  - [x] SubTask 3.1: 更新常用智能体列表
  - [x] SubTask 3.2: 更新示例对话内容
  - [x] SubTask 3.3: 更新知识库和资源列表

- [x] Task 4: 更新Home.tsx首页
  - [x] SubTask 4.1: 更新快捷建议列表
  - [x] SubTask 4.2: 更新常用智能体列表
  - [x] SubTask 4.3: 更新澄清选项内容

## Phase 3: 交互流程梳理

- [x] Task 5: 梳理智能体交互流程
  - [x] SubTask 5.1: 梳理MVP阶段7个智能体的交互流程
  - [x] SubTask 5.2: 梳理T2阶段7个智能体的交互流程
  - [x] SubTask 5.3: 确保每个流程都有完整的输入输出

## Phase 4: 演示操作手册

- [x] Task 6: 编写演示操作手册
  - [x] SubTask 6.1: 编写手册概述和使用说明
  - [x] SubTask 6.2: 编写MVP阶段智能体演示步骤
  - [x] SubTask 6.3: 编写T2阶段智能体演示步骤
  - [x] SubTask 6.4: 编写演示话术建议
  - [x] SubTask 6.5: 编写常见问题解答

## Phase 5: 验证与测试

- [x] Task 7: 验证修改效果
  - [x] SubTask 7.1: 运行构建验证无错误
  - [x] SubTask 7.2: 验证每个智能体可正常演示
  - [x] SubTask 7.3: 验证交互流程完整性

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2, Task 3, Task 4]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
