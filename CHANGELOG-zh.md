# 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 的基本格式。带 tag 的发布以 Git tag 为版本号；已发布版本由发布负责人负责维护英文 `doc/references/CHANGELOG.md`（本插件唯一的英文正文，`pi.changelogPath` 指向它），本文件是对应版本的中文镜像。两份日志只记录用户可感知事实，日常用中文记录，准备发布（release）时按版本同步到英文，并都随 npm 包发布。

新发布使用 `## [x.y.z] - YYYY-MM-DD` 格式的标题；条目可唯一对应 GitHub issue 时，在末尾附 `(#xx)`。历史条目保留原有标题格式。

## [Unreleased]

## [0.1.1] - 2026-11-25

### Changed

- 支持 Pi 1.6.0。

## [0.1.0] - 2026-07-15

### Added

- 新增 `/fast` 命令与会话级状态跟踪；每个新会话默认关闭，恢复同一会话会恢复它自己的开关状态。
- 只对明确支持的 `openai-codex` 模型注入 `service_tier: "priority"`。
- 新增版本化的 `pi-dfast/updated` 状态协议，供 `pi-dstatus`、`pi-dusage` 等扩展消费。
