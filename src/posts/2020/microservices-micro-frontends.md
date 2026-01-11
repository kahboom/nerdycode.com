---
title: Microservices and the Rise of Micro Frontends
eleventyExcludeFromCollections: false
date: 2020-12-16
permalink: "/microservices-micro-frontends/"
dynamicPermalink: false
layout: post.njk
image: /img/post/microservices/meta.jpg
description: "A brief look at how microservices have given way to the popularity in microfrontends, the differences between them, and when to use them."
references:
- {title: 'Clean Architecture: A Craftsman’s Guide to Software Structure and Design', url: 'https://learning.oreilly.com/library/view/clean-architecture-a/9780134494272/', note: 'Robert C. Martin'}
- {title: 'Evolution of business logic from monoliths through microservices, to functions', url: 'https://read.acloud.guru/evolution-of-business-logic-from-monoliths-through-microservices-to-functions-ff464b95a44d', note: 'Adrian Cockcroft'}
- {title: 'Micro Frontends', url: 'https://martinfowler.com/articles/micro-frontends.html', note: 'Cam Jackson'}
- {title: 'Microservices', url: 'https://martinfowler.com/articles/microservices.html', note: 'Martin Fowler'}
- {title: 'Monolithic vs SOA vs Microservices — How to Choose Your Application Architecture', url: 'https://medium.com/@saad_66516/monolithic-vs-soa-vs-microservices-how-to-choose-your-application-architecture-1a33108d1469', note: 'Saad Arshed'}
- {title: 'Patterns: Service-Oriented Architecture and Web Services (PDF)', url: 'https://www.redbooks.ibm.com/redbooks/pdfs/sg246303.pdf', note: 'IBM'}
- {title: 'Single Responsibility Principle', url: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html', note: 'Robert C. Martin'}
- {title: 'Service Oriented Ambiguity', url: 'https://martinfowler.com/bliki/ServiceOrientedAmbiguity.html', note: 'Martin Fowler'}
- {title: 'What Is Service-Oriented Architecture?', url: 'https://medium.com/@SoftwareDevelopmentCommunity/what-is-service-oriented-architecture-fa894d11a7ec', note: 'Software Development Community'}
- {title: 'Why We Need a New Breed of Hybrid Microservices Platform', url: 'https://dzone.com/articles/why-we-need-a-new-breed-of-hybrid-microservices-pl', note: 'Tal Doron'}
tags:
- architecture
- micro-frontends
- web-dev
---

Microservices have exploded in popularity within the past five years or so, and along with that we've seen an interest in applying these concepts to our frontend applications.

The definition of a microservice can vary from person to person, but the premise is quite simple--_an architectural style consisting of a collection of distinct, autonomous services, each responsible for a specific thing_.

The difference between microservices and micro frontends is that micro frontends are specific to the user interface. The result, from a user's perspective, is a _single_, composed user interface.

But what exactly is it that caused the popularity of microservices in the first place? And can that help us better understand when and how to use micro frontends?

## The Evolution from Monoliths

Though microservices have been around for a long time, it was really monolithic applications that used to take center stage. **Monolithic applications** (or, monoliths for short) are applications that are completely self-contained and independent from other software. They're built as a single unit.

Monoliths aren't as bad as people make them out to be, and many big organizations like Etsy have been pretty successful with them.

The problem with monoliths is that people will tend to abuse them. Even with solid practices like following a modular structure and establishing boundaries around those modules, it's just too easy to sneak around those boundaries. Eventually, they can become ginormous and a nightmare to maintain.

## Story Time!

Just imagine for a second that you are a very healthy eater and your goal is to lean up by the summer time. You've bought your bikini, you've bought your carrots--or whatever it is that healthy people buy--and you're ready to rock. There's just one problem. Your best friend is your roommate. The same best friend that bakes pastries and desserts for a living.

You know you're disciplined, but you're a bit worried that smelling freshly baked bread on Sunday mornings and chocolate cake in the evenings is going to throw you off your target. It's just _too easy_.

You might start incorporating some of your friend's less healthy ingredients into your food, and they might start using _your_ ingredients around the house for _their_ recipes. Nobody is going to want to buy your best friend's cakes if they're going to start substituting flour for powdered quinoa. Actually, I'm not sure I even want to be friends with them anymore. 😐

But if your best friend lived just across the street, it'd make it a lot _less likely_ that you'd give into temptation. You'd have to actually get dressed and go out of your way to go after that pack of cookies, instead of making do with the healthier snacks you already have at home.

You and your roommate sharing a house is the equivalent of two independent services sharing the resources of a monolithic application.

Healthy living is _your_ objective, and crafting tasty treats is _their_ objective. Putting the two of you together in a single space is likely to allow bleeding across the boundaries between the both of you, and _neither_ of you will be as effective in reaching your goals.

Software isn't all that different. Our goal should be to set ourselves up to fall into <a href="https://blog.codinghorror.com/falling-into-the-pit-of-success/" rel="nofollow" target="_blank">the pit of success</a>. And, indeed, the next step in the evolution of the monolith was all about slicing up our concerns.

## Divide and Conquer

Service-oriented architecture, or SOA, aims to remediate the problem of tightly bound monoliths by breaking them up into smaller chunks, or services, that provide some kind of business functionality.

This, in turn, allowed services to use different languages, and created a more polyglot world for programmers. SOA is commonly associated with web services, like SOAP. That's because web services are commonly the way SOAs are implemented, so that the services can communicate with one another.
 
This may sound similar to microservices, and it sort of is, but SOAs tend to focus on a _common_ communication layer across the system, by using something like an **enterprise service bus (or ESB)**. SOAs follow the "share-as-much-as-possible" approach, while microservices follow the "share-as-little-as-possible" approach.

![Traditional vs Microservices Approach](/img/post/microservices/microservices-vs-monolith-white-bg.png)

_NOTE: Both approaches can come in a variety of forms; this is a basic example for illustration only._

So, microservices make crossing boundaries a bit more difficult to do, because, when implemented correctly, they act as separate entities that encourage us to stay in our own lane.

### Separation of Concerns

The goal in many systems is to create flexibility and well-isolated components that are independent of one another, but what exactly does that mean? Are we talking about dividing things by _technical concern_ or by _business concern_?

Let's first talk about dividing things by technical responsibility. Data stuff goes with data stuff, user interface stuff goes with user interface stuff, right?

Well, if we want to apply Separation of Concerns to a monolith, we'll end up with somewhat of a traditional tier architecture where you have a layer for your data, a layer for your backend, a layer for your frontend, and so on. Each tier is divided by its respective technical concern, and we end up with a more **modular** structure.

### Single Responsibility Principle

But we haven't addressed one of the fundamentals in this system, and that's the _organizational design_. The first principle from SOLID, the **Single Responsibility Principle (SRP)**, states that a class should only have a single responsibility.

Robert Martin, the creator of this principle, later offers a different wording to make it a bit easier to understand:

>"Gather together the things that change for the same reasons. Separate those things that change for different reasons."

The Single Responsibility Principle is about _people_. The goal of following the principle is to _limit the impact of inevitable change_.

SRP aims to help us approach our code with business concerns as the focal point, and we do that by grouping things based on why they change and how often they change. Things we expect to change for different reasons might include use cases and the user interface.

When we do that, we start to slice vertically into those horizontal layers for each use case. Each slice has all the technical components in it that it needs to fulfill its responsibility, much like <a href="https://martinfowler.com/bliki/BoundedContext.html" rel="nofollow" target="_blank"><i>Bounded Contexts</i></a> in Domain-Driven Design.

What this does is it removes the need for separating the frontend and backend as dedicated teams. Instead, the frontend and backend share a common _boundary_ and responsibility that they work together to fulfill, independently of whatever is going on in the rest of the app.

This also means that each system will have its own data store, if it needs one at all. It's the equivalent of your best friend moving across the street. You stop relying on whatever she's brought back from the supermarket. And you start using your own peas and potatoes.

The important thing to understand here is that the vertical boundaries I'm referring to are directly related to the business concerns. If those business concerns are to reflect Conway's Law, then it stands to reason that it is also representative of the organizational structure as well.

>**Conway's Law**: _Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure._

So, while I'm referring to vertical boundaries and slicing of software and teams, in terms of _infrastructure_ it's quite different, and microservices will tend to be scaled horizontally. I think that distinction can be helpful to understand.

### What does this mean for micro frontends?

Earlier I mentioned that micro frontends are essentially the same as microservices, except that they also include the user interface. Well, _sort of_.

The idea of micro frontends is that your application is logically broken down into smaller, independent parts that are organized by team or functionality and later composed into a single UI.

How you choose to integrate these systems to get from pieces to an entire whole can vary. Following that, the final result doesn't change: from the user's perspective there is only one user interface. That it was broken into itty bitty pieces before they got there is something they _just don't care about_.

Ensuring that teams working independently with potentially different technologies and processes still results in a single cohesive product is, indeed, one of the challenges specific to working with micro frontends.

## Conclusion

We want to make it more difficult for us to step on each other's toes, but we also need to prevent ourselves from over-engineering and creating completely fragmented systems or siloed teams. It's a balance that needs to be reevaluated continuously.

Consider starting out with a monolith that follows the principles of SOLID and Separation of Concerns. You can always grow the system into independent units that can be deployed on their own, and eventually switch to micro frontends. As we've learned in the past, a simpler system will almost always be easier to work with.
