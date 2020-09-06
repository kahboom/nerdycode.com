---
title: "NPM Hangs on Network Step"
date: "2016-03-28"
path: "/debugging-npm-hangs-network"
tags: ["npm"]
---

If you've been the victim of NPM hanging during inopportune moments at work, you're not alone. Up until a few weeks ago, NPM had an issue where it would run multiple concurrent connections and overwhelm the network. Eventually it just stops responding. While there is retry functionality in the code, it hangs before ever reaching it. With SSL involving more communication, it increases the likelihood of reaching that saturation point.

You may be happy to hear that this issue has just been resolved in NPM maybe two weeks ago (v3.8.0), so if using the HTTPS registry for NPM is important to you, it should work okay now if you upgrade. You could also just keep the HTTP registry configuration setting for faster downloads if you don't need the SSL. Either way, here are the steps to take in the event that you are having this problem but do not want to (or can't) upgrade NPM, or are just completely bored and curious:

1 - If you're getting the issue while working with global packages and happen to be running OS X, you may want to eliminate the possibility that your NPM installation is being problematic. [This](https://gist.github.com/DanHerbert/9520689) is a good guide to follow, but will require you to uninstall and reinstall NPM. Even if you are not using global packages, it may be worth a shot.

2 - Run the following to use the http registry for NPM:

```
$ npm config set registry http://registry.npmjs.org/
$ npm config set strict-ssl false
$ npm install -dd
```

The `-dd` is for debugging mode

Every time before you run '`npm install`' remember to do the following to start with a "clean" slate:

```
$ rm -rf node\_modules
$ npm cache clean
$ npm install -dd
```

While debugging always try disconnecting from any VPN first until you're able to resolve any problem you may be having.

The issue has been resolved in NPM by limiting the maximum number of concurrent open sockets to 50 (because it was 'Infinity' before). These steps seemed to help a few people I ran into on GH, so I thought I'd share. Hope this helps!
