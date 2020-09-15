---
title: "Snapshot Testing in React"
date: "2019-06-29"
layout: post.njk
permalink: "/snapshot-testing-in-react/"
dynamicPermalink: false
tags:
  - react
  - testing
---

So you're setting up your testing suite and start running into something called "snapshot tests," not knowing exactly what they are and whether or not you should be using them. So, what exactly are snapshot tests? Straight from the Jest docs:

> A typical snapshot test case for a mobile app renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.
> 
> [Jest docs](https://jestjs.io/docs/en/snapshot-testing)

One of the biggest benefits of using snapshot tests is that you can implement your tests much more quickly. The way that it works is that a snapshot file gets generated whenever you run your test, and that file gets committed along with the rest of your code. As such, **you should always treat your snapshots as code**.

What I sometimes don't like about snapshot testing is that **they're often used to test implementation details**. As a result, refactoring and enhancements going into the future can cause you more technical debt than your future self is willing to deal with. Not to mention, the false negatives (stale failing tests for code that works properly) you can run into are enough to convince any contributor of your project that your tests are unreliable.

So, what then? For the most part, you can test the things you are using snapshots for with old-school assertions in unit tests. Sure, they're not as much fun, but they're useful, straightforward, and can be relatively resilient when written with the future in mind.

Having said that, if you're set on snapshots, that's okay, too. As it turns out, besides making it easy to get started with your tests, they can actually be quite useful. Some things, such as error logging and testing styling, are great candidates for snapshot testing. If you're still on the fence about it, just give it a shot--worst case scenario, you can always change it to an assertion in the future.

Alright, so then what should we be using for these snapshot tests? [Jest](https://jestjs.io/docs/en/snapshot-testing.html) can create snapshot files for you OOTB. In addition, you may find that you want to convert your React components to pure JS objects so that you can then use them for your snapshot. For that, there's always [React Test Renderer](https://reactjs.org/docs/test-renderer.html), which does the job without using a browser or jsdom.

Example of a component that renders hyperlinks, borrowed directly from the docs:

```js
// Link.react.js
import React from 'react';

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

export default class Link extends React.Component {
  constructor(props) {
    super(props);

    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onMouseEnter() {
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave() {
    this.setState({class: STATUS.NORMAL});
  }

  render() {
    return (
      <a
        className={this.state.class}
        href={this.props.page || '#'}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
      >
        {this.props.children}
      </a>
    );
  }
}
```

Snapshot test:

```js
// Link.react.test.js
import React from 'react';
import Link from '../Link.react';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
```

When the test is run with `yarn test` or `jest`, a file gets created. Oh, snap! You just created your snapshot file
. :) In this case, it'd be named something like `__tests__/__snapshots__/Link.react.test.js.snap`.

So, in sum, snapshots can be both useful and fun to work with when you want fast, easy test coverage. As with anything else, just don't use them as a crutch. One of the biggest challenges in web development is knowing when to pick the right tool for the right job.

<div class="references-block">
References:

- [Snapshot Testing with Jest](https://jestjs.io/docs/en/snapshot-testing)
</div>
