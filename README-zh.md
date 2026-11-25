# pi-dfast

[English](./README.md) | 中文

职责单一的 Pi Extension（扩展）：为符合资格的 OpenAI Codex 请求控制 Fast Mode（快速模式）。

## 行为

- 每个新会话都默认关闭；`/fast on|off` 只对当前会话生效，恢复同一会话时恢复自己的开关。
- 在 session tree（会话树）切换分支时，状态沿当前分支记录恢复，不从另一条分支泄漏。
- 开启且当前模型受支持时，请求只增加 `service_tier: "priority"`，不修改 Prompt（提示词）、verbosity（回答详略）、thinking level（思考等级）或认证信息。
- 通过 `setStatus("dfast", ...)` 提供原生状态，并发布 `pi-dfast/updated` 版本化快照；有结构化消费者时隐藏原生状态，避免 Footer 重复显示。

行为、边界与支持模型的唯一正文见 [doc/规格/现行规格.md](doc/规格/现行规格.md)；本节只作使用者视角的摘要。

## 支持范围

当前只允许 `openai-codex` 的 `gpt-5.4`、`gpt-5.5`、`gpt-5.6-luna`、`gpt-5.6-sol`、`gpt-5.6-terra`。

`gpt-5.4-mini` 与 `gpt-5.3-codex-spark` 当前不在允许列表。允许列表表示本地会注入 Priority Service Tier（优先服务等级），不构成服务端 entitlement（资格）或实际加速证明。完整列表见 [doc/规格/现行规格.md](doc/规格/现行规格.md)。

## 命令

```text
/fast
/fast on
/fast off
/fast status
```

- `/fast`：切换开关。
- `/fast on|off`：显式设置，适合脚本和可重复验证。
- `/fast status`：显示开关、当前模型与本地是否满足注入条件。

在 `--no-session` 或尚未产生持久化 session file（会话文件）的临时进程中，开关只对该进程有效；正常交互会话产生会话文件后才能在下次恢复时还原。

## 与其他扩展组合

- `pi-dusage`：Fast 对当前 Codex 模型变为活动时立即合并刷新 quota（配额）。
- `pi-dstatus`：独立 `fast` 组件显示 `FAST` 或 `FAST · inactive`；关闭时隐藏。

三者只通过版本化 Pi 事件协议连接，不读取彼此私有配置。

## 安装

### 本地开发

```bash
git clone https://github.com/ssdiwu/pi-dfast.git
cd pi-dfast
npm install
pi --no-extensions -e .
```

也可以把本仓库绝对路径加入 `~/.pi/agent/settings.json` 的 `packages` 后执行 `/reload`。

### npm（发布后）

```bash
pi install npm:@diwu507/pi-dfast
```

## 开发

```bash
npm install
npm run check          # 类型检查 + vitest run
```

在 Pi 中直接加载开发目录：

```bash
pi --no-extensions -e . --no-session -p "/fast status"
```

## 验证

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

真实请求验证应使用支持列表中的 `openai-codex` 模型，并确认：关闭时载荷不变、开启时只增加 `service_tier: "priority"`、不支持模型显示 inactive 且不注入。`before_provider_request` 行为测试覆盖注入判定，但不能替代真实请求。

## 贡献

- 先读 [`AGENTS.md`](AGENTS.md)，再读 [`doc/README.md`](doc/README.md) 与机制正文 [`doc/规格/现行规格.md`](doc/规格/现行规格.md)。
- 行为改动先改规格正文，再改代码，然后同步英文 `README.md` 与中文 `README-zh.md` —— 两版必须保持语义一致。
- 公开协议变化（`pi-dfast/updated` 快照、原生 status 行为）必须配套行为测试。
- 用户可感知变化写入变更日志：本仓日常维护中文 [`CHANGELOG-zh.md`](CHANGELOG-zh.md)，准备发布时按版本把同样的事实同步到英文变更日志 [`doc/references/CHANGELOG.md`](doc/references/CHANGELOG.md)（`pi.changelogPath` 指向它）。该文件是唯一的英文变更日志正文，不另建重复正文；两份 changelog 与两版 README 都随 npm 包发布。
- 一次提交只做一件事，遵循 Conventional Commits（约定式提交）。未经明确授权不提交、不推送、不打标签、不发布。

## 文档

- [doc/README.md](doc/README.md)：文档入口。
- [doc/规格/现行规格.md](doc/规格/现行规格.md)：现行机制与边界的唯一正文。
- [doc/references/CHANGELOG.md](doc/references/CHANGELOG.md)：版本沿革（唯一英文正文）。
- [CHANGELOG-zh.md](CHANGELOG-zh.md)：日常中文变更日志，随 npm 包发布。
