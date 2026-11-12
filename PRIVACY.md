# Privacy

Short version: Assay collects nothing about you.

## What the site stores or sends

| | |
|---|---|
| Accounts or sign-in | None |
| Cookies | None |
| Local storage, session storage, IndexedDB | Not used |
| Analytics, advertising or tracking scripts | None |
| Forms or any other way to submit information | None |
| Wallet connection | None |
| A server run by this project | None. The site is static files. |

## Requests your browser makes

**Loading the site.** Your browser requests static files from whoever hosts the copy you are visiting (for example GitHub Pages or Vercel). That host sees what any web host sees, such as your IP address and user agent, under its own privacy policy. This project does not receive or have access to those logs.

**The Verify page, only when you press the button.** Your browser sends read-only requests directly to public endpoints so that it can recompute numbers itself:

- NEAR RPC providers: `rpc.mainnet.fastnear.com`, `near.lava.build`, `rpc.mainnet.near.org`
- DefiLlama: `api.llama.fi`, `coins.llama.fi`

Those requests contain only the public query (for example "give me the current validator set"). They contain nothing about you beyond what any HTTPS request reveals to the server it reaches, which is your IP address and user agent. Those operators handle that under their own policies. If you would rather not contact them, do not press the button; everything else on the site works without it.

No other page makes any network request after it has loaded.

## Data the project publishes

Everything in `data/` is public blockchain data and public market data: block headers, validator account names and stakes, balances of named protocol wallets, and aggregate series from DefiLlama and NearBlocks. Validator and wallet account names are public identifiers on the NEAR chain. The project does not attempt to link any on-chain account to a person.

## Running the pipeline yourself

`npm run rebuild` makes the same kinds of read-only requests from your machine to the same public endpoints, plus `api.nearblocks.io` and an archival NEAR RPC. It sends no identifier other than a generic user agent string, and writes only to the `data/` folder of your copy of the repository.

## Contributions

If you open an issue or a pull request, GitHub processes that under its own privacy statement. Git commits record the name and email address you configure.

## Changes

Any change to this document is made by pull request and is visible in the repository history.
