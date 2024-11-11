# Weather App Wrapper

## Pre-requisites

- Running Postgresql Engine
- Running Redis Server
- Installed Node.js and TypeScript

## Installation

- Clone the repository, then copy `.env.example` to the base directory and rename it to `.env`

- Configure the environment variables listed in the `.env` file (e.g., database settings, Redis configuration, API keys, etc.).

To install the project dependencies, run:

```bash
yarn
```

or

```bash
npm install
```

## Quick Start

To start the project, run:

```bash
yarn start
```

or

```bash
npm start
```

Once started, you can execute API calls at [127.0.0.1:3000](http://127.0.0.1:3000)

## Tests

To run the unit tests:

```bash
yarn test
```

or

```bash
npm run test
```

For end-to-end (E2E) tests, run:

```bash
yarn test:e2e
```

or

```bash
npm run test:e2e
```

Note: unit and E2E test coverage is intentionally partial. If you’d like me to complete it, feel free to reach out.

## Technologies used & Considerations

### Technologies

- Used Weather API as a third party to fetch the weather data. <br/>
  you can use this API key for testing `efe3463874694d179e8105550241111` (valid until 25/11)

- Used redis for caching

- Postgresql for the database

### Considerations & Assumptions

- It is assumed that the real-time weather data updates on an hourly basis, as the response from the API is segmented by hours.

- It is assumed that the forecasted weather updates on a daily basis.

- While caching could be implemented in simpler ways, I’ve opted for the approach that best fits this scenario. Note that caching could also be implemented at the request level; however, this approach would lack customization and scalability for future enhancements.

- The requirements for the logging section were unclear. It is uncertain whether the reference was to Datadog integration or another logging solution (console, file based archived daily). Clarification would be helpful.

## Caching Strategy

I implemented a `Read Through` caching strategy along with` TTL (Time-to-Live)` for cache eviction. A cron job is used to refresh the cache and handle invalidation every hour.

The backend reads data from the cache. If the data is not present, it fetches it from the main source, caches it, and serves it to the client.

- Real-time weather data is cached for 1 hour.
- Forecast data is cached for 12 hours.

The cron job refreshes the cache only for the user’s favorite locations. Other locations are evicted from the cache after 1 hour for real-time data or 12 hours for forecast data.

## Documentation

Please checkout the Postman API documentation [here](https://documenter.getpostman.com/view/4544669/2sAY545dt8)

A json version of the documentation (in case you want to import it into the postman) is available in `artifacts\Weather App.postman_collection.json`

Note that the documentation can be done in swagger as well, but since documentation quality is important i chose Postman so i can make custom documentation.
