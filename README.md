# Detroit Titans Upcoming Home Games

> Built with [Remix](https://remix.run) and [Inngest](https://inngest.com)

## Development

First, ensure [bun](https://bun.sh/) is installed.

Then, install the project dependencies:

```sh
bun install
```

### Environment Variables

This app uses the following environment variables:

- `INNGEST_EVENT_KEY` - The Inngest event key, found at https://app.inngest.com/env/production/manage/keys
- `INNGEST_SIGNING_KEY` - the Inngest signing key, found at https://app.inngest.com/env/production/manage/signing-key
- `DATABASE_URL` - The PostgreSQL database URL (for example, `postgres://user:password@localhost:5432/titans_development`)

### Running the App

```sh
bun dev
```

This starts the app in development mode, rebuilding assets on file changes. This also starts an Inngest dev server for inspecting or triggering events.

- The app is running at [localhost:3000](http://localhost:3000).
- The Inngest dev server is running at [localhost:8288](http://localhost:8288).

### Running Checks

Run the unit test suite:

```sh
bun test
```

Run the linter:

```sh
bun lint
```

## Deployment

First, build the app for production:

```sh
bun run build
```

Then, run the app in production mode:

```sh
bun start
```
