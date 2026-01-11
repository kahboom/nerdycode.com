---
title: Approaches in Microfrontends
eleventyExcludeFromCollections: false
date: 2024-01-01
permalink: "/micro-frontends/"
dynamicPermalink: false
layout: post.njk
tags:
  - micro-frontends
  - web-dev
---

>I decided to write a blog about microfrontends, and, before I knew it, it turned into an essay. I originally wrote this post in 2020, but because it was so long and the app wasn't as nice as I wanted, I decided not to publish it. As part of my "post it anyway" goal of next year, I'm now posting it in hopes it helps someone.

In this post, we'll be discussing micro frontends and the benefits (and tradeoffs) they can provide, as well as decision-making throughout the design. We'll build a set of small, simple apps that are then composed into a single UI, by using the micro frontends approach.

This post (and its code) was heavily inspired by Michael Geer's [Microfrontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb) and simply puts into practice many of the concepts discussed in it.

## Intro

It feels like there is a new JavaScript framework every year that takes the frontend world by storm. Everyone shares their hot takes on it. Conferences are scheduled. Devs flock to create plugins or themes for it.

It almost always seems like it has the potential to solve a lot of your existing problems, but the truth is, adopting a new framework every couple of years come at a cost.

Along with that shiny new framework, we're often creating unnecessary technical debt and adding a whole new learning curve, all while wading an uncharted territory of bugs and gotchas. There is *always* a tradeoff.

I'm not much of a purist, but I do believe in creating relatively sustainable solutions. And even if that is nearly impossible in web development, I'll be damned if I at least try.

One way to embrace the continuously evolving world of frontend development without drowning in it is to better accommodate it from an architectural perspective.

I've <a href="/microservices-micro-frontends/">previously written</a> about the benefits of microservices and how it gave rise to micro frontends. The general idea is not only that we can use different _technologies_, but our system can better align with _business concerns_ in a way that isn't as restraining as, say, a service-oriented architecture. By using micro frontends, we can experiment with multiple frameworks before committing to rewriting an entire codebase in the next hip framework.

Applying the microservices approach to the frontend frees you up to focus on more important things, like ensuring your customers are having the best experience possible when interacting with your brand.

It should go without saying that this is often a good way to over-engineer a project if you do not absolutely have similar requirements.

The actual components that each team is responsible for can be anything from full-blown pages to tiny fragments of a page. Ultimately, the components will be composed into a single user interface that then gets delivered to the browser and user.

tl;dr
- A big app is broken into lots of little apps, to make it easier to work with
- Each team is responsible for one or more of those little apps
- We then compose those little apps back into a single app for the user, who has no idea what we're talking about

### Goals

Our main UI is a "Choose Your Character" screen of Street Fighter II. Each "view" (e.g. `characters`, `controls`, `details`) is a separate app. It's not the prettiest, but we just want to get the point across.

These are some of the requirements:

1. A common header that displays the name of the game
2. A main content area that shows details of the selected player
3. A "menu" of characters you can choose to play as, and clicking on them shows the details for that player
4. A control to select the character you are viewing the details of

### Planning

Some questions we should probably consider:

1. What need does our app fulfill?
2. Who is our user?
3. Do we need our app to be static or dynamic?
4. How will we compose our app?
5. How will we route requests?
6. How will each of our apps communicate?

If you're a developer, the first couple of questions might throw you off. But decision-making becomes a lot simpler once you understand the overarching goal of the project and who its users are. If you don't know, make a best guess. We'll see how that can affect our more technical decisions in a moment.

## Setup

We'll have four directories: one for each app (the parent app, the list of characters, the selection controls, and details). We'll need to decide how we implement routing, assembly, and communication.

### Parent App

The parent app will need an `index.html` file. Each of the other apps will have their own controllers, or JavaScript files, that serve as entry points for each app.

### Controls, Characters & Details

Assuming first we are using web components for the app, here's an example controller for the the `details` app:

```js
const templateDetailChunLi = character => {  
  return `  
<div class="detail_layout">
    <div class="detail_character_container full-row">
        <div class="detail_character">
            <img class="detail_image" src="/img/${character.img}.png" />
        </div>
    
        <div class="detail_details">
            <h2 class="detail_headline">${character.name}</h2>
    
            <controls-select charname="${character.id}"></controls-select>
        </div>
    </div>
</div>
        `;  
};  
  
class DetailCharacterChunLi extends HTMLElement {  
  connectedCallback() {  
    this.innerHTML = templateDetailChunLi({  
      name: "Chun-Li",  
      img: "chun-li",  
      id: "chunli"  
    });  
  }  
}  
  
window.customElements.define(  
  "detail-character-chunli",  
  DetailCharacterChunLi  
);
```

