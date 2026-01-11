---
title: "E2E Testing React with Cypress"
date: "2019-07-11"
permalink: "/e2e-testing-react-cypress/"
dynamicPermalink: false
layout: post.njk
references:
    - {title: 'Static vs Unit vs Integration vs E2E Testing for Frontend Apps', url: 'https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests', note: 'Kent C. Dodds'}
    - {title: 'What are Unit Testing, Integration Testing and Functional Testing?', url: 'https://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/', note: 'CodeUtopia'}
    - {title: 'Unit, Integration and End-To-End Tests - Finding the Right Balance', url: 'https://codeahoy.com/2016/07/05/unit-integration-and-end-to-end-tests-finding-the-right-balance/', note: 'CodeAhoy'}
tags:
  - cypress
  - react
  - testing
---

In this tutorial, we'll be setting up our React app with Cypress. Though not exclusive to React, <a href="https://www.cypress.io/" rel="nofollow" target="_blank">Cypress</a> is a comprehensive, but lightweight E2E testing suite.

I like Cypress because it runs in the browser, isn't bloat-y, and is easy to get started with. Since it runs in the browser, you can use browser dev tools to debug alongside your tests. It comes with a pretty cool UI, but if you wanted to run it in your terminal, that's possible too! The best part is that Cypress will create snapshots so that you can view these at a later time, should you choose to.

Cypress is a pleasure to work with, but if it's not for you, you can also use <a href="https://www.seleniumhq.org/" rel="nofollow" target="_blank">Selenium</a> and <a href="https://www.seleniumhq.org/projects/webdriver/" rel="nofollow" target="_blank">Selenium WebDriver</a>. Every project's requirements are different, so you should look into the role that E2E testing will play for you and your team. Don't forget to consider CD/CI and whether or not it is important for you to be able to integrate your E2E testing suite with it as well.

## The Happy Path

First things first. We need to write down our application requirements. If you work with a QE team in your company (or are part of it), you may have heard the phrase "happy path" once or twice. According to <a href="https://en.wikipedia.org/wiki/Happy_path" rel="nofollow" target="_blank">Wikipedia</a>:

<article class="message is-info">
  <div class="message-body">
    [..] a <b>happy path</b> is a default scenario featuring no exceptional or error conditions. For example, the happy
     path for a function validating credit card numbers would be where none of the validation rules raise an error, thus letting execution continue successfully to the end, generating a positive response.
  </div>
</article>

In addition to the happy path, you also need to consider the complete use case scenario, such that the user does not run into unexpected behavior as it stands. It's not about areas that you personally think could be improved, it's about both the functionality and appearance. It's about the _expectations_ of the user.

