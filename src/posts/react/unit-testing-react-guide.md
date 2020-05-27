---
title: "A Guide to Unit Testing in React"
date: "2019-06-27"
layout: layouts/post.njk
permalink: "/unit-testing-react-guide/"
dynamicPermalink: false
tags:
  - react
  - testing
---

We know that unit tests are important, but when it comes to writing them we often draw a blank. Which library or testing framework should I use? What should we test? How may of these am I supposed to write?

As with many of my posts, this started out as a list of notes I've gathered and want to share in the event it helps someone else out there. This guide is specific to React, but many points can be applied to really any web application.

## What exactly are unit tests?

Unit tests are exactly what they imply--small, self-contained units of code written to test other code you have written, ideally also small and self-contained. They're quite easy to debug because they're small and have very specific purposes. In React, we could say that [pure functions](https://reactjs.org/docs/components-and-props.html#props-are-read-only) are probably the easiest to test, because there are no side effects involved.

## How many unit tests should I write?

Not too long ago, I wrote a post about the [Testing Pyramid](https://www.nerdycode.com/testing-pyramid/), but the general idea is that we should write more unit tests and less E2E tests. The exact amount will vary, mostly depending on the size of your application and your project's specific needs.

## What tools should I be using to test my React code?

The truth is that this is highly subjective, so let's start out with introducing some of the most common players in this area.

### Enzyme

[Enzyme](https://github.com/airbnb/enzyme) is a testing framework that was created by Airbnb, with a focus on checking state and React props. The way that it works is that it returns React components in memory, or to the DOM. You may find that the API used for traversing the component tree is very similar to jQuery.

### Jest

[Jest](https://jestjs.io/) is a testing framework that was created by Facebook. If you use create-react-app, you've probably heard of it before, as it includes it OOTB.

### Karma + Mocha

Often used in tandem, this dynamic duo has been around for a while (relative to the rapidly changing world of JS), and is commonly used in other frameworks, like Angular. [Mocha](https://mochajs.org/) is the testing framework, while [Karma](https://karma-runner.github.io/latest/index.html) is the test runner.

### react-testing-library

[React Testing Library](https://github.com/testing-library/react-testing-library) was created as a kind of replacement for Enzyme, and is often used in conjunction with Jest (though this is not required). It's built on top of React DOM and React Test Utils (below) and focuses more on the DOM and what gets rendered, and is then able to interact with it. Instead of returning React components like Enzyme, it returns HTML elements. Using its API you are then able to use query functions for things like text content that is visible on the page, or even HTML data attributes.

The React team actually _[recommends](https://reactjs.org/docs/test-utils.html)_ using React Testing Library, though it's apparent that Enzyme can provide a level of convenience that you and/or your team would have to decide is worth the tradeoff.

### ReactTestUtils

[ReactTestUtils](https://reactjs.org/docs/test-utils.html) is a set of convenience utilities that are provided out-of-the-box by React, and they are meant to be used in combination with your testing framework. It is recommended that you use ReactTestUtils alongside jest-dom, which is a companion library for React Testing Library. jest-dom provides  custom DOM element matches for Jest (e.g. toBeVisible).

## Jest & react-testing-library

You can run Jest directly from the command line like this: `jest my-test --notify --config=config.json`

Here is an example taken from [examples/react-testing-library](https://github.com/facebook/jest/tree/master/examples/react-testing-library) of a component for a simple checkbox that swaps between two labels:

```
// CheckboxWithLabel.js
import React from 'react';

export default class CheckboxWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: false};
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.setState({isChecked: !this.state.isChecked});
  }

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}
```

And the test:

```
// tests/CheckboxWithLabel-test.js
import React from 'react';
import {render, fireEvent, cleanup} from 'react-testing-library';
import CheckboxWithLabel from '../CheckboxWithLabel';

afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const {queryByLabelText, getByLabelText} = render(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />,
  );

  expect(queryByLabelText(/off/i)).toBeTruthy();

  fireEvent.click(getByLabelText(/off/i));

  expect(queryByLabelText(/on/i)).toBeTruthy();
});
```

The test function is quite similar to other testing libraries, and accepts two parameters:

1. A message we define that describes the purpose of the test, and ultimately defines whether or not it passes.
2. The second parameter is an arrow function that will contain our test

Your test files should have one of the following extensions in order for Jest to find them: `test.tsx` or `test.js`. If they don't contain any JSX, it's also possible to use a `test.ts` extension.

### Tips for Writing Unit Tests

\[blockquote align="none" author="Kent C. Dodds 👋"\]The more your tests resemble the way your software is used, the more confidence they can give you.  \[/blockquote\]

These famous words by Kent C. Dodds are the number one tip I can give if you are using React Testing Library. Though I try my best to be impartial, I will say that React Testing Library makes you look at unit testing differently than most developers tend to. I think it's very common for developers to want to test the functionality of their code as opposed to testing from the perspective of the user.

One can argue that testing from the user's perspective is what E2E testing is for, but it's not that straightforward. While unit tests are indeed meant to test the functionality, in the UI this translates to a more visual approach of functionality.

Unit tests don't involve a happy path or focus on integrations, rather, just visual usability in terms of self-contained units (think buttons, forms rendering properly, etc). You'll probably find yourself writing a lot of smoke tests if you're doing it right.

**When you write each test, you want to ask yourself key questions** to remind you of the very purpose of what you're doing, such as:

1. Will this test break when there's a mistake that could break the component? Hint: it _should_. Just because a test is easy to write and does the job, does not mean it will stand the test of time (and future releases).
2. Will this test pass during refactoring or major changes to the component, despite it being backwards compatible? If your unit tests break during a refactoring, it's a sign that you need to rethink your approach.

It may help to have these written on a post-it note when writing tests, as sometimes it's easy to lose sight of what to test as you jump from component to component.

Similarly, when you're using things like `instance()` or `state()` in your tests, it might be an indication that you're going about things the wrong way. These are things that the user has no idea about, nor should they. This brings us to the very important point that **you should not test implementation details**.

While I love writing unit tests, if I'm being frank, good unit test writing is seen as a bit boring by many developers. In a way, I feel like it's the inherent nature of testing. It's more about taking pride in the fact that you have confidence in the code you are writing, and quality control is often associated with thorough, repetitive work. It's a beautiful thing in its own right. :)

We can make some of that monotonous work a bit less so by using some of Jest's built-in [setup and teardown](https://jest-bot.github.io/jest/docs/setup-teardown.html) helper functions. A good way to use these, for instance, is for debugging a failing test by logging data, which you could do with `beforeEach`.

In the following few posts, we'll talk about how to test specific things like React hooks, how integration tests compare to unit and E2E tests, and much more.

References

- [Testing Components with Jest and React Testing Library](https://itnext.io/testing-components-with-jest-and-react-testing-library-d36f5262cde2) by Chris Girard
- [How to Write Functional Tests in React](https://blog.echobind.com/writing-functional-tests-with-react-testing-library-part-1-470870ee1a6) with Jeffrey Zhen