All it does it renders some HTML for a custom element we are defining as `detail-character-chunli` along with some attributes. The `connectedCallback` is part of the native Web Components API and gets called whenever the element is added to the document. It's a simple app, since the idea is just that it's isolated from the others.

We create the same custom element for each character, which we can refactor in the future.

Alternatively, we can also use a framework here like Angular or Vue, and expose it as a web component.

## Routing

We need to devise a way for our users to get from one page to another, specifically pages that span multiple teams (and, therefore, apps). How each team chooses to implement routing within their particular application is of less concern for now. Let's take a look at some of our options:

1. Navigating with HTML links. We could use simple HTML anchor links to navigate from one page to another. This is the easiest option, but the most limiting. The browser would load all the HTML for the next page, which it receives from the server. It also means that each team needs to share their URL patterns in case another team needs it. This is a good option if you don't have much complexity, or if you're using iframes.
2. Using a reverse proxy like Nginx. A reverse proxy would sit between the apps and the browser, forwarding requests to the right application based on the URL that is being requested. This is also referred to as server-side routing.
3. Client-side routing through a parent app. In this case, the parent app handles the routing between pages of different teams. We would monitor the URL for changes using the browser's native History API to do client-side navigation, or a framework-specific router (like React router).

We can alternatively use a meta-framework like single-spa, but I won't be covering that here.

In our case, we'll just be using client-side routing and giving those routes to the parent app (shell app). We want one route for each character. This is one area where knowing your user and requirements ahead of time can be helpful. What device are they using to access your app? How important is SEO?

Here is the `<script>` tag which goes at the bottom of our parent app's `index.html` file, where we are defining the routes and monitoring for changes to the URL, updating the component as necessary:

```html
<script type="module">  
  const appContent = document.querySelector("#app-content");  
  
  // we really only need routes for characters  
  const routes = {  
    "/": "choose-your-character",  
    "/characters/balrog": "detail-character-balrog",  
    "/characters/blanka": "detail-character-blanka",  
    "/characters/chun-li": "detail-character-chunli",  
    "/characters/dhalsim": "detail-character-dhalsim",  
    "/characters/e-honda": "detail-character-e-honda",  
    "/characters/guile": "detail-character-guile",  
    "/characters/ken": "detail-character-ken",  
    "/characters/m-bison": "detail-character-m-bison",  
    "/characters/ryu": "detail-character-ryu",  
    "/characters/sagat": "detail-character-sagat",  
    "/characters/vega": "detail-character-vega",  
    "/characters/zangief": "detail-character-zangief",  
  };  
  
  const appHistory = window.History.createBrowserHistory();  
  appHistory.listen(updatePageComponent);  
  updatePageComponent(window.location);  
  
  // a global event listener for a "click" action,  
  // which handles links between each micro-frontend  document.addEventListener("click", e => {  
    if (e.target.nodeName === "A") {  
      const href = e.target.getAttribute("href");  
      appHistory.push(href);  
      // prevent a hard navigation  
      e.preventDefault();  
    }  
  });  
</script>
```

If no character is selected, it falls back to a default template prompting you to choose your character.

We've not yet implemented the `updatePageComponent` function, which is part of how we assemble the applications below.

In the body, we can then reference the custom element:

```html
<div id="app">
  <div class="logo">
    <a href="/"><img width="250" src="/img/street-fighter-logo.png"/></a>
  </div>

  <!-- this will get replaced by one of the other apps or custom elements when selecting from the characters list app -->
  <div id="app-content"><span>content not loaded yet</span></div>
  
  <!-- our custom element that stays between navigations, the characters list app -->
  <aside class="detail_characters full-row">
    <character-list charname="chun-li"></character-list>
  </aside>
  
</div>
```

## Assembling Frontend Applications

We know that we need to compose, or assemble, all of our tiny apps back into a single one to be shown to the user. Let's take a look at a few of our options:

### iFrames

iFrames are old and unimpressive, but they get the job done. When the job does not require a decent search engine ranking, performance, or any accessibility whatsoever, that is. On the upside, there is minimal coupling and a whole lot of freedom. They're good for internal tools.

### Ajax

We could place smaller components into a page by using Ajax. It's better for SEO, accessibility, and performance than iframes are.

### Server-side composition

We can use something like Nginx and server-side includes (SSI) to include components into page. Nginx looks for a special directive in your HTML that tells it to include contents from a specified URL, and it replaces the directive with those contents. The assembled result is what gets sent to the browser.

For this to work, you specifically have to enable it in the Nginx configuration settings. In this case, Nginx handles the requests using server-side routing AND the integration for you.

