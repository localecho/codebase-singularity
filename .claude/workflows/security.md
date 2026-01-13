---
name: security
description: Security audit and vulnerability remediation workflow
phases: [scan, analyze, remediate, verify]
checkpoints: [analyze, verify]
auto_merge: false
priority: critical
---

# Security Audit Workflow

## Overview

Comprehensive security workflow for vulnerability detection and remediation.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   SCAN   │───▶│ ANALYZE  │───▶│REMEDIATE │───▶│  VERIFY  │
│          │    │          │    │          │    │          │
│ Detect   │    │ Triage   │    │ Fix      │    │ Rescan   │
│ Vulns    │    │ Priority │    │ Harden   │    │ Report   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                               │
                     ▼                               ▼
              [CHECKPOINT]                    [CHECKPOINT]
              Review findings                 Confirm fixed
```

## Phase 1: SCAN

### Inputs
- Codebase
- Dependencies
- Configuration files

### Automated Scans
```bash
# Dependency vulnerabilities
npm audit --json > security/npm-audit.json
pip-audit --format=json > security/pip-audit.json

# Static analysis
semgrep --config=auto --json > security/semgrep.json

# Secret detection
gitleaks detect --source . --report-format=json > security/secrets.json

# Configuration audit
trivy config . --format=json > security/config.json
```

### OWASP Top 10 Checks
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Authentication Failures
- [ ] A08: Data Integrity Failures
- [ ] A09: Logging Failures
- [ ] A10: SSRF

### Outputs
- Vulnerability list with severity
- Affected files and lines
- CVSS scores where applicable

---

## Phase 2: ANALYZE

### Inputs
- Scan results
- Business context

### Actions
1. Deduplicate findings
2. Assess actual risk (exploitability)
3. Prioritize by severity + exposure
4. Create remediation plan

### Severity Classification
| Level | CVSS | Action |
|-------|------|--------|
| Critical | 9.0-10.0 | Immediate fix required |
| High | 7.0-8.9 | Fix within 24 hours |
| Medium | 4.0-6.9 | Fix within 1 week |
| Low | 0.1-3.9 | Fix in next release |
| Info | N/A | Document, no action |

### Checkpoint: Findings Review
```
⏸️ CHECKPOINT: Security Findings

Vulnerabilities Found: 12
- Critical: 1 (SQL injection in auth.ts)
- High: 3
- Medium: 5
- Low: 3

Exposed Secrets: 2
- API key in config.js (revoke!)
- Test credential in .env.example

[A]cknowledge and proceed  [E]scalate to human
```

---

## Phase 3: REMEDIATE

### Inputs
- Prioritized vulnerability list
- Remediation plan

### Actions (in priority order)

#### Critical Vulnerabilities
```bash
# 1. Fix immediately
# 2. Consider rollback if needed
# 3. Notify stakeholders
```

#### Dependency Updates
```bash
# Update vulnerable packages
npm audit fix
npm update [package]@[safe-version]
```

#### Code Fixes
Apply fixes from security patterns:
- SQL: Parameterized queries
- XSS: Output encoding
- Auth: Proper session handling
- Crypto: Strong algorithms
- Secrets: Environment variables

### Commit Format
```
security(scope): fix [vulnerability type]

CVE: CVE-XXXX-XXXXX (if applicable)
Severity: Critical
CVSS: 9.8

Fix: [description of fix]
Impact: [who was affected]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Secret Rotation
If secrets exposed:
1. Revoke immediately
2. Generate new credentials
3. Update configuration
4. Verify old creds no longer work

---

## Phase 4: VERIFY

### Inputs
- All remediation commits
- Original scan results

### Actions
1. Re-run all security scans
2. Verify each vulnerability fixed
3. Check for new issues introduced
4. Generate compliance report

### Verification Scans
```bash
# Re-run all scanners
npm audit
semgrep --config=auto
gitleaks detect

# Compare results
diff security/pre-fix.json security/post-fix.json
```

### Checkpoint: Verification
```
⏸️ CHECKPOINT: Security Verification

Previous: 12 vulnerabilities
Current: 0 vulnerabilities

All Critical: ✅ Fixed
All High: ✅ Fixed
All Medium: ✅ Fixed
Secrets: ✅ Rotated

New Issues: None

[C]omplete audit  [R]eview again
```

---

## Completion

### Security Report
```markdown
# Security Audit Report

Date: [date]
Scope: [files/components]
Duration: [time]

## Summary
- Vulnerabilities Found: 12
- Vulnerabilities Fixed: 12
- Secrets Rotated: 2

## Findings

### Fixed
| ID | Severity | Type | Location | Fix |
|----|----------|------|----------|-----|
| 1 | Critical | SQLi | auth.ts:45 | Parameterized query |
...

### Accepted Risk
[Any items not fixed with justification]

## Recommendations
1. Enable automated scanning in CI
2. Schedule quarterly audits
3. Implement CSP headers

## Compliance
- [ ] OWASP Top 10 addressed
- [ ] No critical/high vulnerabilities
- [ ] Secrets properly managed
```

### Artifacts
- `security/audit-report.md`
- `security/scan-results/`
- Resolution records in `app_reviews/`