As a side note, be sure to let your QE team know you are setting this up (that is, if you're working with a QE team), so that your work doesn't overlap. They may already have a "happy path" or even a list of use cases you can reference to write your tests.

Though it would be out of the scope of this article, one suggestion could be to use an executable specification tool like <a href="https://cucumber.io/docs" rel="nofollow" target="_blank">Cucumber</a>. This would allow for you to use something like Cypress in such a way that ensures you are focusing on the business goals and expected behavior of your app.

## Breaking Down Our App's Use Cases

Next let's define the use cases for the user of our app. Suppose we have a game app that allows users to view a list of desserts, of which they are allowed to eat up to five.

- Users should be able to login.
    - Upon logging in, they should see a list of desserts.
    - They should also see a list of desserts they've already eaten, which should be empty.
- Users should be able to choose a dessert to eat.
    - Upon choosing a dessert to eat, it should disappear from the list of desserts.
    - It should also appear in the list of desserts they've eaten.
- Users should only be able to eat a maximum of 5 desserts.
    - Users should not be able to unselect or modify the list of desserts they've already eaten.
    - Users should be informed why they cannot select a 6th dessert.

If we're doing this correctly, there should be about 9 assertions for the expected behavior, not including the initial app loading. So, _at least_ 10. You'll probably also need a full-blown E2E test for each login scenario. To keep this tutorial short, we'll won't be writing all of those tests, but the point to take away from here is the breakdown of requirements.

**Much of E2E testing is planning** how to write a proper test, writing a few solid ones, and integrating with the app so that we know if those expectations ever stop being met. **E2E tests should give you confidence that from the user's perspective, things are ok.**

## Some Tips on Writing E2E Tests

A brief overview of some key things to keep in mind as we write our tests:

- Write and consistently review the requirements of your React app.
- Realize that these tests are meant to simulate real user scenarios. Testing the visual aspects is often as important as the functionality the user expects.
- Create <a href="https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax" rel="nofollow" target="_blank">custom commands</a> to avoid code duplication and to keep tests clean. A good use case is for things like logging in.
- Generally speaking, you should have less tests, but those tests should be relatively long, depending on the needs of your app.

### Setting up Our React App with Cypress

Let's go ahead and add Cypress to our app with `yarn add cypress --dev`.

The command `node_modules/.bin/cypress open` will open the Cypress CLI (or dashboard) on your system, create a `cypress.json` file, and create a `cypress` directory in your app’s root directory, which is where your E2E tests will live.

You can also add the following script to your `package.json` to make it easier to run Cypress:

`"cypress": "cypress open"`

It's possible to run Cypress tests without the UI or dashboard by adding this script as well, which will run tests strictly in the terminal:

`"cypress:all": "cypress run"`

Make sure your `baseUrl` is correctly defined in the `cypress.json` file in the root of your project. You'll need to make sure your app is running when you run Cypress, and that the `baseUrl` corresponds to the server and port your app runs on:

```json
{
  "baseUrl": "http://localhost:3000"
}
```

When you first run Cypress, you'll notice it also provides a nice example test in `cypress/integration/example_spec.js`.

Something I don't like about Cypress is that, as you can see, it creates an `integration` directory for your tests to live in by default. To me, this directory should be called something like, I don't know, maybe "tests"---anything but "integration."

**In the world of JavaScript, E2E tests are** _**not**_ **the same as integration tests.** This may not be the case anywhere else, but it's helpful to understand that when working on the frontend. I'll leave some references articles below that discuss these points in greater detail.

### Working with Data

It's common that you'll need to interact with a server to determine some type of state, and that _usually_ comes in the form of some JSON data returned by an API. If you've written E2E tests before, you may be familiar with the concept and **setup** and **teardown** on a server (hopefully one specifically for testing). Cypress gives you a few options and alternatives.

1. **You could continue to seed a database** using one of the following methods:

- <a href="https://docs.cypress.io/api/commands/exec.html" rel="nofollow" target="_blank">`cy.exec()`</a> - to run system commands
- <a href="https://docs.cypress.io/api/commands/task.html" rel="nofollow" target="_blank">`cy.task()`</a> - to run code in Node via the <a href="https://docs.cypress.io/guides/references/configuration.html#Folders-Files" rel="nofollow" target="_blank">`pluginsFile`</a>
- <a href="https://docs.cypress.io/api/commands/request.html" rel="nofollow" target="_blank">`cy.request()`</a> - to make HTTP requests

If you need to load data and seed the application, it's likely you will probably want to use <a href="https://docs.cypress.io/api/commands/fixture.html#Notes" rel="nofollow" target="_blank">fixtures</a> to accomplish that. You can set this up in the `beforeEach`, which runs before each test, as it implies:

```js
beforeEach(function () {
    // This will reset and seed the database before each test
    cy.exec('yarn db:reset && yarn db:seed')
})
```

2. **You could also just bypass the server completely by stubbing the JSON data it returns.** This is less cumbersome than seeding a database, but likely a bit less accurate since you're not working with data actually returned by the API.

Purists might argue that true E2E testing should use _real_ data. I'm not convinced that this should be the case 100% of the time, but there is validity to the argument. I think the best approach here is to do a bit of each, depending on the needs of the test.

To circumvent the issue of not having the contract of the server when you stub it, Cypress recommends either having the server stub out the data ahead of time, or writing a single test that uses "real data" (no stubs), and the rest with stubs.

If you need to stub calls to the API (for instance, for form submission), you can use `cy.server()` and `cy.route()`.

## Writing Our Tests

If there is one thing I want for you to take away from this article, it's that **you should never login before each test**. This is cost-prohibitive. Still, if your app does allow for users to login, it should be tested. Logging in can get quite complex, so you might want to read up on the different methods Cypress suggests <a href="https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in" rel="nofollow" target="_blank">here</a> (there are several).

Back to our app, here is a very basic example of a test:

```js
describe('DessertApp', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('it should load the app', () => {
    cy.get('.dessert-app')
      .should('have.text', 'Desserts');
  })
  
  it('displays list of desserts', () => {
    // We're assuming we have 10 desserts
    cy.get('li').should('have.length', 10)
  })
})
```

You may notice a lot of `it` s and `should` s. Cypress is built on top of Mocha and Chai, so if you've worked with those before, Cypress should be even easier for you.

The general approach is as follows:

1. Query for an element.
2. Make assertion on that element with something like `should()`.

Everything else can vary, such as whether or not you need to seed data, login, cleanup, etc.

## Integrating with CircleCI

E2E tests are most useful when they become part of the developer's workflow. If you use CircleCI, it's easy to integration Cypress using the <a href="https://docs.cypress.io/guides/guides/continuous-integration.html#CircleCI" target="_blank" rel="nofollow">Cypress CircleCI Orb</a> configuration set. For more info, visit the repo <a href="https://github.com/cypress-io/circleci-orb" rel="nofollow" target="_blank">here</a>. A brief example provided by Cypress shows a simple `circle.yml` file with the following settings:

```yml
version: 2.1
orbs:
  # "cypress-io/cypress@1" installs the latest published
  # version "1.x.y" of the orb. We recommend you then use
  # the strict explicit version "cypress-io/cypress@1.x.y"
  # to lock the version and prevent unexpected CI changes
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/run # "run" job comes from "cypress" orb
```

## Final Thoughts

E2E testing can be quite valuable in a project, just remember that quantity does not always equal quality. Always keep in mind the purpose of the tests you are writing, and let that guide you.

Recently I wrote about <a href="https://www.nerdycode.com/testing-pyramid/" target="_blank">the testing pyramid and how to better balance the types of tests you wrote</a>, but overall you should find that you don't really need as many E2E tests as, say, <a href="https://www.nerdycode.com/unit-testing-react-guide/" target="_blank">unit</a> or integration tests. There is a lot of material to cover in end-to-end testing that I couldn't touch upon here, but hopefully this was a useful introduction to testing your React app with Cypress. Stay focused on the bigger picture and you'll have a robust system of tests in no time.