This is a pretty popular option for large companies. The biggest benefit is the first-page load speed that you really can't get with something like iframes or Ajax. It's a good option when your focus is SEO and/or performance. Instead of Nginx, you can also use edge-side includes (ESI) with a Varnish server, which is similar.

If you decide to go with server-side composition, try to avoid nesting includes, because it can get unwieldy and significantly add to the load time.

### Client-side Composition

When it comes to client-side composition, we're mainly looking at something like web components. The way it works is that you wrap your application in a web component and make it available for use in other places. The consuming apps would then interact with it using the DOM.

Most modern frameworks allow you to export an application as a web component. So if you're very attached to React or already using Vue, you do you. In Angular, for instance, you have Angular Elements. Also of note is that you can combine Ajax with web components to get updated fragments from a server, for instance. You're not limited to client-side rendering.

### Isomorphic/Combination

The beauty of microfrontends is the ability to mix and match. Like a bikini. Who else likes to wear a polka dot top with stripey bottoms? Just me? Ok.

Now, I won't get into the pedantics of whether "isomorphic javascript" or "universal javascript" is the right term to describe combining the previous techniques described. I'll just refer to it as "combined rendering" because I think it's a bit easier to understand in this context.

Anyway, with microfrontends you could have a setup that combines client-side and server-side rendering (and routing, but we won't get into that). It's 2023! You can do whatever the hell you want!

Just remember, the more complicated your setup, the bigger the potential headache. Don't say I didn't warn you.

One common example of mix and matching is when using server-side routing between pages or frontend apps, and then using client-side routing for each of the apps internally. This would require that each app expose their app, which is why web components could be a good choice. There are other ways, like using a framework, or by creating your own custom interface.

We want this app to be interactive and snappy when toggling between characters. And for that reason, I've chosen client-side composition using web components.

Our function might look something like this:

```js
function findComponentName(pathname) {
    return routes[pathname];
  }

  function updatePageComponent(location) {
    const next = findComponentName(location.pathname);
    const current = appContent.firstChild;
    if (current.nodeName.toLowerCase() !== next) {
      const newComponent = document.createElement(next);
      appContent.replaceChild(newComponent, current);
    }
  }
```

The idea is that we find the DOM node that matches the pathname in the URL, create an element for it, and then replace the current node with it.

## Communication

So far, we haven't really covered one of the most important aspects of microfrontends--how will our highly integrated frontend apps communicate with one another?

Some of the ways we can imagine might be:

1) parent to child
2) child to parent
3) child to child

Here, parent means the entire page or containing app, and child means any component that is rendered within it.

There's a lot to cover on this, so I'll go over each approach rather briefly.

### 1) Parent to child component
We can update state by passing it down the chain using attributes. This type of communication follows the unidirectional dataflow pattern. Those of you that have worked with React are likely familiar with this pattern.

### 2) Child to parent component
If a fragment or component needs to communicate with its corresponding parent, it can do so via events. One way to do this is by using the browser's CustomEvents API. A word of warning: events can get messy pretty quickly.

### 3) Child to child component
For child-to-child component communication, we have a few options. They can communicate directly, through a parent, or through global events.

Direct communication is probably the simplest, but also the worst option. This method consists of one child component traversing the DOM tree to find another fragment, and then calling a function with a reference to it. The reason this isn't recommended is because it creates coupling, which kind of defeats the purpose of microfrontends to begin with.

Communicating through a parent is done by combining the parent-to-child and child-to-parent methods of communication. Basically, you pass data down the chain with attributes, and up the chain with events.

Communicating through global events entails using an event bus as a global communication channel that your components publish to/subscribe from. This is typically done by using browser specifications, like the `CustomEvents` or `BroadcastChannel` APIs. You can implement your own pub/sub module, but your safest bet is probably to use one of the browser-provided APIs.

How communication is done through `CustomEvents` can vary. You could use an event bus that allows you to bubble events up the DOM tree. Eventually, the event bubbles all the way up to the `window` object. You can also dispatch events directly on `window`, but this is typically not recommended and it's more difficult to debug.

Keep in mind that even with ES6 modules, event propagation still occurs in the same standard way as before, meaning that events will still bubble all the way up to the `window` object. This is because the event propagation model is a fundamental aspect of the DOM, and is not altered by ES6 modules.

If you need to use iframes or want state to be synced across several tabs, then the newer `BroadcastChannel` API might be a good bet for you. Otherwise, stick with the `CustomEvents`.

With all this talk about communication, it's probably a good time for me to remind you that our components should be communicating as little as possible.

The thing is, we don't want to start coupling our frontend applications. The more they communicate with one another, the more coupled they get. It's best to delegate communication between them the way we've just described, and keep that communication to gentle notifications. In theory, this is easy, but in practice it's often not very realistic. Still, we should strive to avoid decoupling where it's not truly necessary.

