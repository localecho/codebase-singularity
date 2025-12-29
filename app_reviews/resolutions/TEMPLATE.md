# Resolution Template

> Copy this template when documenting resolutions: `app_reviews/resolutions/RES-YYYYMMDD-NNNN.md`

## Resolution Metadata

| Field | Value |
|-------|-------|
| **Resolution ID** | RES-YYYYMMDD-NNNN |
| **Bug ID** | BUG-YYYYMMDD-NNNN (link to original bug) |
| **Type** | Bug Fix / Enhancement / Refactor / Security Patch |
| **Status** | Draft / Implemented / Verified / Deployed |
| **Resolved** | YYYY-MM-DD HH:MM |
| **Resolved By** | Agent / Human |
| **Review Status** | Pending / Approved / Needs Changes |

---

## Summary

[One-line description of what was fixed/changed]

---

## Root Cause

### Identified Cause
[What was actually causing the bug]

### Why It Happened
[Explanation of how the bug was introduced]

### Contributing Factors
- [ ] Factor 1
- [ ] Factor 2

---

## Solution

### Approach Taken
[Description of the fix approach]

### Alternative Approaches Considered
| Approach | Pros | Cons | Why Not Chosen |
|----------|------|------|----------------|
| Alt 1 | | | |
| Alt 2 | | | |

---

## Changes Made

### Files Modified

#### `path/to/file1.ts`
**Before**:
```typescript
// Old code
```

**After**:
```typescript
// New code
```

**Reason**: [Why this change was made]

#### `path/to/file2.ts`
**Before**:
```typescript
// Old code
```

**After**:
```typescript
// New code
```

**Reason**: [Why this change was made]

---

## Testing

### Tests Added/Modified

| Test File | Test Name | Type | Status |
|-----------|-----------|------|--------|
| test1.spec.ts | should handle edge case | Unit | ✅ Pass |
| test2.spec.ts | should prevent regression | Integration | ✅ Pass |

### Manual Testing Performed
- [ ] Tested locally
- [ ] Tested in staging
- [ ] Edge cases verified
- [ ] Regression tested

### Test Output
```
[Paste relevant test output]
```

---

## Verification Checklist

### Code Quality
- [ ] Follows project style guidelines
- [ ] No new linting errors
- [ ] No TODO comments left
- [ ] Documentation updated

### Security
- [ ] No new vulnerabilities introduced
- [ ] Input validation added (if applicable)
- [ ] No sensitive data exposed

### Performance
- [ ] No performance regression
- [ ] Load tested (if applicable)

### Compatibility
- [ ] Backwards compatible
- [ ] Breaking changes documented (if any)

---

## Deployment

### Deployment Steps
1.
2.
3.

### Rollback Procedure
1.
2.
3.

### Monitoring
- [ ] Logs checked post-deployment
- [ ] Metrics verified
- [ ] No new errors in monitoring

---

## Lessons Learned

### What Went Well
-

### What Could Be Improved
-

### Preventive Measures
[How to prevent similar bugs in the future]
- [ ] Action item 1
- [ ] Action item 2

---

## Related

- Original Bug: BUG-YYYYMMDD-NNNN
- Related PRs:
- Related Issues:
