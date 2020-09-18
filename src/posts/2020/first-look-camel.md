---
title: First Look at Integrating Data with Apache Camel
date: 2020-09-15
permalink: "/data-integration-apache-camel/"
dynamicPermalink: false
layout: post.njk
references:
    - {title: 'Apache Camel Docs', url: 'https://camel.apache.org/docs/'}
    - {title: "Tom's Knowledge Base: Apache Camel", url: 'https://kb.tomd.xyz/camel.html'}
tags:
  - camel
  - integration
---

The world is becoming increasingly interconnected through a variety of data sources that often need to communicate with one another. These data sources can be anything from a web service such as Dropbox or Twitter, to a database or message broker like Apache Kafka. Sometimes we need to move data between these services, and sometimes we need to make changes to the data mid-way.

For instance, if the piece of data is a zip file, an action you may want to take on it is to unzip it. Or, if the data is coming from a web service such as, for example, Twitter, it's likely it will be in the standard JSON format that APIs usually provide, and it might contain something like ten of your most recent tweets.

If we wanted to take the output from Twitter, and make it do something on another service, like create a post on Facebook, we refer to that as **integration**. You are essentially connecting, or integrating, two applications (or services, or systems, or basically anything that provides some sort of output). You can integrate way more than just two data sources, but we'll keep it simple for now.

Businesses do this all the time. But because it's not always such a straightforward task, they will often use specialized platforms or frameworks that are created specifically to assist with integrating large quantities of data. Here, we'll discuss the capabilities that Apache Camel provides and why it matters to us.

## What is Apache Camel?
[Apache Camel](https://camel.apache.org/) is a powerful open source data integration platform created by the Apache Software Foundation (ASF). At this time of writing, it is the single most active ASF project by sheer volume of commits alone. Camel undoubtedly has a very healthy community of contributors and is one of the best choices for combining and transforming data. It acts as a kind of glue between the services you want to integrate. More importantly, it provides us with enterprise integration patterns, which we'll discuss in a moment.

First, I want to talk about the use of the term "enterprise" in the context of this article. Traditionally, enterprise is a term used to describe big business. With respect to software, I think it's important to note that these methods or techniques are not exclusive to large businesses, or to businesses at all. In fact, part of the motivation to write this article is to encourage other developers, including non-Java developers, to use these tools. Many techniques and technologies are first created for corporations and eventually become popularized amongst the tech-savvy general public and especially to software developers. The terms may become outdated, but we should be using these techniques when they make sense for us, because they are tried and tested on a much greater scale. 

## Enterprise Integration Patterns
The concept of Enterprise Integration Patterns was coined by The Gang of Four in their _Design Patterns_ book, and later popularized by Gregor Hohpe and Bobby Woolf in _Enterprise Integration Patterns_ in 2003.

Enterprise integration patterns, or EIPs, are accepted solutions to problems commonly encountered by architects. They are abstract enough to apply to most integration solutions, and, by design, it means they are not hard and fast solutions, but rather, approaches and ways to better organize our code. Well, you know, they're patterns.

An example of a pattern is the **Splitter Pattern**. This pattern is used to break up an element within a message into smaller pieces. For example, let's say that a message shows an order that a customer placed, and that order consists of individual items. With this pattern, we would split this order into those separate items. We can think of receiving the output, or our customer's order, as a **message**.

The basic premise of these patterns is that we should structure our system to be message-oriented, because it will make our lives much easier to do so. In other words, our sources of data should communicate with one another via a messaging system, and we are better equipped to handle them when implementing these patterns. This idea of a pattern language continues to be relevant today, specifically in cloud application development, internet of things, and integration. 

## How Does Camel Work?

At the core of Camel is its engine, which you communicate with using its own specialized language, or Domain Specific Language (DSL). The instructions you provide to Camel are known as Routes. Using a Route, you tell Camel where the message containing the data is coming from, what you want it to do with the data, and where the data needs to go.

Out of the box, Camel provides something called Components. These components are almost like templates for each data source. For instance, you might use a Twitter Camel component for when you want to specify Twitter as your data source. Camel provides many different types of components that are not just specific to web services, and in fact, Camel currently has [several hundred components](https://camel.apache.org/components/latest/) available. 😱

Remember those patterns we were talking about before? When we tell Camel what to DO with the data, we can use one of its components that follow these patterns. An example might be to split the data into multiple lines. Camel has a Component for this very common use case.

Once it gets your Route, Camel uses it to configure routing rules. These rules are then added to something known as a `CamelContext`. `CamelContext` is a collection of Component instances, or we can sometimes think of it as a collection of configured Components (this is not an actual definition, but could help to better understand the concept).

## When Should I Use Camel?

The short answer is, if you need to get data from point A to point B, but the data structure or protocol (e.g. http, ftp, jms) of each is different, or there are multiple senders/receivers, or lots of conditions on the data (i.e. only send x data if y happens), or it's anything but a simple A to B, then yes, it's for you.


## How Do I Get Started?

To get started with Camel, you first add the libraries. You can alternatively use one of the quick starts they have available.

Next step: Write your integration flow using the Camel DSL (Routes) using your choice of components (data sources) and patterns. Want to start with the Twitter example we discussed before? Camel already has you sorted with a [Twitter Timeline](https://camel.apache.org/components/latest/twitter-timeline-component.html) component.

Final step, start Camel. You can do this programmatically (through written code), or if you're using a specific framework such as Spring Boot, then you probably already know that there is code that will do that for you.

Good luck and thanks for reading. In an upcoming post we'll be discussing how to use Camel with Kubernetes and OpenShift.


