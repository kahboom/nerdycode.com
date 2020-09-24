---
title: Camel K
eleventyExcludeFromCollections: true
date: 2020-09-22
permalink: "/camel-k/"
dynamicPermalink: false
layout: post.njk
tags:
  - camel-k
---


Anyone architecting enterprise software worth its weight knows that there is no such thing as a one-size-fits-all solution for data-driven organizations. Trends in software are reflective of this as middleware and embedded systems have been reinvented and expanded to become more broken up or "componentized".

These components, usually in the form of services or containers, can communicate and exchange data using an enterprise service bus (ESB) or messaging system, respectively.

We've generally observed a move away from service-oriented architecture (SOA) and the enterprise service buses (ESBs) that coordinated and controlled its services, and toward a world of microservices with services that function independently of one another. With this, we've discovered that containerization is better suited to our newfound demands of easy and rapid scalability over its virtualization predecessor.

I'll assume that you're already more or less familiar with the general concept of containers, but the gist of it is that each service gets deployed in a self-contained unit of software we know as a container, which means it _contains_ (get it?) *everything* it needs to run successfully (e.g. dependencies, libraries). You may use something like Kubernetes or OpenShift (or its free counterpart, OKD) to help orchestrate these containers, or manage them.

## With great power comes great responsibility

Because we don't have the same convenience of shared data and common governance that we had in service-oriented architecture, communication of data is typically done via REST APIs and simple messaging, such as Java Messaging Service (JMS). And, well, because data can be quite complicated, even in small quantities, we typically use specialized platforms to aid us.

We previously discussed how Apache Camel helps developers to work with data in a message-oriented fashion.

## What about containers?
This is all fascinating, but how does it fit into our new shiny world of containers? This very 

Enter Camel K

Camel K essentially takes the toolkit of Camel and runs it natively on Kubernetes, in a version specifically designed for serverless and microservice architectures.

(Users of Camel K can instantly run integration code written in Camel DSL on their preferred cloud, using Kubernetes or OpenShift).

Early this year it plans to add new tools including a Kafka Connector and Camel Spring Boot (moved out from main repository) — an open source Java-based framework used to create microservices that was developed by Pivotal.


Here's a quick overview of how it works..


## Do I need to know Java?

## How do I get started?


Otherwise, you'll be running something like this in your terminal:

```bash
kamel run Example.java --dev
```

Where `--dev` will just tail the log for you, and you'll get a bit more information.
