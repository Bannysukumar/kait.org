<!-- readme-seo: bannysukumar-professional-v4 -->

# KAIT

KAIT is a Next.js admin application. Routes under `app/admin` include users, KYC, withdrawals, a KAIT wallet, stake plans, and staking contracts. The npm package name in `package.json` is `hpe-app-ui`.

## Overview

The interface is built with Next.js, React, and MUI. Admin screens present in `app/admin` cover a dashboard, user list, KYC list, beneficiary, club volume, withdrawal review, wallet pending and rejected states, stake plans, and staking contract lists.

The repository homepage is https://kait-org.vercel.app. A `Dockerfile` is included. This README does not describe on-chain contract source, because no Solidity file is in the repository root tree that was inspected. The staking screens are admin pages.

## Features

Confirmed by App Router pages:

- Admin dashboard, profile, and settings
- User list, add user, user details, and password reset
- KYC list and KYC details
- Withdrawal, pending approval, approved, and rejected views
- KAIT wallet pending, pending approval, and rejected views
- Stake plans, combine plan, and staking contract list
- Club volume and beneficiary pages

## Tech Stack

| Technology | Where it shows up |
|---|---|
| Next.js | `next.config.js` and `next dev` script |
| TypeScript | `tsconfig.json` |
| React and MUI | `package.json` dependencies |
| Docker | `Dockerfile` |

## Architecture

Next.js App Router pages under `app/` → admin route groups for users, KYC, wallet, withdrawals, and staking plans.

## Project Structure

```text
kait.org/
├── app/admin/
├── components/
├── lib/
├── public/
├── store/
├── Dockerfile
├── next.config.js
└── package.json
```

## Prerequisites

- Node.js
- npm or yarn (`yarn.lock` is present)

## Installation

```bash
git clone https://github.com/Bannysukumar/kait.org.git
cd kait.org
npm install
npm run dev
```

`npm run dev` runs `next dev --turbopack`.

## Configuration

`.env` and `.env.local` are in the repository. Do not commit new secrets. Use those files only as the local configuration the app already expects.

## Usage

Start the dev server and open the admin routes, beginning with `app/admin/dashboard`.

## Deployment

`Dockerfile` and `next.config.js` are in the root. The recorded homepage is https://kait-org.vercel.app.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under MIT. See [LICENSE](LICENSE).

## Author

Banny Sukumar

GitHub: https://github.com/Bannysukumar
