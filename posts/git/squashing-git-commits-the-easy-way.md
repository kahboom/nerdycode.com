---
title: "Squashing Git Commits the Easy Way"
date: "2016-03-16"
layout: layouts/post.njk
---

We hear it all the time, "Keep your git history clean." This mantra used to annoy me beyond belief, but it's one of those things you _know_ you need to do. I vowed to become better at committing going into the future, because, as it turns out, the following is not considered a very professional or useful commit:

🍕  $ git commit -m "Please work this time"

That gem actually landed as the first visible commit on a major release my team was doing, as it just so happened to be the most recent (and desperate). It's a good thing they just thought it was funny. Demo driven development FTW!

I've loved and hated git for as long as I can remember because it's so capable, but can also get pretty complex rather quickly when you _actually_ try to understand it or get outside of your day-to-day workflow with it.

Naturally, being the lazy developer I am, I wanted to keep my git history clean and follow Best Practices™️, but I also wanted to do it as efficiently as possible. You probably already know that no respectable open source project would merge (or possibly even review) a PR with a spaghetti and meatballs git history. You want your commits to be clear, concise, and, therefore, easier to review.

This is what I do and it seems to keep me out of trouble:

🍕  $ git rev-list --count HEAD ^upstream/master
7
🍕  $ git rebase -i HEAD~7 # where 7 is how many commits you want to squash via a rebase

A lot of assumptions are made here:

1. You're on a feature branch and eventually want to merge that feature branch into an upstream `master` branch.
2. You have an upstream repository your fork is based off of, that you'll eventually create a PR for. If you're already on your primary fork, you can just do `git rev-list --count HEAD ^origin/master` instead.
3. We're just gonna assume your fork's `master` branch is not up-to-date with the upstream `master`. (If it is, you can just do `git rev-list --count HEAD ^master` instead).

The first command simply compares the number of commits on your feature branch in comparison to your upstream master branch. You should always choose that number or lower, anything higher and you risk squashing into other people's commits (a big no no).

The second command just tells git to rewrite the current branch's history with respect to itself. As stated in the comment above, you need to replace the "7" with the number you got with the previous command, or the number of those commits you'd like to squash.

When you run this command, you'll then go into interactive rebase mode. Please note that I'm fully assuming you are familiar with vim, emacs, or whatever you use and will not freak out when this happens. If you do, you can always just exit with `$ q!` and it shouldn't save any changes. PS: I use vim and, no, I do not need to justify why. ;P

Here's an example of me working on my `dev-notes` repo, where I'm comparing my own remote repo's master branch with my local copy, and see that it's ahead by three commits:

 🍕  » dev-notes $ git status
On branch master
Your branch is ahead of 'origin/master' by 3 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean

 🍕  » dev-notes $ git rev-list --count HEAD ^origin/master
3

Let's see what these commits are and if I can squash them:

 🍕  » dev-notes $ git rebase -i HEAD~3
 # Enter interactive rebase mode

Once in interactive mode, you'll see a list of commits at the top (more specifically, a list the length of the number you specified above). At the far left of each commit you'll see the word "pick". This means this commit will be included in your git history. Your goal now is to go through each of these and decide which to keep (or "pick"), "squash", or "fixup" (same as "squash" except you remove the commit message).

pick 3251ccd Add some notes on React testing
pick a797af0 Add reusable checklist
pick 95525f9 Minor changes

# Rebase fe9787d..95525f9 onto fe9787d (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge \[-C <commit> | -c <commit>\] <label> \[# <oneline>\]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out

The very first commit is the one I want, and even though I want the changes for the second and third commits, I don't want that dumb message for the second on there (fixup, please).. Why is this such a common placeholder message for us devs?! Anyway, let's get rid of that stupid message, continue to follow the instructions and save our changes with good 'ol `:wq!`:

pick 3251ccd Add some notes on React testing
s a797af0 Add reusable checklist
f 95525f9 Minor changes

And, finally, when you're done you should see something like the following::

 🍕  » dev-notes $ git rebase -i HEAD~3
Successfully rebased and updated refs/heads/master.

### What about committing early and often?

Yes, still do this.

Don't confuse the two practices. Commit early and often, and later squash the _hell_ out of your commits to make your git history easier to understand. In other words, there was nothing inherently wrong with my _"Please work this time"_ commit message, I just needed to squash it into another, more useful commit and give it a better description of what that group of commits does.

### How many git commits should I squash down to?

Theoretically, the ideal number should be 1. That's only because your PR should probably only fix one bug / add one feature or enhancement. Anything else should require a separate PR. In the real world, we know this isn't always possible.

If you have more than one thing you're working on in your PR, like "fix something" and "add something else", then you should probably have one commit for each thing worth mentioning (two in that example). Think of it this way--you have a couple of minutes in a standup meeting to describe what you did today, which happened to be the work from your PR. How will you summarize that?

Hope this helped someone. If you have any feedback or questions, drop them below. :)