NOTE: Don't abuse events. Don't exchange data and large payloads through events. We want to leverage events as ways to notify other parts of the app, not to transfer data.

Working with events can be tricky. It's possible that your frontends may not have finished loading by the time an event is emitted (say, if it's an event emitted on initial page load), and it could miss it. If this is a concern, there's a good chance you would benefit more from asynchronously loading than events.

### Globally-available context information

For data like authentication, currency, localization, you will probably want to share this data across all of your frontends.

If you're using server-side rendering, you'll likely want to share this data with HTTP headers or even cookies. If you're using client-side rendering, your main option is to expose that data to your apps with JavaScript. If you are using a parent app, that's another common way to store this type of contextual information.

It really depends on what you're trying to achieve. For our app, I've decided to use a few simple event handlers.

In the `characters` controller we add an event listener to the "Select Character" confirmation button and add/remove a CSS class to it which shows a little animation when selecting the character.

```js
const selectBtn = document.querySelector('controls-select');  
const characterEl = document.querySelector('.detail_character');  
  
selectBtn.addEventListener('controls:character_selected', (e) => {  
  characterEl.classList.add('detail_character--confirm');  
});  
  
characterEl.addEventListener('animationend', () => {  
  characterEl.classList.remove('detail_character--confirm');  
});
```

## Managing State

If you are going to be using a state management library, it's best that each frontend application has its own local state. Try to avoid sharing state across apps where possible.

Remember how I mentioned vertical slices earlier? I just wanted to reiterate that microfrontends should really each have their own data store to make them truly independent entities. In microfrontends, you should avoid having one app communicate with the API of another app, because the goal is to avoid coupling. In the real world, this may not always be possible.

## Testing

Each micro frontend should have its own suite of automated tests that ensure quality and correctness of the code, 
not very different to monolithic testing, with a stronger focus on integration tests. Tools for functional/end-to-end testing like Selenium or Cypress Functional tests should only cover aspects that cannot be tested at a lower level of the Test Pyramid.

## Result

With some basic CSS, here is what our set of apps is starting to look like:

![Basic app](/img/post/street-fighter-microfrontend.png)

For the code associated with this blog post, see the repo here: [GitHub - kahboom/street-fighter-micro-fe](https://github.com/kahboom/street-fighter-micro-fe)

## Discussion

Our little apps aren't too impressive but showcase the flexibility offered by micro frontends, particularly when using native browser APIs. There are many ways we could improve it, as it's certainly not production-ready. We can also swap out one of the apps with more common frameworks like Vue and Angular, and exposing them as web components.

Because microfrontends essentially bring the concept of microservices to the frontend, many of the same tradeoffs still apply. Suffice it to say that you have the additional concern of a user interface, which brings along its own set of considerations when there's just one, let alone several of them that need to be combined. Here are a few things to keep in mind:

- Distributed systems are harder to work with. The same absolutely applies in the world of distributed frontends.
- Operational concerns. Managing multiple services requires clear and consistent communication, especially when first getting things set up.
- User experience and consistency. Stitching together frontend apps into a single unit means that coordinated planning centered around user experience is key. Ensuring consistency across a distributed system can be challenging.
- Performance concerns. Microfrontends require special performance considerations from the very beginning. Don't overengineer, but stay conscious of this throughout the process.

It might be a good idea to start first with a monolith and then work with microfrontends down the line. If you're definitely set on using microfrontends at some point, then it will save you a lot of time and headache to design your system with them in mind from the beginning.

Another thing to keep in mind is that just because you can use different technologies across teams doesn't mean you should. Always start with the simplest solution and adjust as your needs grow.



## Conclusion

There is so much more to microfrontends than I could reasonably cover in a single blog post, but I hope this gives you an overview of what your options could look like. We didn't even cover things like asset loading, caching, and mechanisms like server-side includes.

Microfrontends are very interesting, and I can see myself continue to use them for the right projects. The one thing I will say is that you will certainly learn a lot when you go down this road, so be prepared for that.

And remember, while microfrontends look quite promising (and indeed they can be), there is *always* a tradeoff. Is that a tradeoff you've considered openly with the rest of your team?

Good luck.


## Further Reading

- [Microfrontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb), Michael Geer
- [Martin Fowler: Micro-Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Martin Fowler: Microservice Trade-offs](https://martinfowler.com/articles/microservice-trade-offs.html)
- [Micro-Frontends Communications](https://dev.to/luistak/cross-micro-frontends-communication-30m3)
- [micro-frontends.org](https://micro-frontends.org/)
- [Micro-frontend Architecture at Enterprise Scale](https://medium.com/swlh/micro-front-end-architecture-at-enterprise-scale-updated-july-2020-9159a4e0cc49)

