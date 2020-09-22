---
title: Preventing npm from Executing Arbitrary Scripts
date: 2020-09-22
dynamicPermalink: false
permalink: "/prevent-npm-executing-scripts-security/"
layout: post.njk
references:
    - {title: 'Package install scripts vulnerability', url: 'https://blog.npmjs.org/post/141702881055/package-install-scripts-vulnerability', note: 'npm blog'}
    - {title: 'Predicting the Future of Web Development', url: 'https://www.youtube.com/watch?v=24tQRwIRP_w'}
    - {title: 'Auditing package dependencies for security vulnerabilities', url: 'https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities', note: 'npm blog'}
    - {title: 'Compromised version of eslint-scope published', url: 'https://status.npmjs.org/incidents/dn7c1fgrr7ng', note: 'npm Incident Report'}
tags:
  - npm
  - security
---

In 2016, npm disclosed the discovery of a vulnerability that essentially allows npm packages to execute potentially malicious code on your machine. This vulnerability is potentially more harmful than running something like a bash script on your machine, because while a bash script will execute arbitrary code on your machine, npm executes arbitrary code on your machine from hundreds, if not thousands, of packages.

One example of this attack is an incident that occurred with the popular <a href="https://www.npmjs.com/package/eslint-scope" rel="nofollow" target="_blank">eslint-scope</a> package. A new version of the package was published that contained malicious code via a `postinstall` lifecycle hook. The same applies for `preinstall`, `preuninstall`, and `postuninstall` hooks.

Unfortunately, there is no straightforward way to fix this issue, as it's an inherent part of the lifecycle hook, an important feature of npm. As such, that vulnerability is still there and will likely continue to be into the foreseeable future. The only thing you can do, should you wish to continue to use npm, is to disable running scripts by default, but this doesn't come without its own issues, as we'll see.

If you run `npm config list`, you'll get a list of npm configuration settings you've added at some point. Append `-l` to that command and you'll get all configuration default values.

By default, if you were to run `npm config list -l` on your system right now, you'll see that `ignore-scripts` is set to `false`. What you need to do is set this to `true` by running the following:

```bash
$ npm config set ignore-scripts true
```

This will prevent NPM from automatically running scripts, including these lifecycle hooks like `postinstall`, when you install a third-party dependency. npm derives its configuration settings from the command line, environmental variables, and the `.npmrc` file. In other words, you could always set it at `~/.npmrc` if you would like for this setting to apply globally.

The problem with the above solution is that then you will not be able to run npm scripts in your `package.json`. If your dependencies need to run scripts, such as to install binaries, then changing this setting could completely break your build. This is, in fact, one reason why npm does not disable this setting by default, as they consider it to be a trade-off of the convenience of using npm scripts and lifecycle hooks. The worst part about this is that npm will fail silently without even giving you a warning.

Instead of disabling it globally, you could run this command when you are installing dependencies, like so:

```bash
$ npm install --ignore-scripts
```

By the way, if you use an alternative CLI, such as Yarn, it likely uses its own configuration settings, so you would need to set it there as well:

```bash
$ yarn config set ignore-scripts true
```

You can verify the changes with `yarn config list`, or see the changes on `~/.yarnrc`. 

Here's the caveat. This will prevent running the scripts when you are installing dependencies, but will also disable npm's ability to run scripts completely. If you run into any issue of `npm run` not doing anything, this could likely be the culprit, and you'll have to re-enable this setting again. For some, the piece of mind you get with disabling scripts is worth it to switch back and forth between enabling/disabling. If you wanted you could even create a more memorable alias for the command, such as in your `.bashrc` or `.zshrc`.

This configuration setting could be a workaround if your dependencies do not need to run scripts, which is not always the case. Moreover, you cannot truly expect the package you installed to be 100% functional, because we don't always know what it, or its dependencies, are attempting to run in `postinstall`, and whether or not it was necessary.

Unfortunately, npm does not allow for you to disable scripts for a specific dependency either, however, there is also the option to include an `.npmrc` file within your project to override this configuration setting per project. It turns out it's much easier to simply disable your own scripts, but not those of dependencies. If you do happen to know of a dependency that you trust and that needs to run a `preinstall` or `postinstall` script (`node-sass` being a good example of this), you could use a solution like this:

```bash
$ npm install --ignore-scripts && ( cd ./node_modules/nose-sass && npm run install )
```

And then in your `package.json` you can add this to a script, to make it easy to run:

```json
{
 "scripts": {
    "noscriptinstall": "npm install --ignore-scripts && (cd ./node_modules/nose-sass && npm run install)"
  }
}
```

And you'd run `npm run noscriptinstall`. In the specific case of `node-sass` you could probably get away with simply running `npm rebuild node-sass`. This will leave your `package.json` file intact, but you'll get the native dependencies built. This is not a solution for most cases though. So, if that's the case for you, I'd recommend looking into one of the solutions mentioned above.

When we run `npm install`, under the curtains npm also runs a security audit on the dependencies being installed. We can also run this command manually ourselves:

```bash
$ npm audit fix
```  

npm submits a description of the packages to your registry, asking for a report of any known vulnerabilities. Subsequently, it will install any compatible updates to vulnerable dependencies. Direct dependencies, dev dependencies, bundled dependencies, and optional dependencies are all checked, however, peer dependencies are not. You can also do a dry run to see what it will do before you commit to having it upgrade anything automatically

```bash
$ npm audit fix --dry-run
```

While I don't consider any of these solutions to be ideal, I hope this helps you better understand these hooks and will get you thinking about whether or not you should really include certain packages in your project. Always review dependencies carefully, use a lockfile to prevent automatically upgrading packages unnecessarily, and remember, it's not just those packages that you are trusting, but the entire dependency tree as well.
