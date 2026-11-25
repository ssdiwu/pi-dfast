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
- 本机原始现场放 `.artifacts/`（Git 忽略）。
- 不得从 `doc/references/` 的历史记录倒推当前行为。

## 双语文档与变更日志

- `README.md` 是英文默认版，`README-zh.md` 是完整中文版；两版顶部互链，行为、命令、安装、公开协议与贡献入口必须语义一致。
- 公开协议或用户可见行为变化时，同一提交内同步两版 README 与 `doc/规格/现行规格.md`。
- 两份变更日志都在本 GitHub 仓库维护：`doc/references/CHANGELOG.md` 是本插件唯一的英文发布记录（`pi.changelogPath` 指向它），根目录 `CHANGELOG-zh.md` 是中文日常记录；两份只写用户可感知事实，不写验证日志、内部过程或纯文档整理。
- 日常用中文把已完成的用户可感知变化写入 `CHANGELOG-zh.md`；准备发布（release）时按版本把同一版本的用户可感知条目同步进英文 `doc/references/CHANGELOG.md`，两份都保留该版本记录，并核对版本、日期与 issue 链接。
- `README.md` 是英文默认版（npm 默认展示），`README-zh.md` 是同包附带的中文版；两份 README 与两份 changelog 都随 npm 包发布。发布前用 `npm pack --dry-run --ignore-scripts --json` 核对清单包含 `README.md`、`README-zh.md`、`doc/references/CHANGELOG.md`、`CHANGELOG-zh.md`。
- `doc/`、`AGENTS.md` 等内部文件无需全译，保留中文历史文档即可。

## 验证

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

涉及请求资格或注入逻辑时，还要运行一个只加载本扩展的真实 `openai-codex` 请求，并检查 `before_provider_request` 行为测试覆盖。

## Git

- 一次提交只完成一件事，遵循 Conventional Commits（约定式提交）。
- 除非用户明确要求，不执行 `git commit`、`git push`、`git tag` 或 `npm publish`。
