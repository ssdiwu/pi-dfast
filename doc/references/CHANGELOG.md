# Changelog

This project follows the basic format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For tagged releases, use the version from the Git tag. The tagged release is maintained by the release owner in this English `doc/references/CHANGELOG.md` (the single English changelog body, referenced by `pi.changelogPath`); daily user-perceivable changes are recorded in the Chinese `CHANGELOG-zh.md` in this repository. Both files contain user-perceivable facts only and ship in the npm package.

For new releases, use headings in the format `## [x.y.z] - YYYY-MM-DD`. When an entry can be linked unambiguously to a GitHub issue, append `(#xx)`. Historical entries keep their original heading format.

## [Unreleased]

## [0.1.1] - 2026-11-25

### Changed

- Supports Pi 1.6.0.

## [0.1.0] - 2026-07-15

### Added

- Added the `/fast` command and per-session state tracking; it is off by default in each new session, and resuming the same session restores its own toggle.
- Inject `service_tier: "priority"` only into requests for explicitly supported `openai-codex` models.
- Added a versioned `pi-dfast/updated` state protocol for extensions such as `pi-dstatus` and `pi-dusage` to consume.
