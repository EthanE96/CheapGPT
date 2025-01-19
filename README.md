# Running App Locally

## API

```bash
  cd /api
  npm run watch
```

## UI

```bash
  cd /ui
  npm run watch
```

# Deployment

## DEV

Dev is deployed automatically on main PR merge or main push through GitHub actions. However, can also be deployed manually if needed.

### API

```bash
cd /api
npm run deploy:dev
```

**Logs**

```bash
cd /api
npm run logs:dev
```

### UI

```bash
cd /ui
npm run deploy:dev
```

## Prod

Production will be deployed manually from off the prod branch. This is using the trunking git strategy.

### API

```bash
cd /api
npm run deploy:prod
```

**Logs**

```bash
cd /api
npm run logs:prod
```

### UI

```bash
cd /ui
npm run deploy:prod
```

## Configuration

### OAuth2.0 Locations

[Google OAuth2.0 Console](https://console.cloud.google.com/welcome?invt=AblAnA&organizationId=0&project=ethanedwards)
