---
title: "Using GitHub Projects and Cards for Project Management"
date: "2016-09-16"
path: "/using-github-projects-cards-project-management"
tags: ["github"]
---

### It’s a whole new GitHub universe with these simple project management-like features..

GitHub has released a set of features that I’ve found very helpful for making the development cycle easier and more efficient. My friend [@MarcSavy](http://www.rhymewithgravy.com/) kindly sent me a link to [this](https://www.github.com/universe-2016) and pointed out the latest post on the [GitHub Blog](https://www.github.com/blog), which summarizes these amazing features. I’ve been using them ever since and have found them incredibly useful, so I wanted to share how I was using them for a project I’m currently working on.

In fact, I’ve gone a little crazy with them.

* * *

### Projects

So, this one was a bit confusing for me to get used to, since I typically refer to repositories I’m working on as “projects”. What I did here was I broke down the issues into two separate “projects”, which is how I typically work — UI first, then implementation of the logic. I’ve done it the other way around several times before, but find that it tends to be more productive this way with design changes, feature additions, etc. Again, it depends on the way you manage projects and design applications; there is no right or wrong here. You just need to figure out what works best for you. In my case, I created a “project” for the UI and a “project” for the Logic, since, again, I work on them separately. If I were also doing the designs for this project, erhmm repository, or collaborating with the designers via GitHub, it’d make sense to also create a Design “project”, one for Testing if I were responsible for QA/QE, etc. You get the idea. You can click and see which columns I created, and how I’m tracking the issues.

[![GitHub Projects Feature](/img/post/2016-09-15-09.36.50.png)](https://github.com/hawtio/hawtio-ipaas/projects)

* * *

### Cards

Probably my favorite new feature is the addition of Kanban-style cards. I’m basically adding a card for each issue, along with columns to organize the development process. I created the columns in each project according to what makes sense for me: Technical Debt, Queue, In Progress, Testing, Code Review, and Release Candidate. The drag-and-drop feature is really cool and helps puts things into much better perspective for me.

There is also the addition of Notes, which are exactly what you’d expect: notes. These can be surprisingly useful for issues that are not a part of this specific repository (e.g. a third-party agency is taking care of something related that is managed elsewhere, an issue from another repository that can’t be added directly as a card, etc). A colleague of mine made a great point that adding automatically generated notes for the CD pipeline would be a great idea as well. Still contemplating how/if I should use PRs as cards in this workflow, maybe in the Code Review column. The possibilities are endless, endless I tell you!

* * *

### Labels

So, labels and milestones (below) are not new features at all, but I thought it’d be helpful to show how I’m using these in conjunction with the aforementioned features. Considering we still have labels, I chose to add the following: never gonna happen, high priority (didn’t make a low priority tag since those issues would probably in the Technical Debt column anyway), major component, research, and tests (although I may consider deleting this; it’s common to use a label like this for a QA/QE team, but not sure if that will be as useful here).

[![GitHub Labels Example](/img/post/2016-09-15-09.39.21.png)](https://github.com/hawtio/hawtio-ipaas/labels)

* * *

### Milestones

As for sprints, I created a milestone for each sprint planned. I think milestones are a great way to organize sprints since they actually have deadlines and make it easy to filter issues.

[![GitHub Milestones Example](/img/post/2016-09-15-09.39.41.png)](https://github.com/hawtio/hawtio-ipaas/milestones)

I’m ecstatic about these new features, and these are just the few that really stood out to me, since I’ve been hoping for improvements to GitHub issues for a long time now. The code review feature is yet another thing I’m especially excited about. I’m still using BitBucket for certain projects, especially considering that you get free unlimited private repositories among other convenient features, but this makes using GitHub so much better. This is one area that I have felt GitHub has been lacking in for a long time, so it’s a _very_ welcome change.

_What do you think about these new features? Will you be using them to help track your work, or will you continue to use something else, like JIRA?_
