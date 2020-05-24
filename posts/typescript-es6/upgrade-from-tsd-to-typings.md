---
title: "Upgrade from TSD to Typings"
date: "2016-02-26"
layout: layouts/post.njk
---

As you may or may not know, **TSD** was recently deprecated, and the author has recommended that users switch to **Typings** instead. Luckily for us, it's something that can be done in just a few easy steps. I've outlined them below:

**Step 1:** Remove \`typings\` dir.

`$ rm -rf typings`

**Step 2:** Uninstall TSD.

`$ npm uninstall tsd --save`

**Step 3:** Install Typings.

`$ npm install typings --save`

**Step 4:** Upgrade TSD JSON file to Typings JSON file.

`$ typings init --upgrade`

**Step 5:** Remove \`tsd.json\` file locally

`$ rm tsd.json`

Typings will automatically resolve ambient definitions for you that were previously installed using TSD. Let me know if this helped you by leaving a comment below! :)
