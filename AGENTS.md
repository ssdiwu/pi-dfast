# AGENTS.md — pi-dfast

## 项目定位

`pi-dfast` 是 Pi 的会话级 Codex Fast Mode（快速模式）控制器。它只负责状态控制、会话记录、请求注入与公开状态事件，不查询 quota（配额），也不实现自定义 Footer（页脚）。

## 阅读顺序

1. `README.md`：使用者视角的命令、安装与验证方式。
2. `doc/README.md`：文档入口。
3. `doc/规格/现行规格.md`：当前机制与边界的唯一正文。
4. `doc/术语表.md`：项目术语。
5. `doc/决策档案/README.md`：难逆转决策索引。
6. `src/fast-mode.ts`：模型资格与请求注入纯逻辑。
7. `src/session-state.ts`：会话状态记录与恢复。
8. `index.ts`：Pi Extension（扩展）入口。

## 实现边界

实现边界以 `doc/规格/现行规格.md` 为唯一正文，本文件不重复抄写。改动时遵守以下约束：

- 任何行为变化先改 `doc/规格/现行规格.md` 对应小节，再改代码；`README.md` 只保留使用者视角摘要。
- 难逆转决定记入 `doc/决策档案/`（以「后记」追加，不改写原文）；可改做法追加经验笔记。
- 用户可感知的已完成变化写 `doc/references/CHANGELOG.md`；本机原始现场放 `.artifacts/`（Git 忽略）。
- 不得从 `doc/references/` 的历史记录倒推当前行为。

## 验证

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

涉及请求资格或注入逻辑时，还要运行一个只加载本扩展的真实 `openai-codex` 请求，并检查 `before_provider_request` 行为测试覆盖。

## Git

- 一次提交只完成一件事，遵循 Conventional Commits（约定式提交）。
- 除非用户明确要求，不执行 `git commit`、`git push`、`git tag` 或 `npm publish`。
