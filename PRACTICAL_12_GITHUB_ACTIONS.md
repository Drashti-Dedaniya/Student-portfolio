# Practical 12: CI/CD with GitHub Actions

## What the workflow does

`.github/workflows/ci.yml` runs on every push and on pull requests targeting `main`. It installs the root React frontend and backend dependencies, builds the frontend, and runs a Node.js test for the asynchronous `task-created` notification. The test uses Node's built-in test runner; no test package is required.

## Run the checks locally

From the repository root:

```bash
npm install
npm run build
npm install --prefix task-manager-api
npm test --prefix task-manager-api
```

## Demonstrate a failed run, then a passing run

Use a demonstration branch so the intentionally failing test does not break `main`:

```bash
git switch -c practical-12-demo
```

In `task-manager-api/test/taskEvents.test.js`, temporarily change the expected title from `CI event test task` to `Wrong expected title`. Commit and push that change:

```bash
git add task-manager-api/test/taskEvents.test.js
git commit -m "practical 12: demonstrate failing CI test"
git push -u origin practical-12-demo
```

On GitHub, open **Actions**, select the `Task Manager CI` run for `practical-12-demo`, and wait for the red failed status. Capture that screenshot.

Restore the expected title to `CI event test task`, commit, and push again:

```bash
git add task-manager-api/test/taskEvents.test.js
git commit -m "practical 12: fix CI test"
git push
```

Capture the green passing run in **Actions**. The workflow triggers on all branches for this demonstration and also runs on every push to `main`.

## Screenshots to include

1. Workflow source in `.github/workflows/ci.yml`, showing triggers, dependency installation, build, and test steps.
2. Test source in `task-manager-api/test/taskEvents.test.js`.
3. The red GitHub Actions run for the deliberately wrong expected title.
4. The green GitHub Actions run after restoring the correct expected title.
5. (Optional) Local terminal output from `npm test --prefix task-manager-api` showing the passing test.
