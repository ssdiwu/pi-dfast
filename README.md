# pi-dfast

English | [中文](./README-zh.md)

A single-responsibility Pi extension (扩展) that controls Fast Mode (快速模式) for eligible OpenAI Codex requests.

## Behavior

- Every new session starts with Fast Mode off; `/fast on|off` applies to the current session only, and resuming the same session restores its own toggle.
- When switching branches in the session tree (会话树), the state is restored along the current branch and never leaks from another branch.
- When enabled and the current model is supported, the request only gains `service_tier: "priority"`; the prompt (提示词), verbosity (回答详略), thinking level (思考等级) and credentials are left untouched.
- A native status is exposed through `setStatus("dfast", ...)` and a versioned `pi-dfast/updated` snapshot is published; the native status is hidden when structured consumers exist, to avoid duplicated footer output.

The only body of truth for behavior, boundaries and supported models is [`doc/规格/现行规格.md`](doc/规格/现行规格.md); this section is a user-facing summary.

## Supported scope

Only `gpt-5.4`, `gpt-5.5`, `gpt-5.6-luna`, `gpt-5.6-sol` and `gpt-5.6-terra` of `openai-codex` are currently allowed.

`gpt-5.4-mini` and `gpt-5.3-codex-spark` are currently not in the allow list. The allow list means that Priority Service Tier (优先服务等级) is injected locally; it is not a proof of server-side entitlement (资格) or of an actual speed-up. See [`doc/规格/现行规格.md`](doc/规格/现行规格.md) for the full list.

## Commands

```text
/fast
/fast on
/fast off
/fast status
```

- `/fast`: toggles the switch.
- `/fast on|off`: sets the switch explicitly, suitable for scripts and repeatable verification.
- `/fast status`: shows the switch, the current model, and whether local injection conditions are met.

With `--no-session`, or in a temporary process that has not produced a persistent session file (会话文件), the switch only applies to that process; in a normal interactive session the previous state is restored only after a session file exists.

## Composition with other extensions

- `pi-dusage`: merges an immediate quota (配额) refresh when Fast becomes active for the current Codex model.
- `pi-dstatus`: the standalone `fast` component shows `FAST` or `FAST · inactive`; it is hidden when Fast is off.

The three extensions are connected only through the versioned Pi event protocol; none of them reads another's private configuration.

## Installation

### Local development

```bash
git clone https://github.com/ssdiwu/pi-dfast.git
cd pi-dfast
npm install
pi --no-extensions -e .
```

You can also add this repository's absolute path to the `packages` list in `~/.pi/agent/settings.json` and then run `/reload`.

### npm

```bash
pi install npm:@diwu507/pi-dfast
```

## Development

```bash
npm install
npm run check          # typecheck + vitest run
```

Load the checkout directly in Pi:

```bash
pi --no-extensions -e . --no-session -p "/fast status"
```

## Verification

```bash
npm run check
pi --no-extensions -e . --no-session -p "/fast status"
```

Real request verification should use a supported `openai-codex` model and confirm: the payload is unchanged when off, only `service_tier: "priority"` is added when on, and unsupported models show inactive without injection. The `before_provider_request` behavior test covers the injection decision; it does not replace a real request.

## Contributing

- Read [`AGENTS.md`](AGENTS.md) first, then [`doc/README.md`](doc/README.md) and the current mechanism text in [`doc/规格/现行规格.md`](doc/规格/现行规格.md).
- Behavior changes update the specification document first, then the code, then both READMEs (`README.md` in English and `README-zh.md` in Chinese) — the two versions must stay semantically in sync.
- Public protocol changes (the `pi-dfast/updated` snapshot, native status behavior) must land with matching behavior tests.
- User-perceivable changes go to the changelog: daily Chinese entries are kept in [`CHANGELOG-zh.md`](CHANGELOG-zh.md) in this repository, and each released version mirrors the same user-perceivable facts into the English changelog in [`doc/references/CHANGELOG.md`](doc/references/CHANGELOG.md) (also referenced by `pi.changelogPath`). That file is the single English changelog body; do not create a second one. Both changelogs and both READMEs ship in the npm package.
- One commit does one thing and follows Conventional Commits (约定式提交). Do not commit, push, tag or publish without explicit authorization.

## Documentation

- [doc/README.md](doc/README.md): document entry point.
- [doc/规格/现行规格.md](doc/规格/现行规格.md): the only body of truth for the current mechanism and boundaries.
- [doc/references/CHANGELOG.md](doc/references/CHANGELOG.md): version history (single English changelog).
- [CHANGELOG-zh.md](CHANGELOG-zh.md): daily Chinese changelog, also shipped in the npm package.
