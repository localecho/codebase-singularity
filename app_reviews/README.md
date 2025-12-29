# App Reviews - Feedback Loop Storage

This directory stores all feedback loop artifacts: bug reports, resolutions, and review logs.

## Directory Structure

```
app_reviews/
├── README.md           # This file
├── bugs/               # Bug reproduction reports
│   └── BUG-001.md     # Individual bug reports
└── resolutions/        # Resolution logs
    └── RES-001.md     # Individual resolution records
```

## Bug Report Template

File: `bugs/BUG-XXX.md`

```markdown
# BUG-XXX: [Short Description]

## Metadata
- **Discovered**: [Date]
- **Severity**: Critical / High / Medium / Low
- **Status**: Open / In Progress / Resolved
- **Resolution**: [Link to RES-XXX if resolved]

## Reproduction Steps

1. Step one
2. Step two
3. Step three

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Environment

- OS: [os]
- Node: [version]
- Browser: [if applicable]

## Logs/Screenshots

[Relevant output]

## Root Cause Analysis

[Once identified]

## Fix Applied

[Once fixed]
```

## Resolution Template

File: `resolutions/RES-XXX.md`

```markdown
# RES-XXX: [What was resolved]

## Metadata
- **Date**: [Date]
- **Related Bug**: [BUG-XXX or N/A]
- **Files Modified**: [list]
- **Tests Added**: [list]

## Problem

[What was wrong]

## Solution

[How it was fixed]

## Changes Made

| File | Change |
|------|--------|
| path/file.ts | Description |

## Verification

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification done
- [ ] No regressions

## Lessons Learned

[What to do differently next time]
```

## Naming Conventions

- Bugs: `BUG-XXX` (sequential)
- Resolutions: `RES-XXX` (sequential)
- Reviews: `REV-YYYYMMDD-feature.md`

## Integration with Workflows

### During code_review
- Failed checks create entries in `bugs/`
- Fixes create entries in `resolutions/`

### During test_backend / test_frontend
- Test failures create bug reports
- Test fixes create resolutions

### During orchestration
- Each cycle logs summary in `resolutions/`

## Maintenance

- Archive resolved bugs older than 90 days
- Keep resolutions for reference
- Review patterns monthly for systemic issues

---
*Feedback loop storage for continuous improvement*
