# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的基本格式。

## [Unreleased]

## [0.1.0] - 2026-07-15

### Added

- 新增 `/fast` 命令及会话级状态记录；每个新会话默认关闭，恢复同一会话时恢复自己的开关。
- 仅对明确支持的 `openai-codex` 模型请求注入 `service_tier: "priority"`。
- 新增版本化 `pi-dfast/updated` 状态协议，供 `pi-dstatus`、`pi-dusage` 等扩展消费。
