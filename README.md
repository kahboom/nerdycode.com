# NerdyCode.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/4584f427-8004-4053-943c-d4ea12b6870c/deploy-status)](https://app.netlify.com/sites/hopeful-rosalind-0e6939/deploys)

Built with [Eleventy](https://github.com/11ty/eleventy).

## Install Dependencies

`$ npm install`

## Run the App

`$ npm start`

Navigate to [http://localhost:8080/](http://localhost:8080/).

## E2E Tests

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. The test suites are located in `e2e/playwright/`.

### Running Tests

Run all e2e tests:

`$ npm run test:e2e`

Run tests with the Playwright UI:

`$ npm run test:e2e:ui`

> **Note:** The tests will automatically start a local dev server on port 8080 before running.

- [Website](https://www.nerdycode.com/)
