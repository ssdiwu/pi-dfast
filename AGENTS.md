# AGENTS.md — pi-dfast

## 项目定位

`pi-dfast` 是 Pi 的会话级 Codex Fast Mode（快速模式）控制器。它只负责状态控制、会话记录、请求注入与公开状态事件，不查询 quota（配额），也不实现自定义 Footer（页脚）。

## 阅读顺序

1. `README.md`：功能、边界、命令和验证方式。
2. `doc/README.md`：文档入口与公开协议。
3. `doc/术语表.md`：项目术语。
4. `src/fast-mode.ts`：模型资格与请求注入纯逻辑。
5. `src/session-state.ts`：会话状态记录与恢复。
6. `index.ts`：Pi Extension（扩展）入口。

## 实现边界

- 每个新会话默认关闭；状态只写入当前 session（会话），恢复该会话时再恢复开关。
- 禁止从全局或项目配置继承默认开启状态，其他会话不得受到当前会话影响。
- 只允许 `openai-codex` 且在明确支持列表内的模型。
- 注入前同时核对当前模型与 provider payload（提供方请求载荷）的模型，避免错改请求。
- 只增加 `service_tier: "priority"`，不修改 Prompt（提示词）、verbosity（回答详略）或其他采样参数。
- 不读取或修改认证信息，不支持 API Key（API 密钥）提供方。
- 不调用 `setFooter()`；只使用公开 `setStatus()` 和版本化事件协议。
- 不把“已开启”误写成“服务端已确认”；`active` 仅表示当前请求满足本地注入条件。

## 验证

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

涉及请求资格或注入逻辑时，还要运行一个只加载本扩展的真实 `openai-codex` 请求，并检查 `before_provider_request` 行为测试覆盖。

## Git

- 一次提交只完成一件事，遵循 Conventional Commits（约定式提交）。
- 除非用户明确要求，不执行 `git commit`、`git push`、`git tag` 或 `npm publish`。
