# planner-backend

<p align="center">
  <img src="https://img.shields.io/badge/Framework-nestjs-blue%3Fstyle%3Dflat" alt="Framework-nestjs"/>
  <img src="https://img.shields.io/badge/Version-0.4.0_(Beta)-purple?style=flat" alt="Version-0.4.0(Beta)"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License-MIT"/>
</p>

## About

The server part of a planner web application. You can create tasks with the app and track their progress. Supports adding tags to a task, setting its due date, and estimating its completion time.

## Technologies

- NestJS (10.0.0)
- Prisma (6.1.0)
- PostgreSQL (16)
- Jest (29.5.0)

## Environment

- Node 20.14.0
- npm 10.7.0 (recommended for production)
- pnpm 9.15.2 (recommended for development)

## Plans

- [x] Add authorization / registration / authentication
- [x] Add `Dockerfile`
- [x] Add user profile update
- [ ] Add manage user tags
- [ ] Add manage user tasks
- [ ] Add manage projects
- [ ] Add manage projects tasks

## Common setup

Clone the repo and install the dependencies.

```
  git clone https://github.com/evdmatvey/planner-backend.git
  cd ecommerce-backend
```

```
  npm install
```

### Development

Initialize dev environment (database)

```
  docker compose -f "docker-compose.dev.yml" up -d --build
```

Run in development mode.

```
  pnpm start:dev
```

Run tests.

```
  pnpm test
```

Run code format checker.

```
  pnpm format
```

Run linter.

```
  pnpm lint
```

### Build

Build application and start.

```
  npm run build
  npm run start:prod
```

## Developers

- [evdmatvey](https://github.com/evdmatvey)

## License

Project planner-backend is distributed under the MIT license.
