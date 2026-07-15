# pi-dfast 文档入口

## 阅读地图

- `../README.md`：产品边界、命令、安装与验证。
- `术语表.md`：项目术语。
- `决策档案/README.md`：关键架构决策索引。
- `../src/fast-mode.ts`：支持模型和请求注入规则。
- `../src/session-state.ts`：当前会话分支里的状态记录与恢复规则。
- `../index.ts`：Pi 生命周期及跨扩展事件协议。

## 公开状态协议

消费者通过 Pi 事件总线使用以下事件：

- `pi-dfast/subscribe` / `pi-dfast/unsubscribe`：载荷为 `{ version: 1, consumerId: string }`。
- `pi-dfast/updated`：载荷为版本化 `DFastSnapshot`，包含开关状态、当前模型、本地是否满足注入条件、原因和更新时间。

快照中的 `active` 表示本地会为当前模型请求注入 Priority Service Tier（优先服务等级），不表示服务端已经确认 Fast Mode 生效。

首个结构化消费者订阅后，`pi-dfast` 清除原生 `dfast` status；最后一个消费者取消订阅后恢复，避免自定义 Footer 重复展示同一状态。

## 会话边界

Fast Mode 状态以 `pi-dfast-state` Custom Entry（自定义记录）写入当前 session，不进入 LLM context（模型上下文）。新会话没有该记录，因此一定关闭；恢复已有会话或切换会话树分支时，只读取当前分支最后一条有效记录。
