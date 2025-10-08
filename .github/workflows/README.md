# GitHub Actions CI/CD Workflows

## 📋 Overview

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Minimal Full-Stack App.

## 🔄 Workflows

### 1. `ci.yml` - Continuous Integration

**Purpose**: Automatically test code quality and functionality on every push/PR.

**Triggers**:

- Push to `main`, `develop`, or `feature/hanoi2025` branches
- Pull requests targeting `develop` or `main`
- Manual trigger via Actions tab

**Jobs** (runs in parallel where possible):

1. **lint-backend** - ESLint validation for backend code
2. **lint-frontend** - ESLint validation for frontend code
3. **build-frontend** - Vite production build test
4. **test-backend** - Smoke tests with real MySQL database
5. **docker-build-backend** - Verify backend Dockerfile builds
6. **docker-build-frontend** - Verify frontend Dockerfile builds
7. **docker-compose-test** - Full integration test with all services
8. **ci-summary** - Summary report of all results

**Duration**: ~5-8 minutes

**Status**: [![CI Status](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/ci.yml)

### 2. `cd.yml` - Continuous Deployment

**Purpose**: Build and publish Docker images to Docker Hub after successful CI.

**Triggers**:

- Push to `main` or `develop` branches (after CI passes)
- Git version tags (`v1.0.0`, `v2.1.3`, etc.)
- Manual trigger via Actions tab

**Jobs**:

1. **deploy-backend** - Build and push backend image to Docker Hub
2. **deploy-frontend** - Build and push frontend image to Docker Hub
3. **create-release** - Create GitHub release (on version tags only)

**Image Tags**:

- `latest` - Main branch (production)
- `develop` - Develop branch (staging)
- `v1.0.0` - Semantic version from git tags
- `1.0` - Major.minor version
- `main-abc1234` - Branch + commit SHA

**Duration**: ~3-5 minutes

**Status**: [![CD Status](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/cd.yml/badge.svg)](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/cd.yml)

## 🎓 Teaching Points

### What is CI/CD?

**Continuous Integration (CI)**:

- Automatically tests code on every change
- Catches bugs early before they reach production
- Ensures code meets quality standards (linting, tests)
- Runs in isolated environment (no "works on my machine" issues)

**Continuous Deployment (CD)**:

- Automatically deploys passing code
- Reduces manual deployment errors
- Faster release cycles
- Version tracking with git tags

### Why GitHub Actions?

- **Free**: 2,000 minutes/month for public repos, 3,000 for private (with team plan)
- **Integrated**: Built into GitHub, no external service needed
- **Powerful**: Matrix builds, caching, artifacts, environments
- **Community**: Thousands of pre-built actions in marketplace

### Workflow Syntax

```yaml
name: Workflow Name # Displayed in Actions tab
on: [push, pull_request] # When to trigger
jobs: # Units of work
  job-name: # Job identifier
    runs-on: ubuntu-latest # OS (ubuntu, windows, macos)
    steps: # Sequential actions
      - uses: actions/checkout@v4 # Use community action
      - run: npm install # Run shell command
```

## 🚀 Setup Instructions

### Prerequisites

1. GitHub repository with admin access
2. Docker Hub account (for CD workflow)

### Configure CI (No Setup Required)

CI workflow works out of the box! Just push code and it runs automatically.

### Configure CD (Docker Hub Deployment)

#### Step 1: Create Docker Hub Account

1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up / Sign in
3. Create repositories:
   - `minimal-app-backend`
   - `minimal-app-frontend`

#### Step 2: Generate Access Token

1. Go to [Account Settings > Security](https://hub.docker.com/settings/security)
2. Click "New Access Token"
3. Name: `github-actions`
4. Permissions: Read, Write, Delete
5. Copy the token (you won't see it again!)

#### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add two secrets:

**DOCKERHUB_USERNAME**:

```
your-dockerhub-username
```

**DOCKERHUB_TOKEN**:

```
dckr_pat_xxxxxxxxxxxxxxxxxxxxx
```

#### Step 4: Update Workflow (Optional)

If your Docker Hub username is different from what's expected:

Edit `.github/workflows/cd.yml`:

```yaml
env:
  DOCKER_USERNAME: your-actual-username # Change this
```

#### Step 5: Test Deployment

Push to `develop` branch:

```bash
git checkout develop
git add .
git commit -m "Test CD workflow"
git push origin develop
```

Check Actions tab to see deployment in progress!

### Create a Release

To publish a versioned release:

```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

This will:

1. Build and push images with tag `v1.0.0`
2. Create GitHub Release with changelog
3. Tag images as `latest` (if main branch)

## 📊 Viewing Results

### In GitHub UI

1. Go to repository on GitHub
2. Click **Actions** tab
3. See all workflow runs
4. Click a run to see:
   - Job status (✅ success, ❌ failed, 🟡 in progress)
   - Detailed logs for each step
   - Artifacts (build outputs)
   - Run duration

### Status Badges

Add to `README.md` to show build status:

```markdown
[![CI](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/ci.yml)
[![CD](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/cd.yml/badge.svg)](https://github.com/ebpro/fullstack-minimal-app/actions/workflows/cd.yml)
```

### Docker Hub

View published images:

- [hub.docker.com/r/YOUR_USERNAME/minimal-app-backend](https://hub.docker.com)
- [hub.docker.com/r/YOUR_USERNAME/minimal-app-frontend](https://hub.docker.com)

## 🐛 Troubleshooting

### CI Failing on Lint Errors

**Problem**: `npm run lint` fails with ESLint errors

**Solution**:

```bash
# Fix linting issues locally first
npm run lint --workspace=backend
npm run lint --workspace=frontend

# Auto-fix where possible
npx eslint --fix backend/src
npx eslint --fix frontend/src
```

### CI Failing on Tests

**Problem**: Backend smoke tests fail

**Solution**:

- Check `db/init.sql` exists and is valid SQL
- Ensure tests work locally: `npm test --workspace=backend`
- Check environment variables in workflow match your `.env`

### CD Failing - Authentication Error

**Problem**: "unauthorized: authentication required"

**Solution**:

- Verify Docker Hub username is correct
- Regenerate access token (old one may be expired)
- Double-check GitHub Secrets are set correctly
- Ensure token has Write permissions

### CD Failing - Repository Not Found

**Problem**: "repository does not exist or may require 'docker login'"

**Solution**:

- Create repositories on Docker Hub first:
  - `minimal-app-backend`
  - `minimal-app-frontend`
- Repository names must match workflow configuration

### Workflow Not Triggering

**Problem**: No workflow runs appear after push

**Solution**:

- Check branch name matches trigger configuration
- Ensure `.github/workflows/` directory is in repository root
- Verify YAML syntax is valid (use YAML linter)
- Check Actions tab for error messages

## 💡 Best Practices for Students

### 1. Always Run Tests Locally First

```bash
# Before pushing, run:
npm run lint
npm test
npm run build
```

### 2. Use Feature Branches

```bash
# Create feature branch
git checkout -b feature/add-search

# Work on feature, commit often
git add .
git commit -m "Add search functionality"

# Push and create PR
git push origin feature/add-search
```

CI runs on the PR, catching issues before merge!

### 3. Read the Logs

When CI fails:

1. Click the failed job
2. Expand the failed step
3. Read error message carefully
4. Fix locally, commit, push again

### 4. Use Draft PRs for WIP

Create draft PR while working:

- CI still runs and tests your code
- Team sees your progress
- Mark "Ready for review" when done

### 5. Keep CI Fast

Slow CI = frustrated developers

- Cache dependencies (already configured)
- Run tests in parallel (already configured)
- Only run necessary checks

## 🎯 Extension Exercises for Students

### Beginner Level

1. **Add status badges to main README**

   - Copy badge markdown
   - Add to top of `README.md`
   - Commit and push

2. **Add a new lint rule**

   - Edit `.eslintrc` in backend or frontend
   - Add a rule (e.g., `"no-console": "warn"`)
   - Push and see CI catch console.log statements

3. **Break the build intentionally**
   - Add a syntax error to a file
   - Push and watch CI fail
   - Fix and push again

### Intermediate Level

4. **Add code coverage reporting**

   - Install `nyc` or `c8`
   - Add coverage script to `package.json`
   - Modify CI workflow to run coverage
   - Upload results to Codecov

5. **Add security scanning**

   - Add `npm audit` step to CI
   - Configure Dependabot for automated security updates
   - Add Snyk integration

6. **Add Slack notifications**
   - Create Slack webhook
   - Add notification step to workflows
   - Send message on success/failure

### Advanced Level

7. **Deploy to cloud provider**

   - AWS Elastic Beanstalk
   - Azure App Service
   - Google Cloud Run
   - Heroku

8. **Add staging environment**

   - Deploy `develop` branch to staging
   - Deploy `main` branch to production
   - Use GitHub Environments with approvals

9. **Implement GitFlow**
   - Protected branches (main, develop)
   - Required status checks before merge
   - Automated version bumping

## 📚 Resources

### GitHub Actions Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Marketplace](https://github.com/marketplace?type=actions)

### Docker Hub

- [Docker Hub Docs](https://docs.docker.com/docker-hub/)
- [Automated Builds](https://docs.docker.com/docker-hub/builds/)

### CI/CD Best Practices

- [Martin Fowler - Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
- [12 Factor App](https://12factor.net/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 🎓 Teaching Integration

### Week 1: Introduce Concepts

- What is CI/CD and why it matters
- Show failing build vs. passing build
- Demonstrate fixing a lint error

### Week 2: Hands-On

- Students create feature branches
- Make intentional mistakes to see CI fail
- Fix issues and see green checkmarks

### Week 3: Advanced

- Add new workflow jobs (e.g., coverage)
- Configure Docker Hub deployment
- Create first release with tags

### Assessment Ideas

- "Fix the failing CI" challenge
- "Add a new test and see CI run it"
- "Deploy your feature to staging"

---

**Questions?** Check the [GitHub Actions documentation](https://docs.github.com/en/actions) or ask your instructor!
