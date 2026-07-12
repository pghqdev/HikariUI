# AGENTS.md

Instructions for agents working on the **hikariui** repo itself. (Not to be
confused with the consumer-facing rules Hikari *ships* — those live in the
canonical `hikari-rules.md` / `llms.txt`, a separate distributable.)

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (via `gh`). External PRs are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
