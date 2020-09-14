---
title: "Setting up Angular with Webpack"
date: "2016-09-08"
layout: post.njk
permalink: "/setting-up-angular-with-webpack/"
dynamicPermalink: false
tags:
  - angular
  - webpack
---

For the purposes of this post, we'll be using the popular angular-webpack-starter project and going over the details of how it works.

### TypeScript

In order to understand how we are using Webpack, it is important to learn just the basics of TypeScript. There are many additional benefits to using TypeScript that I won't get into here, but for this project you need to know the following:

#### Basics of TS

- TypeScript is basically just JavaScript with optional static typing. Static typing enables the compiler to check that actions performed on variables are permitted, which allows for more efficient development.
- Type definitions are often provided by libraries to help you autocomplete. You have to download them or your IDE, task runner, or bundler may complain. This can be circumvented, but that's out of the scope of this post.
- TypeScript configuration happens in the `tsconfig.json` file.
- Linting for TS exists, just as it does for JavaScript, and that configuration goes in `tslint.json`.
- Auto generation of documentation for TS exists, just as it does for JS, and it's configuration options belong in `typedoc.json`.

If you've used Node.js before, you may find yourself confused about whether you should `require()` modules or `import {} from ''` them. The answer is that it depends on whether or not the library has type definitions available. Many times, you'll find yourself simply doing the following to pull in a SASS file: `require('./style.scss');` from files directly.

If you've used Browserify with Node.js before, you're in luck and will later see how we use Webpack to load and bundle our application files as well as third-party files into a single file that can be served on the client -- exactly as Browserify does. The difference is that Webpack is much more capable of handling the transpilation of TypeScript in conjunction with Angular 2.

### Webpack

Webpack is the most important technology being utilized in this project, since it is responsible for many things, such as loading Angular and other dependencies, bundling them, and serving them. It serves a wide variety of purposes that we won't dive into here.

Typically, Webpack has two different ways of being given configuration options -- via the Node.js API or the Webpack CLI. This project uses the CLI. You can see that the main configuration file located in `[/config/webpack.common.js]('../config/webpack.common.js')`, which, in its most basic form, looks something like this:

```js
module.exports = {
// configuration
};
```
It's basically a Node.js module that accepts a bunch of configuration options. For more information on each of those options, you can refer to the Webpack Config docs [here](http://webpack.github.io/docs/configuration.html).

In our case, we use the `entry` option to pass in a polyfill, then some third-party dependencies, and, finally, our Angular application. Therefore, if you'd like to include a third-party dependency, the file referenced in this option, `vendor.browser.ts` is the place to do it. If you'd like to do Angular-related things, you'd follow the "main" file, located in `/src/main.browser.ts`, which will lead you to all things Angular.

### Angular 2

You'll enter Angular world from the `./src/main.browser.ts` file. You'll notice that a file is imported at the top --

```js
import {AppModule} from './app';
```

-- and that some bootstrapping is done, just as with Angular 1, even though it may look a little different. If you open up that file, you'll see that it is quite a simple file, just importing our main Angular application like so:

```js
export * from './app.module';
```

Now, the `app.module` file is where things really start to look strange. Angular 2 differs quite a bit from Angular 1, so you may want to check out some of the differences [here](https://dzone.com/articles/typed-front-end-with-angular-2).
