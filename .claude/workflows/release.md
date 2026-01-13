---
name: release
description: Release preparation and deployment workflow
phases: [prepare, validate, release, announce]
checkpoints: [validate, release]
auto_merge: false
---

# Release Workflow

## Overview

End-to-end workflow for preparing and executing releases.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ PREPARE  │───▶│ VALIDATE │───▶│ RELEASE  │───▶│ ANNOUNCE │
│          │    │          │    │          │    │          │
│ Version  │    │ Test     │    │ Deploy   │    │ Notify   │
│ Changelog│    │ Approve  │    │ Tag      │    │ Document │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │
                     ▼               ▼
              [CHECKPOINT]     [CHECKPOINT]
              Ready?           Deployed?
```

## Phase 1: PREPARE

### Inputs
- Current main branch
- Previous release tag
- Commits since last release

### Actions

#### 1. Determine Version
```bash
# Get commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Determine version bump:
# - MAJOR: Breaking changes (feat!:, BREAKING CHANGE:)
# - MINOR: New features (feat:)
# - PATCH: Bug fixes (fix:)
```

Semver calculation:
| Commit Type | Version Bump |
|-------------|--------------|
| `feat!:` or `BREAKING CHANGE` | Major (1.0.0 → 2.0.0) |
| `feat:` | Minor (1.0.0 → 1.1.0) |
| `fix:` | Patch (1.0.0 → 1.0.1) |

#### 2. Generate Changelog
```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Added
- feat: New feature 1 (#123)
- feat: New feature 2 (#124)

### Fixed
- fix: Bug fix 1 (#125)
- fix: Bug fix 2 (#126)

### Changed
- refactor: Improvement 1 (#127)

### Security
- security: Fix vulnerability (#128)
```

#### 3. Update Version Files
```bash
# package.json
npm version [major|minor|patch] --no-git-tag-version

# Other version files
sed -i 's/VERSION = .*/VERSION = "X.Y.Z"/' setup.py
```

### Outputs
- Updated version in package files
- Generated CHANGELOG.md entry
- Release branch created

---

## Phase 2: VALIDATE

### Inputs
- Release branch
- Changelog

### Actions

#### 1. Full Test Suite
```bash
npm test -- --coverage --ci
npm run test:e2e
npm run test:integration
```

#### 2. Build Verification
```bash
npm run build
npm run lint
npm run typecheck
```

#### 3. Documentation Check
- [ ] README updated
- [ ] API docs current
- [ ] Migration guide (if breaking)
- [ ] CHANGELOG complete

#### 4. Security Scan
```bash
npm audit
```

### Checkpoint: Release Approval
```
⏸️ CHECKPOINT: Release Validation

Version: 2.3.0
Type: Minor release

Tests: ✅ 234/234 passed
Build: ✅ Success
Coverage: 89%
Security: ✅ No vulnerabilities

Changelog:
- 5 new features
- 8 bug fixes
- 2 breaking changes → NONE

[A]pprove release  [E]dit changelog  [R]eject
```

---

## Phase 3: RELEASE

### Inputs
- Validated release branch
- Approved changelog

### Actions

#### 1. Merge to Main
```bash
git checkout main
git merge release/vX.Y.Z
```

#### 2. Create Tag
```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z

Highlights:
- Feature 1
- Feature 2

Full changelog: CHANGELOG.md"
```

#### 3. Push
```bash
git push origin main
git push origin vX.Y.Z
```

#### 4. Create GitHub Release
```bash
gh release create vX.Y.Z \
  --title "Release vX.Y.Z" \
  --notes-file RELEASE_NOTES.md
```

#### 5. Publish (if package)
```bash
npm publish  # npm
pip install twine && twine upload dist/*  # PyPI
cargo publish  # crates.io
```

### Checkpoint: Deployment Verification
```
⏸️ CHECKPOINT: Deployment Complete

Tag: vX.Y.Z ✅
GitHub Release: ✅
npm Publish: ✅
Deployment: ✅ (production)

Health Check:
- API: ✅ responding
- DB: ✅ connected
- CDN: ✅ cached

[C]onfirm success  [R]ollback
```

---

## Phase 4: ANNOUNCE

### Inputs
- Successful deployment
- Changelog

### Actions

#### 1. Update Documentation Site
```bash
# If using docs versioning
npm run docs:version X.Y.Z
npm run docs:deploy
```

#### 2. Create Announcement
```markdown
# 🚀 Release vX.Y.Z

We're excited to announce the release of vX.Y.Z!

## Highlights
- **Feature 1**: Description
- **Feature 2**: Description

## Breaking Changes
[None | List them]

## Upgrade Guide
```
npm install package@X.Y.Z
```

## Full Changelog
[Link to CHANGELOG.md]

## Thanks
Thanks to all contributors!
```

#### 3. Post to Channels
- [ ] GitHub Discussions
- [ ] Twitter/Social
- [ ] Discord/Slack
- [ ] Mailing list

---

## Completion

### Release Checklist
- [ ] Version bumped
- [ ] Changelog updated
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Tag created
- [ ] GitHub release published
- [ ] Package published (if applicable)
- [ ] Deployment verified
- [ ] Announcement posted

### Artifacts
- Git tag: `vX.Y.Z`
- GitHub Release
- Published package
- Updated CHANGELOG.md

### Rollback Plan
If issues discovered post-release:
```bash
# Revert to previous version
git revert HEAD
git tag -d vX.Y.Z
git push origin :vX.Y.Z
npm unpublish package@X.Y.Z  # Within 72 hours
```
