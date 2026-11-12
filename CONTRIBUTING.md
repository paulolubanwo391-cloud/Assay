# Contributing to Assay

Assay is a research tool. The most valuable contribution is showing that a number is wrong. The second most valuable is a new measurement that can be rebuilt by anyone from public data.

## Contents

- [Ground rules](#ground-rules)
- [Set up](#set-up)
- [How the repository is laid out](#how-the-repository-is-laid-out)
- [Disputing a number](#disputing-a-number)
- [Adding a metric](#adding-a-metric)
- [Adding or changing a verdict](#adding-or-changing-a-verdict)
- [Changing the interface](#changing-the-interface)
- [Before you open a pull request](#before-you-open-a-pull-request)
- [Commit and review conventions](#commit-and-review-conventions)

## Ground rules

1. **No invented numbers.** Every figure shown on the site or written in `THESIS.md` must be computed by the pipeline from a file in `data/raw/`. If something cannot be measured from public data, say so in the "What we could not measure" section instead of estimating it silently.
2. **No keys.** Sources must be public and keyless, so that anyone can rebuild the work without an account.
3. **Rules before results.** A verdict threshold is set in `pipeline/config.ts` before the number it grades is looked at. Do not move a threshold to change a verdict. If a threshold is wrong, argue that in the pull request, separately from any result.
4. **Evidence against stays in.** Do not remove a finding because it cuts against the thesis.
5. **One model.** All arithmetic the site, the CLI and the thesis share lives in `src/lib/model.ts` as pure functions with tests.

## Set up

Requirements: Node 20 or newer, npm, git. No API keys, no wallet, no cloud account.

```bash
npm install
npm run rebuild:offline   # recompute from the committed raw data (no network)
npm test                  # unit tests for the model
npm run typecheck
npm run dev               # the site on http://localhost:3000
```

`npm run rebuild` also re-downloads the raw data. The first run reads about 125 epoch boundaries from archival RPC and takes several minutes; later runs reuse the cached epochs.

## How the repository is laid out

| Path | What it holds |
|---|---|
| `pipeline/config.ts` | Every setting: windows, wallets, HSP-029 parameters, verdict thresholds |
| `pipeline/fetch.ts` | Downloads raw inputs to `data/raw/`, writes `manifest.json` with hashes |
| `pipeline/compute.ts` | Turns raw inputs into `data/metrics.json` and `data/series.json` |
| `pipeline/validate.ts` | The publish gate: hashes, bounds, cross-checks |
| `pipeline/thesis.ts` | Writes `THESIS.md` from `data/metrics.json` |
| `pipeline/model-cli.ts` | The model from the command line |
| `src/lib/model.ts` | Pure functions: projection, simulation, validator economics, grading |
| `src/lib/types.ts` | The shape of `metrics.json` and `series.json` |
| `src/app/` | Pages (static export) |
| `src/components/` | Charts, 3D scenes, page sections |
| `tests/` | Vitest unit tests |
| `.github/workflows/` | CI, scheduled data refresh, deployment |

## Disputing a number

Open an issue with:

- the figure as shown, and where (page and label, or line in `THESIS.md`);
- the value you get, and the exact request or command that produces it;
- the date and time (UTC) you ran it.

The Verify page on the site is a good first step: it recomputes nine headline numbers in your browser. A reproducible discrepancy is treated as a bug and fixed in the pipeline, never by editing an output file.

## Adding a metric

1. If it needs a new source, add it in `pipeline/fetch.ts` through the `source()` helper so that it is hashed, listed in the manifest, and keeps its last good copy on failure.
2. Compute it in `pipeline/compute.ts`. Put reusable arithmetic in `src/lib/model.ts` with a unit test.
3. Add the field to `src/lib/types.ts`.
4. Add a plausibility bound and, where possible, a cross-check in `pipeline/validate.ts`.
5. If it appears on the Evidence page, give the figure its source line, its query, a one-sentence finding and a table view.

## Adding or changing a verdict

Verdicts are graded by `grade()` against thresholds in `RULES` in `pipeline/config.ts`. A new verdict needs a question, a rule stated in words, a reading of the measurement, and the strongest case against that reading. Commit the threshold in its own commit, before the commit that computes the value.

## Changing the interface

- The site is a static export. Do not add a server route or a runtime dependency on a third-party API for anything other than the Verify page, which is explicitly live and degrades to "source unreachable".
- 3D scenes must be wrapped in `Stage`, which handles missing WebGL and pauses rendering off screen.
- Charts follow the rules in `src/components/charts.tsx`: one y-axis, a legend for two or more series, a hover readout, a table view, and text in ink rather than in series colours.
- Respect `prefers-reduced-motion`.
- No emojis in the interface, the documentation or commit messages.

## Before you open a pull request

```bash
npm run rebuild:offline
npm test
npm run typecheck
npm run build
```

All four must pass. If your change alters any number, say which and why in the pull request description, and include the regenerated `data/metrics.json`, `data/series.json` and `THESIS.md`.

## Commit and review conventions

- Write commit subjects in the imperative, under 72 characters.
- Keep data refreshes (`data/`, `THESIS.md`) in separate commits from code changes, so a reviewer can read the code diff alone.
- A maintainer reviews every pull request. Changes to `pipeline/config.ts` thresholds need a stated reason that does not refer to the current result.

By contributing you agree that your contribution is licensed under the MIT License in `LICENSE`, and you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
