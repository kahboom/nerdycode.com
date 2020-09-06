---
title: The Testing Pyramid
date: "2019-06-26"
path: "/testing-pyramid"
tags: ["testing"]
---

[](https://github.com/kahboom/dev-notes/blob/master/topics/react-testing.md#testing-pyramid)

The Testing Pyramid is a visual aid used to find the right balance of test types. Here are some notes about how it works and suggestions I've collected over time:

- The bulk of your tests are unit tests at the bottom of the pyramid. As you move up the pyramid, your tests gets larger, but at the same time the number of tests (the width of your pyramid) gets smaller.
- Google suggests a 70/20/10 split: 70% unit tests, 20% integration tests, and 10% end-to-end tests. The exact mix will be different for each team, but in general, it should probably retain that pyramid shape. The key thing is to avoid these anti-patterns:
    - **Inverted pyramid/ice cream cone**. Mostly end-to-end tests, few integration tests, and even less unit tests.
    - **Hourglass**. A lot of unit tests, then many end-to-end tests where integration tests should be used. The hourglass has many unit tests at the bottom and many end-to-end tests at the top, but few integration tests in the middle.
- E2E tests are useful, but should be the least number of tests of its kind that you write. Focusing on quality over quantity is the most valuable thing you can do.

[![Google Testing Pyramid](https://camo.githubusercontent.com/8dcb95b5f7bd28a7675b73bdc1b0cd4ad4a515f8/68747470733a2f2f322e62702e626c6f6773706f742e636f6d2f2d59547a765f4f34546e6b412f56546765786c756d5031492f4141414141414141414a382f35372d726e7779765036672f73313630302f696d61676530322e706e67)](https://camo.githubusercontent.com/8dcb95b5f7bd28a7675b73bdc1b0cd4ad4a515f8/68747470733a2f2f322e62702e626c6f6773706f742e636f6d2f2d59547a765f4f34546e6b412f56546765786c756d5031492f4141414141414141414a382f35372d726e7779765036672f73313630302f696d61676530322e706e67)

Photo credit: [Google Testing Blog](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)

- From easiest to most difficult to write: snapshot, unit, integration, E2E
- From least to most important*: snapshot, unit, integration, E2E

_* where the level of importance is directly proportional to the confidence you have that your tests are reflective of your app working as intended_

In the next few blog posts I'll be discussing each type of testing and recommended best practices, specifically for React applications.

References:

- [No To More E2E Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html) by Mike Wacker, Google Testing Blog
- [TestPyramid](https://martinfowler.com/bliki/TestPyramid.html) by Martin Fowler
- [The Testing Trophy](https://twitter.com/kentcdodds/status/960723172591992832/photo/1?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E960723172591992832&ref_url=https%3A%2F%2Fkentcdodds.com%2Fblog%2Fwrite-tests) by Kent C. Dodds
- My [notes](https://github.com/kahboom/dev-notes/blob/master/topics/react-testing.md) on GitHub
