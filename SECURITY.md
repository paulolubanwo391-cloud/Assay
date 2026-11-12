# Security Policy

## What this project is, from a security point of view

Assay is a read-only research tool. Knowing what it does not do is most of its security model.

| Property | State |
|---|---|
| Wallet connection | None. The site never asks for a wallet, a signature or a key. |
| Transactions | None. No code path signs or sends anything to any chain. |
| Secrets | None. Every data source is public and keyless. There is no `.env` to leak. |
| Server | None. The site is a static export: HTML, CSS, JavaScript and JSON files. |
| User accounts, forms, uploads | None. |
| Cookies, analytics, trackers | None. |
| Third-party scripts at runtime | None. Fonts and libraries are bundled at build time. |

## Threat model

**1. Tampered data.** The realistic risk for a research tool is that a number is wrong because an upstream source changed, failed, or was altered.

- Every raw file is recorded in `data/raw/manifest.json` with its URL, fetch time, size and sha256.
- `pipeline/validate.ts` re-hashes each file, applies plausibility bounds, and checks quantities that can be derived two ways (for example the supply jump in a block header against the reward list from the `validators` method). If any check fails, the build exits non-zero and nothing is published.
- A source that cannot be reached keeps its last good copy and is labelled "kept" on the site. The pipeline never publishes a partial download.
- The Verify page lets any visitor recompute headline numbers against the primary sources from their own machine.

**2. Supply chain.** Dependencies are pinned by `package-lock.json`. CI installs with `npm ci`, and runs `npm audit` on a schedule. GitHub Actions run with the minimum permissions each job needs, and third-party actions are limited to the official `actions/*` set.

**3. The scheduled refresh.** The refresh workflow commits regenerated data. It has `contents: write` on this repository only, uses the built-in `GITHUB_TOKEN`, and commits only if validation, tests and the build all pass.

**4. The browser.** The Verify page sends read-only JSON-RPC and HTTPS GET requests from the visitor's browser to public endpoints (NEAR RPC providers and DefiLlama). Responses are parsed as JSON and rendered as text through React, which escapes them. No response is evaluated as code or inserted as HTML.

## Supported versions

Only the `main` branch is supported. Fixes are not back-ported.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

1. Use GitHub's private reporting: the repository's **Security** tab, then **Report a vulnerability**.
2. Include what you found, how to reproduce it, and what you think the impact is.

You can expect an acknowledgement within 3 working days and a first assessment within 7. If the report is confirmed we will fix it, credit you if you wish, and note the fix in the release notes.

In scope: anything that could make the site show a number the pipeline did not compute, run attacker-controlled code in a visitor's browser, or make the refresh workflow commit unvalidated data.

Out of scope: availability of third-party endpoints, rate limits on public RPC, and disagreements about methodology. Methodology questions are welcome as ordinary issues; see [CONTRIBUTING.md](CONTRIBUTING.md).

## For people deploying their own copy

- Serve the `out/` directory from any static host. No environment variables are required. `NEXT_PUBLIC_BASE_PATH` is optional and only sets a URL prefix.
- A reasonable Content-Security-Policy for the static site is: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://rpc.mainnet.fastnear.com https://near.lava.build https://rpc.mainnet.near.org https://api.llama.fi https://coins.llama.fi; worker-src 'self' blob:`.
