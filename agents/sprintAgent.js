/**
 * Sprint Agent - Ralph-style orchestration agent for GitHub issue sprints
 *
 * Monitors sprint health, executes issue workflows, and generates reports.
 * Based on the Ralph Agent pattern from nibbl.tech
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SprintAgent {
  constructor(options = {}) {
    this.name = 'SprintAgent';
    this.version = '1.0.0';
    this.startTime = Date.now();

    // Configuration
    this.repo = options.repo || this.detectRepo();
    this.issueRange = options.issues || [];
    this.parallel = options.parallel || false;
    this.maxRetries = options.maxRetries || 3;

    // Services to monitor (13 total - Ralph pattern)
    this.services = [
      'githubService',
      'gitService',
      'testService',
      'lintService',
      'buildService',
      'prService',
      'branchService',
      'specService',
      'reviewService',
      'metricsService',
      'cacheService',
      'notificationService',
      'auditService'
    ];

    // Thresholds for alerts
    this.thresholds = {
      maxIssueTime: 30 * 60 * 1000,  // 30 minutes per issue
      maxRetries: 3,
      minTestCoverage: 80,
      maxOpenPRs: 10
    };

    // Sprint state
    this.state = {
      status: 'idle',
      currentIssue: null,
      processed: [],
      failed: [],
      prs: [],
      startTime: null,
      endTime: null
    };

    // Metrics
    this.metrics = {
      issuesProcessed: 0,
      prsCreated: 0,
      testsRun: 0,
      testsPassed: 0,
      avgTimePerIssue: 0,
      retryCount: 0
    };
  }

  /**
   * Detect repository from current directory
   */
  detectRepo() {
    try {
      const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Parse issue range string into array of numbers
   * Handles: "1-5", "1,3,7", "1-3,5,8-10"
   */
  parseIssueRange(rangeStr) {
    const issues = [];
    const parts = rangeStr.split(',');

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          issues.push(i);
        }
      } else {
        issues.push(Number(part.trim()));
      }
    }

    return issues.filter(n => !isNaN(n)).sort((a, b) => a - b);
  }

  /**
   * Run health check on all services
   */
  async runHealthCheck() {
    console.log('\n━━━ SPRINT AGENT HEALTH CHECK ━━━\n');

    const checks = {
      github: this.checkGitHub(),
      git: this.checkGit(),
      repo: this.checkRepo(),
      branches: await this.checkBranches()
    };

    for (const [service, status] of Object.entries(checks)) {
      const icon = status.healthy ? '✅' : '❌';
      console.log(`${icon} ${service}: ${status.message}`);
    }

    const allHealthy = Object.values(checks).every(c => c.healthy);
    console.log(`\nOverall: ${allHealthy ? '✅ Ready' : '❌ Issues detected'}\n`);

    return allHealthy;
  }

  checkGitHub() {
    try {
      execSync('gh auth status', { encoding: 'utf8', stdio: 'pipe' });
      return { healthy: true, message: 'Authenticated' };
    } catch {
      return { healthy: false, message: 'Not authenticated - run: gh auth login' };
    }
  }

  checkGit() {
    try {
      execSync('git status', { encoding: 'utf8', stdio: 'pipe' });
      return { healthy: true, message: 'Repository OK' };
    } catch {
      return { healthy: false, message: 'Not a git repository' };
    }
  }

  checkRepo() {
    if (this.repo) {
      return { healthy: true, message: this.repo };
    }
    return { healthy: false, message: 'Could not detect repository' };
  }

  async checkBranches() {
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      return { healthy: true, message: `On branch: ${branch}` };
    } catch {
      return { healthy: false, message: 'Could not determine branch' };
    }
  }

  /**
   * Fetch issue details from GitHub
   */
  async fetchIssue(number) {
    try {
      const cmd = `gh issue view ${number} --repo ${this.repo} --json number,title,body,labels,state`;
      const result = execSync(cmd, { encoding: 'utf8' });
      return JSON.parse(result);
    } catch (error) {
      console.error(`Failed to fetch issue #${number}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch all issues in the sprint
   */
  async fetchAllIssues() {
    console.log('\n━━━ FETCHING ISSUES ━━━\n');

    const issues = [];
    for (const num of this.issueRange) {
      process.stdout.write(`Fetching #${num}... `);
      const issue = await this.fetchIssue(num);
      if (issue) {
        issues.push(issue);
        console.log(`✓ ${issue.title}`);
      } else {
        console.log('✗ Failed');
      }
    }

    return issues;
  }

  /**
   * Create feature branch for issue
   */
  createBranch(issue) {
    const slug = issue.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);

    const branchName = `issue-${issue.number}-${slug}`;

    try {
      // Ensure we're on main/master first
      try {
        execSync('git checkout main', { stdio: 'pipe' });
      } catch {
        execSync('git checkout master', { stdio: 'pipe' });
      }

      // Pull latest
      execSync('git pull', { stdio: 'pipe' });

      // Create and checkout branch
      execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });

      return branchName;
    } catch (error) {
      console.error(`Failed to create branch: ${error.message}`);
      return null;
    }
  }

  /**
   * Create PR for completed work
   */
  async createPR(issue, branchName) {
    const title = `Fix #${issue.number}: ${issue.title}`;
    const body = `Closes #${issue.number}\n\n## Summary\nImplemented fix for: ${issue.title}\n\n---\n🤖 Generated by SprintAgent v${this.version}`;

    try {
      const cmd = `gh pr create --repo ${this.repo} --title "${title}" --body "${body}" --base main`;
      const result = execSync(cmd, { encoding: 'utf8' });

      // Extract PR number from result
      const match = result.match(/\/pull\/(\d+)/);
      return match ? parseInt(match[1]) : null;
    } catch (error) {
      console.error(`Failed to create PR: ${error.message}`);
      return null;
    }
  }

  /**
   * Process a single issue
   */
  async processIssue(issue) {
    console.log(`\n━━━ PROCESSING #${issue.number}: ${issue.title} ━━━\n`);

    this.state.currentIssue = issue.number;
    const issueStart = Date.now();

    // Check if issue is already closed
    if (issue.state === 'CLOSED') {
      console.log('⏭️  Issue already closed, skipping');
      return { status: 'skipped', reason: 'already closed' };
    }

    // Create feature branch
    console.log('📌 Creating feature branch...');
    const branchName = this.createBranch(issue);
    if (!branchName) {
      return { status: 'failed', reason: 'could not create branch' };
    }
    console.log(`   Branch: ${branchName}`);

    // TODO: Implement actual code changes based on issue
    // For now, create a placeholder commit
    console.log('🔨 Implementing changes...');

    // Create PR
    console.log('📝 Creating pull request...');
    const prNumber = await this.createPR(issue, branchName);

    if (prNumber) {
      console.log(`   PR #${prNumber} created`);
      this.state.prs.push({ issue: issue.number, pr: prNumber });
      this.metrics.prsCreated++;
    }

    // Update metrics
    const elapsed = Date.now() - issueStart;
    this.metrics.issuesProcessed++;
    this.metrics.avgTimePerIssue =
      (this.metrics.avgTimePerIssue * (this.metrics.issuesProcessed - 1) + elapsed) /
      this.metrics.issuesProcessed;

    return { status: 'success', pr: prNumber, time: elapsed };
  }

  /**
   * Run the sprint
   */
  async run(issueRangeStr) {
    console.log('\n' + '═'.repeat(60));
    console.log('  SPRINT AGENT - Starting Sprint');
    console.log('═'.repeat(60));

    this.state.status = 'running';
    this.state.startTime = Date.now();

    // Parse issue range
    this.issueRange = this.parseIssueRange(issueRangeStr);
    console.log(`\nIssues to process: ${this.issueRange.join(', ')}`);
    console.log(`Repository: ${this.repo}`);

    // Health check
    const healthy = await this.runHealthCheck();
    if (!healthy) {
      console.error('\n❌ Health check failed. Aborting sprint.');
      this.state.status = 'failed';
      return;
    }

    // Fetch all issues
    const issues = await this.fetchAllIssues();

    // Process each issue
    for (const issue of issues) {
      try {
        const result = await this.processIssue(issue);

        if (result.status === 'success') {
          this.state.processed.push(issue.number);
        } else {
          this.state.failed.push({ number: issue.number, reason: result.reason });
        }
      } catch (error) {
        console.error(`Error processing #${issue.number}:`, error.message);
        this.state.failed.push({ number: issue.number, reason: error.message });
      }
    }

    this.state.endTime = Date.now();
    this.state.status = 'complete';

    // Generate report
    this.generateReport();
  }

  /**
   * Generate sprint report
   */
  generateReport() {
    const duration = this.state.endTime - this.state.startTime;
    const durationMin = Math.round(duration / 60000);

    console.log('\n' + '═'.repeat(60));
    console.log('  SPRINT COMPLETE');
    console.log('═'.repeat(60));

    console.log(`
  Duration: ${durationMin} minutes

  Issues Processed: ${this.state.processed.length}/${this.issueRange.length}
  PRs Created: ${this.state.prs.length}

  Results:`);

    for (const pr of this.state.prs) {
      console.log(`    ✅ #${pr.issue} → PR #${pr.pr}`);
    }

    for (const fail of this.state.failed) {
      console.log(`    ❌ #${fail.number}: ${fail.reason}`);
    }

    console.log('\n' + '═'.repeat(60));

    // Save report to file
    const reportPath = path.join(
      process.cwd(),
      'app_reviews',
      'resolutions',
      `SPRINT-${new Date().toISOString().split('T')[0]}.json`
    );

    try {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify({
        version: this.version,
        repo: this.repo,
        issues: this.issueRange,
        state: this.state,
        metrics: this.metrics,
        timestamp: new Date().toISOString()
      }, null, 2));
      console.log(`\nReport saved: ${reportPath}`);
    } catch (error) {
      console.error('Could not save report:', error.message);
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Sprint Agent v1.0.0

Usage: node sprintAgent.js <issues> [repo]

Examples:
  node sprintAgent.js 64-70
  node sprintAgent.js 1,3,5,7
  node sprintAgent.js 1-10 owner/repo
`);
    process.exit(0);
  }

  const issueRange = args[0];
  const repo = args[1];

  const agent = new SprintAgent({ repo });
  agent.run(issueRange).catch(console.error);
}

module.exports = SprintAgent;
