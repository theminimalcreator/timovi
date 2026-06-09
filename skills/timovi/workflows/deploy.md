# Workflow: Deploy

Pipeline for deploying features to production.

## Roles involved

| Phase | Roles | Description |
|------|--------|-------------|
| Prep | DevOps | Prepare build, configure environment |
| Approval | Tech Lead | Approve deploy |
| Deploy | DevOps | Execute deploy |
| Verify | QA, DevOps | Smoke test, monitoring |

## Prerequisites

- [ ] All feature PRs approved (Review complete)
- [ ] Database migrations reviewed by DBA
- [ ] Environment variables and secrets configured
- [ ] Rollback plan documented

## Flow

### 1. Prep (DevOps)

- Generate production build
- Run migrations in staging
- Validate health checks
- Generate feature changelog

### 2. Approval (Tech Lead)

- Review changelog
- Confirm all PRs have been approved
- Authorize deploy: ✅ Go / 🔴 Hold

### 3. Deploy (DevOps)

- Execute deploy (with rollback plan ready)
- Run migrations in production (if any)
- Monitor metrics (error rate, latency, CPU)

### 4. Verify (QA + DevOps)

- QA: smoke test main flows in production
- DevOps: check logs, alerts, metrics for 15 minutes
- If all OK: deploy complete ✅
- If anomaly: immediate rollback 🔴

## Artifacts

- Feature changelog
- Deploy log (timestamp, duration, status)
- Smoke test report
