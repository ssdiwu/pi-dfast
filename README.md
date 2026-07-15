# pi-dfast

`pi-dfast` 是一个职责单一的 Pi Extension（扩展）：为符合资格的 OpenAI Codex 请求控制 Fast Mode（快速模式）。

## 行为

- 每个新会话都默认关闭，不存在全局或项目级默认值。
- `/fast on|off` 只把状态写入当前 Pi session（会话）的 Custom Entry（自定义记录）；恢复同一会话时恢复，其他会话不受影响。
- 在 session tree（会话树）切换分支时，状态沿当前分支记录恢复，不会从另一条分支泄漏。
- 开启且当前模型受支持时，在 `before_provider_request` 阶段只增加：

```json
{
  "service_tier": "priority"
}
```

- 同时检查当前 Pi 模型和 provider payload（提供方请求载荷）的模型，避免错改其他请求。
- 不修改 Prompt（提示词）、verbosity（回答详略）、thinking level（思考等级）或认证信息。
- 通过 `setStatus("dfast", ...)` 提供原生状态，并发布 `pi-dfast/updated` 版本化快照；有结构化消费者时隐藏原生状态，避免 Footer 重复显示。

## 支持范围

当前只允许 `openai-codex` 的以下模型：

- `gpt-5.4`
- `gpt-5.5`
- `gpt-5.6-luna`
- `gpt-5.6-sol`
- `gpt-5.6-terra`

`gpt-5.4-mini` 与 `gpt-5.3-codex-spark` 当前不在允许列表。允许列表表示本地会注入 Priority Service Tier（优先服务等级），不构成服务端 entitlement（资格）或实际加速证明。

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
cd /Users/diwu/Workspace/Codes/Githubs/pi-dfast
npm install
pi --no-extensions -e .
```

也可以把本仓库绝对路径加入 `~/.pi/agent/settings.json` 的 `packages` 后执行 `/reload`。

### npm（发布后）

```bash
pi install npm:@diwu507/pi-dfast
```

## 验证

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

真实请求验证应使用支持列表中的 `openai-codex` 模型，并确认：关闭时载荷不变、开启时只增加 `service_tier: "priority"`、不支持模型显示 inactive 且不注入。
