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

Unfortunately, there is no straightforward way to fix this issue, as it's an inherent part of the lifecycle hook, an important feature of npm. As such, that vulnerability is still there and will likely continue to be into the foreseeable future. One solution is to disable running scripts by default, but this doesn't come without its own issues, as we'll see.

## Ignoring npm Scripts

If you run `npm config list`, you'll get a list of npm configuration settings you've added at some point. Append `-l` to that command and you'll get all configuration default values.

By default, if you were to run `npm config list -l` on your system right now, you'll see that `ignore-scripts` is set to `false`. What you need to do is set this to `true` by running the following:

```bash
$ npm config set ignore-scripts true
```

Because npm derives its configuration settings from the command line, environmental variables, and the `.npmrc` file, you could also set it at `~/.npmrc` if you would like for this setting to apply globally. This will prevent NPM from automatically running scripts, including these lifecycle hooks like `postinstall`, when you install a third-party dependency.

By the way, if you use an alternative CLI, such as Yarn, it likely uses its own configuration settings, so you would need to set it there as well:

```bash
$ yarn config set ignore-scripts true
```

You can verify the changes with `yarn config list`, or see the changes on `~/.yarnrc`. 

The problem with the above solution is that, well, it prevents npm from running scripts, including those defined in your `package.json`. Moreover, if your dependencies need to run scripts, such as to install binaries, then changing this setting could completely break your build. This is, in fact, one reason why npm does not disable this setting by default, as they consider it to be a trade-off of the convenience of using npm scripts and lifecycle hooks. The worst part about this is that npm will fail silently without even giving you a warning.

Instead of disabling it globally, you also could run this command when you are installing dependencies, like this:

```bash
$ npm install --ignore-scripts
```

This configuration setting could potentially be a workaround if your dependencies do not need to run npm scripts, but that's not usually the case. Moreover, even if you don't see any immediate errors, you cannot truly expect the package you installed to be 100% functional, because we don't always know what it, or its dependencies, are attempting to run in `postinstall`, and whether or not it was actually necessary.

If you run into any issue of `npm run` not doing anything, this could likely be the culprit, in which case you'll have to re-enable this setting again. For some, the piece of mind you get with disabling scripts is worth it to switch back and forth between enabling/disabling. If you wanted you could even create a more memorable alias for the command, such as in your `.bashrc` or `.zshrc`.

Unfortunately, npm does not allow for you to disable scripts for a specific dependency either, however, there is also the option to include an `.npmrc` file within your project to override this configuration setting per project.

## Disabling Your Own Scripts

It turns out it's much easier to simply disable your own scripts, but not those of dependencies. If you do happen to know of a dependency that you trust and that needs to run a `preinstall` or `postinstall` script (`node-sass` being a good example of this), you could use a solution like this:

```bash
$ npm install --ignore-scripts && ( cd ./node_modules/nose-sass && npm run install )
```

And then in your `package.json` you can add this to a script, to make it a bit easier to run:

```json
{
 "scripts": {
    "noscriptinstall": "npm install --ignore-scripts && (cd ./node_modules/nose-sass && npm run install)"
  }
}
```

And you'd run `npm run noscriptinstall`.

In the specific case of `node-sass` you could probably get away with simply running `npm rebuild node-sass`. This will leave your `package.json` file intact, but you'll get the native dependencies built. This is typically a workaround specifically for node-sass, but it may be worth putting it out there in case you'd like to give it a shot with another package.

### Conclusion

Unfortunately, packages are not manually verified like they are in, for instance, mobile app stores because it's not really cost-effective for npm to do, so it's really up to you to take additional safety measures. You shouldn't be _completely_ alarmed if none of the previously mentioned workarounds are an option for you, though.

When we run `npm install`, npm also runs a security audit on dependencies under the curtains with `npm audit`, including your dependency's dependencies. If you'd like to run this manually without actually upgrading any packages, you can do a dry run:

```bash
$ npm audit --dry-run
```

This can actually result several hundred, if not thousands, of vulnerabilities, depending on how big the dependency graph is. A better idea might be to first _only_ install packages that your actual code is using, as opposed to at build time:

```bash
$ rm -rf node_modules
$ npm install --only=prod
```

These are the vulnerabilities that would be more relevant, because they're from packages that your users will more likely be using. Depending on how many vulnerabilities are left over (most will probably be from dev mode), it may just be a case of npm making a couple of changes to `package.json` that are non-breaking. This is probably a good time for me to remind you of the importance of [writing E2E](https://www.nerdycode.com/e2e-testing-react-cypress/) and [unit tests](https://www.nerdycode.com/unit-testing-react-guide/), specifically for a production environment. Better yet, check out a new branch and do the upgrades there, so that if there are any issues, or if any of your tests fail, you can easily downgrade them back and sort them out individually. 

If npm kindly resolved some of those dependencies for you, you may be able to submit a quick PR for it so others don't run into the same issue. If many vulnerabilities are coming from the same package, this is more of a sign of neglect from the maintainers, and it may not be the worst idea to look for an alternative library, or roll out your own if you're up for it.

While I don't consider any of these workarounds to be ideal, I hope this helps you better understand these lifecycle hooks and that it will at the very least get you thinking about whether or not you should really include certain packages in your project. Considerations should apply to both client-side apps like React and Node.js-based API servers.

As always, review dependencies carefully, use a lockfile to prevent automatically upgrading packages unnecessarily, and remember, it's not just those packages that you are trusting, but the entire dependency tree as well.
