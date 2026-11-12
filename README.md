# Assay

**NEAR, weighed: what the chain pays for its security, and what it earns back.**

An evidence-first, re-runnable long-term investment thesis for NEAR. Built at **NEAR HACKATHON 2026**, track **Investment Thesis** (`thesis`).

![The landing page: a brass balance scale whose tilt is the measured ratio of NEAR returned to holders against NEAR minted for security](docs/screenshots/01-hero.png)

<!-- headline:start -->
> **Data to 2026-11-11.** NEAR mints **89,399 NEAR a day** (2.49% a year, $117.0M) to pay for security. NEAR Intents revenue buys back **13,548** and gas burns **831**: income covers **16.1%** of the bill. The HSP-029 cut alone would lift that to **25.1%**. After the cut, 86 of 353 validators would cover a $500 monthly cost from commission (100 today); they hold 89.4% of stake. Seven tests: 4 supported, 2 mixed, 1 contradicted. Stance: **Subsidised**.
>
> These figures are written by `npm run thesis` from `data/metrics.json`.
<!-- headline:end -->

Research, not financial advice. Read-only: no wallet, no keys, no transactions, no API keys.

## Contents

- [What this is](#what-this-is)
- [The problem](#the-problem)
- [What is different about this entry](#what-is-different-about-this-entry)
- [Try it: do X, see Y](#try-it-do-x-see-y)
- [Screenshots](#screenshots)
- [How NEAR fits in](#how-near-fits-in)
- [System design](#system-design)
- [Data sources](#data-sources)
- [The model](#the-model)
- [Commands](#commands)
- [Repository map](#repository-map)
- [What the track asked for, and where it is](#what-the-track-asked-for-and-where-it-is)
- [Limits, stated plainly](#limits-stated-plainly)
- [Disclosures](#disclosures)
- [Project documents](#project-documents)
- [License](#license)

## What this is

Assay reads NEAR like an income statement.

- **The cost** is security: the NEAR the protocol mints every epoch and pays to validators and stakers.
- **The income** is what comes back to holders: NEAR bought on the open market with NEAR Intents revenue, and NEAR burned as gas.
- **The thesis** is about the gap between the two, whether it is closing, and whether closing it from the cost side (the HSP-029 issuance cut) is safe.

It is three things in one repository:

1. **A pipeline** that downloads public data, measures every quantity, validates the result and refuses to publish if a check fails.
2. **A written thesis**, [`THESIS.md`](THESIS.md), generated from the pipeline's output: the claim, the evidence for, the evidence against, and what would change our mind.
3. **A website** with a live 3D balance scale, seven charts (each with its query and a table), an interactive model, and a page that recomputes the headline numbers in your browser.

## The problem

"NEAR Intents volume is growing, so NEAR is undervalued" is the common claim. It skips two questions an investor has to answer:

1. How much of that activity reaches a token holder, measured against what holders pay in dilution?
2. Dilution pays for security. If the protocol cuts issuance to improve the first number, what happens to the validators who are paid with it?

Most public work on NEAR answers the first question and assumes the second away. Assay measures both.

## What is different about this entry

| | |
|---|---|
| **The cost side is measured, not assumed** | Issuance is read from the chain at about 125 epoch boundaries, two independent ways (the supply jump in the block header, and the reward list from the `validators` RPC method), and the two are required to agree. |
| **The security budget is tested** | Every validator's last-epoch reward and commission is read from the chain to ask who still covers their operating cost after HSP-029 cuts issuance from 2.5% to 1.6%, and how much stake sits with them. |
| **Verdicts are graded by rule** | Seven tests with thresholds fixed in [`pipeline/config.ts`](pipeline/config.ts). The build grades them. Tests that fail stay on the page. |
| **Verification needs no install** | The Verify page recomputes nine headline numbers in the visitor's browser, straight from NEAR RPC and DefiLlama, and shows them beside the published ones. |
| **It cannot break at runtime** | The site is a static export built from validated, hash-pinned snapshots. It has no server and no runtime dependency on any API. |
| **The thesis cannot drift from the data** | `THESIS.md`, the site and the command-line model all read one `metrics.json` and share one model file. |

## Try it: do X, see Y

Requirements for the local steps: Node 20 or newer. Nothing else. No API key, no account, no wallet.

| # | Do | See |
|---|---|---|
| 1 | `git clone <this repository> && cd <folder> && npm install` | Dependencies install. |
| 2 | `npm run rebuild:offline` | Recomputes every number from the committed raw data with no network. Prints the as-of date, price, minted NEAR a day, coverage and stance; then `validation passed: N checks`; then `THESIS.md written`. |
| 3 | `git diff --stat` | Only the `generatedAt` timestamp line differs. The committed outputs are reproducible from the committed inputs. |
| 4 | `npm test` | The model's unit tests pass (projection, simulation determinism, validator economics, grading). |
| 5 | `npm run rebuild` | Same as step 2 but downloads fresh data first. Each source prints `fresh` or `KEPT`. The first run reads about 125 epoch boundaries from archival RPC and takes several minutes; later runs reuse them. |
| 6 | `npm run model -- --growth 0.03 --half-life 12` | A table of issuance rate, NEAR minted, NEAR bought back and coverage every six months for five years, the month coverage reaches 50% and 100%, and the simulated probability of full coverage. Add `--no-cut`, `--price 0.2`, `--json`. |
| 7 | `npm run build && npm start` | The static site in `out/`, served locally. Open the address it prints. |
| 8 | On the site, open **Overview** and press **After the issuance cut**, then **At balance** | The scale re-weighs: coins leave the minted pan, the beam swings and settles. The captions state the numbers. |
| 9 | Open **Evidence**, pick any figure, press **Query**, then **Table** | The exact endpoint and formula behind the chart, and the same numbers as a table. |
| 10 | Open **Verify** and press **Run all nine checks** | Your browser queries NEAR RPC and DefiLlama directly. Each row shows our figure, the figure recomputed now, the gap, and `Agrees` or `Differs`. |
| 11 | Open **Model** and move any slider | The scenario line, the headline sentence, the table and the simulation fan all recompute. |
| 12 | Open [`THESIS.md`](THESIS.md) | The claim, evidence for, evidence against, the seven verdicts, and what would change our mind. |
| 13 | Corrupt a byte in any file under `data/raw/` and run `npm run validate` | `VALIDATION FAILED`, naming the file whose hash no longer matches. This is the gate that keeps a bad refresh off the site. |

## Screenshots

| | |
|---|---|
| ![The ledger: minted, bought back, burned, and the net cost carried by holders](docs/screenshots/02-ledger.png) | ![Seven tests, each with a value, a verdict, the rule and the case against](docs/screenshots/03-tests.png) |
| **The ledger.** NEAR as an income statement, in NEAR a day and dollars a year. | **Seven tests.** Each row opens to show what was measured, the rule, and the strongest case against. |
| ![Every validator as a column, coloured by whether commission income covers operating cost before and after the issuance cut](docs/screenshots/04-security.png) | ![Simulated coverage paths with percentile bands](docs/screenshots/05-path.png) |
| **The security chapter.** Every validator as a column. The slider sets the assumed operating cost. | **The path.** Coverage resampled from observed growth, with and without the cut. |
| ![Evidence page: a chart with chart, table and query views](docs/screenshots/06-evidence.png) | ![Model page: sliders and a recomputed scenario](docs/screenshots/07-model.png) |
| **Evidence.** Seven figures; each has its source, its query and a table. | **Model.** Every assumption is a control. |
| ![Verify page after running the checks](docs/screenshots/08-verify.png) | ![The generated thesis rendered on the site](docs/screenshots/09-thesis.png) |
| **Verify.** Headline numbers recomputed in the browser, beside the published ones. | **Thesis.** `THESIS.md` rendered as a page. |

Regenerate them with `npm run screenshots` while the site is being served (see [Commands](#commands)).

## How NEAR fits in

NEAR is the subject and the primary data source.

- **NEAR JSON-RPC, live and archival** (`block`, `validators`, `EXPERIMENTAL_protocol_config`, `query view_account`, `query call_function`): total supply and gas burn from block headers, rewards paid per validator per epoch, the validator set and its stake, protocol parameters, balances of the NEAR Intents revenue wallets at fixed block heights, and each staking pool's commission.
- **NEAR Intents**: its fees, the share NEAR keeps, and the buyback of NEAR that share funds are the income side of the ledger.
- **House of Stake proposal HSP-029** (maximum issuance 2.5% to 1.6%): modelled as a ramp with an adjustable start date, and tested against validator economics.

Track hints used: ONCHAIN DATA, DASHBOARDS, RESEARCH.

## System design

```
                       public, keyless sources
   NEAR RPC (live)   NEAR RPC (archival)   DefiLlama   NearBlocks
          \                 |                  |           /
           v                v                  v          v
   +---------------------------------------------------------------+
   | 1. fetch      pipeline/fetch.ts                                |
   |    timeouts, retries with backoff, fallback RPC endpoints,     |
   |    one shared rate-limited queue, epoch cache, checkpoints     |
   |    -> data/raw/*.json  +  manifest.json (url, time, sha256)    |
   |    a failed source keeps its last good copy, marked "kept"     |
   +---------------------------------------------------------------+
                                |
                                v
   +---------------------------------------------------------------+
   | 2. compute    pipeline/compute.ts   (offline, deterministic)   |
   |    uses src/lib/model.ts  -> data/metrics.json, series.json    |
   +---------------------------------------------------------------+
                                |
                                v
   +---------------------------------------------------------------+
   | 3. validate   pipeline/validate.ts   THE PUBLISH GATE          |
   |    file hashes, freshness, finite numbers, plausibility        |
   |    bounds, two-route cross-checks. Non-zero exit on failure.   |
   +---------------------------------------------------------------+
                                |
                 +--------------+---------------+
                 v                              v
   +-------------------------+    +------------------------------+
   | 4. thesis               |    | 5. site    next build        |
   |    pipeline/thesis.ts   |    |    static export -> out/     |
   |    -> THESIS.md         |    |    no server, no runtime API |
   +-------------------------+    +------------------------------+
                                                 |
                                                 v
                              any static host (GitHub Pages, Vercel)
                                                 |
                                                 v
                    visitor's browser -- Verify page only --> NEAR RPC, DefiLlama
```

Why it is built this way:

- **Static first.** Every number on the site was computed at build time. If every upstream API went down, the site would keep working and would say how old its data is.
- **Fail closed.** The scheduled refresh ([`refresh.yml`](.github/workflows/refresh.yml)) commits only if download, compute, validation, tests and build all pass. A bad upstream day leaves the last good snapshot in place.
- **Degrade, do not break.** A source that cannot be reached keeps its previous file and is labelled on the Evidence page. 3D scenes fall back when WebGL is missing and stop rendering off screen. The Verify page reports an unreachable source as exactly that.
- **One model.** [`src/lib/model.ts`](src/lib/model.ts) is pure functions with no I/O. The pipeline, the site, the CLI and the tests import the same file.
- **Deterministic.** The simulation uses a seeded generator. Two runs on the same raw data produce the same outputs, and CI checks that.
- **Polite to public infrastructure.** All RPC calls go through one queue with a minimum gap; finished epochs are cached and never fetched twice.

Continuous integration ([`ci.yml`](.github/workflows/ci.yml)) type-checks, runs the tests, recomputes every number from the committed raw data, fails if the outputs differ from what is committed, and builds the site.

## Data sources

All public. None needs a key.

| Source | Used for | Endpoint |
|---|---|---|
| NEAR RPC, live | Head block and total supply, protocol config, current validators with stake and last-epoch rewards, pool commissions, wallet balances | `https://rpc.mainnet.fastnear.com` (fallbacks: `rpc.mainnet.near.org`, `near.lava.build`) |
| NEAR RPC, archival | Supply and burn at each epoch boundary, rewards per epoch, wallet balances at past block heights | `https://archival-rpc.mainnet.fastnear.com` |
| DefiLlama | NEAR Intents daily volume, fees, captured revenue, holders revenue, value held. The Verify page also reads its coins API as an independent price series. | `https://api.llama.fi/summary/{dexs,fees}/near-intents`, `/protocol/near-intents`, `https://coins.llama.fi` |
| NearBlocks | Daily NEAR price, total supply, transactions, fees, active accounts | `https://api.nearblocks.io/v1/charts` |

Each downloaded file is listed in [`data/raw/manifest.json`](data/raw/manifest.json) with its URL, fetch time, size and sha256.

## The model

[`src/lib/model.ts`](src/lib/model.ts), about 250 lines, no dependencies.

- **Coverage** = (NEAR bought back + NEAR burned) / NEAR minted, per day.
- **Issuance path.** The measured annual rate, scaled by the ratio of the scheduled maximum to today's maximum as HSP-029 ramps.
- **Projection.** Month by month: revenue grows at a rate that can fade with a half-life; revenue is converted to NEAR at the path's price; supply grows by minted minus burned.
- **Simulation.** Block bootstrap of the last twelve months of fee growth, with spikes clipped to Tukey's fences, seeded, reporting the 10th, 50th and 90th percentile of coverage and the probability it has reached 50% and 100%.
- **Validator viability.** Operator income = last-epoch reward x commission x epochs a year x price, against an assumed monthly cost, today and at the post-cut rate.
- **Staker yield.** Nominal yield net of commission, deflated by net supply growth, for stakers and non-stakers.

## Commands

| Command | What it does |
|---|---|
| `npm run rebuild` | fetch, compute, validate, write `THESIS.md` |
| `npm run rebuild:offline` | the same without the download |
| `npm run fetch` / `compute` / `validate` / `thesis` | each step on its own |
| `npm run model -- [flags]` | the model in the terminal: `--growth`, `--half-life <n\|inf>`, `--price`, `--cut-start`, `--no-cut`, `--months`, `--scale`, `--json` |
| `npm test` | unit tests |
| `npm run typecheck` | TypeScript, no emit |
| `npm run dev` | the site with hot reload |
| `npm run build` | static export to `out/` |
| `npm start` | serve `out/` locally |
| `npm run screenshots` | regenerate `docs/screenshots/` from a served site (`SITE_URL`, default `http://localhost:4173`) |
| `npm run all` | rebuild, test, build |

Set `ASSAY_FORCE=1` to re-read validator commissions that were read in the last 20 hours.

## Repository map

```
assay/
├── README.md                     this file
├── THESIS.md                     the thesis, generated from data/metrics.json
├── CONTRIBUTING.md               how to dispute a number or add a metric
├── CODE_OF_CONDUCT.md
├── SECURITY.md                   threat model, how to report a problem
├── PRIVACY.md                    what the site sends and stores (nothing)
├── LICENSE                       MIT
├── package.json                  scripts and pinned dependencies
├── next.config.ts                static export, optional base path
├── tsconfig.json
├── postcss.config.mjs
│
├── pipeline/                     the rebuild, in four steps
│   ├── config.ts                 every setting and every verdict threshold
│   ├── fetch.ts                  1. download raw inputs, write the manifest
│   ├── compute.ts                2. raw inputs -> metrics.json, series.json
│   ├── validate.ts               3. the publish gate
│   ├── thesis.ts                 4. write THESIS.md and the README headline
│   ├── model-cli.ts              the model from the terminal
│   └── lib/
│       ├── http.ts               timeouts, retries, RPC fallbacks, rate-limited queue
│       └── io.ts                 paths, hashing, manifest types
│
├── data/
│   ├── raw/                      downloaded inputs, one file per source
│   │   ├── manifest.json         url, fetch time, bytes, sha256 for each file
│   │   ├── llama_intents_*.json  volume, fees, revenue, holders revenue, value held
│   │   ├── nearblocks_charts.json  daily price, supply, transactions, fees
│   │   ├── rpc_epochs.json       supply and rewards at each epoch boundary
│   │   ├── rpc_validators.json   current validator set, stake, last-epoch rewards
│   │   ├── rpc_commissions.json  each pool's commission
│   │   ├── rpc_wallets.json      revenue wallet balances at fixed block heights
│   │   ├── rpc_protocol_config.json
│   │   └── rpc_head.json
│   ├── metrics.json              every number the thesis and the site quote
│   └── series.json               every chart
│
├── src/
│   ├── lib/
│   │   ├── model.ts              the model: pure functions, no I/O
│   │   ├── types.ts              the shape of metrics.json and series.json
│   │   ├── data.ts               build-time import of the snapshots
│   │   └── format.ts             number and date formatting
│   ├── app/                      pages (static export)
│   │   ├── layout.tsx            fonts, navigation, footer
│   │   ├── globals.css           design tokens and base styles
│   │   ├── page.tsx              overview
│   │   ├── evidence/page.tsx
│   │   ├── model/page.tsx
│   │   ├── verify/page.tsx
│   │   └── thesis/page.tsx       renders THESIS.md
│   └── components/
│       ├── charts.tsx            Figure, LineChart, BarChart, FanChart
│       ├── home/
│       │   ├── Hero.tsx          headline and the 3D balance
│       │   └── Sections.tsx      ledger, tests, security, path, closing
│       ├── pages/
│       │   ├── Evidence.tsx      seven figures with query and table views
│       │   ├── ModelLab.tsx      interactive model
│       │   └── VerifyLab.tsx     in-browser recomputation
│       ├── site/
│       │   ├── Chrome.tsx        navigation, footer, smooth scrolling
│       │   └── Reveal.tsx        scroll and count-up motion
│       └── three/
│           ├── ScaleScene.tsx    the balance scale
│           ├── SkylineScene.tsx  validators as columns
│           └── Stage.tsx         WebGL detection, fallback, off-screen pause
│
├── tests/
│   └── model.test.ts             unit tests for the model
│
├── scripts/
│   └── screenshots.mjs           regenerates docs/screenshots/
│
├── docs/
│   └── screenshots/              images used in this README
│
└── .github/
    └── workflows/
        ├── ci.yml                type-check, test, recompute, build
        ├── refresh.yml           daily data refresh, commits only if all checks pass
        ├── deploy.yml            publish to GitHub Pages
        └── audit.yml             weekly dependency audit
```

## What the track asked for, and where it is

| Asked for | Where |
|---|---|
| A long-term thesis backed by data | [`THESIS.md`](THESIS.md) |
| Onchain analytics | [`pipeline/fetch.ts`](pipeline/fetch.ts): epoch accounting, validator rewards, wallet balances, all from NEAR RPC |
| Live dashboards | The site; refreshed daily by [`refresh.yml`](.github/workflows/refresh.yml) |
| Models anyone can re-run | `npm run model`, the Model page, [`src/lib/model.ts`](src/lib/model.ts) |
| One command that rebuilds everything | `npm run rebuild` |
| Each chart with its query and one plain sentence | Evidence page: headline sentence, Query view, Table view |
| The claim, evidence for, evidence against, what would change your mind | `THESIS.md` sections of those names |
| Never invent numbers; say what cannot be computed | "What we could not measure" in `THESIS.md`; validation gate |

## Limits, stated plainly

- Validator operating cost is an assumption. The chain does not publish it. Results are reported across a grid and the site exposes it as a control.
- Commission income is a lower bound on what an operator earns.
- Intents volume and fees are DefiLlama's series. The revenue leg is reconciled against wallet balances on chain; volume is not rebuilt from event logs.
- The buyback is a policy, not a contract. The wallets can be moved by their signers.
- The HSP-029 start date is not set on chain and is assumed.
- The NEAR BigQuery public dataset is not used, so that nothing here needs a cloud account. Daily transactions and active accounts come from NearBlocks.
- The simulation resamples a short history. It generates scenarios; it does not forecast.

## Disclosures

- **Built in the hackathon window.** All code in this repository was written during NEAR HACKATHON 2026. There is no pre-existing codebase.
- **AI assistance (rule Q-005).** The code, the pipeline and the documentation were written with Claude Code, an AI coding agent, directed and reviewed by the author.
- **Libraries.** Next.js, React, three.js, React Three Fiber, drei, Motion, Lenis, d3-scale, d3-shape, d3-array, Tailwind CSS, Fontsource (Fraunces, IBM Plex Sans, IBM Plex Mono), TypeScript, tsx, Vitest, puppeteer-core (screenshots only).
- **Other public work.** While researching the field we read other public entries in this track. No code or data from them is used. Where `THESIS.md` relies on something only third parties have reported (flow on a private settlement path), it says so and does not put a number on it.
- **Other submissions by the same author (rule Q-015).** To be stated here by the author before submitting.

## Project documents

- [`THESIS.md`](THESIS.md): the thesis
- [`CONTRIBUTING.md`](CONTRIBUTING.md): how to dispute a number, add a metric, or change the interface
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- [`SECURITY.md`](SECURITY.md): threat model and how to report a problem
- [`PRIVACY.md`](PRIVACY.md): what the site does and does not send or store

## License

[MIT](LICENSE).
