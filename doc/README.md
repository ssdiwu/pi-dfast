# pi-dfast 文档入口

> English contributor navigation. 中文正文保留在下方，两版语义一致。
>
> | Where to start | What it answers |
> |---|---|
> | [../README.md](../README.md) | English project entry: behavior, supported models, commands, install, development, contributing |
> | [../README-zh.md](../README-zh.md) | 中文完整版，与英文版语义一致 |
> | [../AGENTS.md](../AGENTS.md) | Agent rules: authority order, bilingual README + changelog rules, verification, Git constraints |
> | [规格/现行规格.md](规格/现行规格.md) | The single body of truth for the current mechanism and boundaries |
> | [术语表.md](术语表.md) | Project terms |
> | [references/](references/) | Sources, verification and history — not current authority |
> | [references/CHANGELOG.md](references/CHANGELOG.md) | The single English changelog body: user-perceivable changes per released version |
> | [../CHANGELOG-zh.md](../CHANGELOG-zh.md) | Daily Chinese changelog, mirrored per released version; shipped in the npm package |
>
> Behavior changes update the specification document first, then the code, then both README versions. User-perceivable changes are logged daily in the Chinese `CHANGELOG-zh.md` and, per released version, mirrored in the English `doc/references/CHANGELOG.md` (the single English changelog, referenced by `pi.changelogPath`); both changelogs and both READMEs ship in the npm package.

## 中文导航

1. [工程入口](../README.md)：使用者视角的命令、安装与验证（英文默认版）；中文完整版见 [README-zh.md](../README-zh.md)
2. [现行规格](./规格/现行规格.md)：当前机制与边界的唯一正文。
3. [术语表](./术语表.md)：项目术语。
4. [决策档案](./决策档案/README.md)：难逆转决策的索引。
5. [证据与历史](./references/)：来源、验证与历史记录，不是现行权威。
6. [代理协作规则](../AGENTS.md)：本仓库的工作依据与约定。
7. [贡献说明](../README.md#contributing)：英文默认版的贡献入口；中文见 [README-zh.md](../README-zh.md#贡献)。

`doc/规格/` 是当前机制的唯一正文；`doc/决策档案/` 是难逆转决策的刻碑；`doc/references/` 只保存来源、验证证据与历史阶段记录，不作为并行需求或现行实现权威。

本机原始现场（截图、抓包、原始日志）放仓库根 `.artifacts/`，已被 Git 忽略；引用它不表示文件随仓库分发。

根上无 `PLAN.md`：本仓库没有落在仓库文档里的当前执行状态正文。

## 现行规格（`doc/规格/`）

正文：[现行规格.md](./规格/现行规格.md)。

| 节 | 回答什么 |
|---|---|
| 会话与状态边界 | 默认关闭、状态写入当前 session、分支恢复规则 |
| 请求注入 | 注入字段、模型双重核对、不改动的其他参数 |
| 支持模型 | 当前允许列表与排除项 |
| 公开状态协议 | 事件载荷、`DFastSnapshot`、原生 status 显隐规则 |
| 与其他扩展协作 | `pi-dusage`、`pi-dstatus` 的组合边界 |

## 决策档案（`doc/决策档案/`）

| 文件 | 内容 |
|---|---|
| [0001-控制查询展示解耦.md](./决策档案/0001-控制查询展示解耦.md) | Fast 控制、quota 查询与 Footer 展示由独立扩展通过公开事件协议组合 |

## 证据与历史（`doc/references/`）

| 文件 | 内容 |
|---|---|
| [CHANGELOG.md](./references/CHANGELOG.md) | 版本沿革（唯一英文正文，Keep a Changelog 格式） |
| [../CHANGELOG-zh.md](../CHANGELOG-zh.md) | 日常中文变更记录，发布时按版本对齐英文；随 npm 包发布 |

## 维护规则

- 机制、边界或支持模型变化 → 更新 `doc/规格/现行规格.md`；术语变化 → 更新 `doc/术语表.md`；难逆转决策 → 记入 `doc/决策档案/` 并同步索引。
- 日常在本仓根 `CHANGELOG-zh.md` 记录已完成的用户可感知变化，准备发布时按版本同步到英文 `doc/references/CHANGELOG.md`（唯一英文正文，`pi.changelogPath` 指向它）；两份 changelog 都随 npm 包发布。本机原始现场放 `.artifacts/`（Git 忽略）。
- 公开协议或用户可见行为变化 → 同步英文 `README.md` 与中文 `README-zh.md`；内部文件（`doc/`、`AGENTS.md`）无需全译。
- 验证命令以 `README.md`「验证」与 `AGENTS.md`「验证」为准，实际验证记录 → `doc/references/`。
