---
title: Web Components
date: 2020-09-26
permalink: "/web-components/"
dynamicPermalink: false
layout: post.njk
tags:
  - web-components
---

## What Are Web Components

You may have heard of web components in passing, maybe seen an example of one or two, and wondered if it's a solution you could actually use at scale. I'm here to tell you that you can. While today's example of a web component will be a small one (for the sake of brevity), I'll also be discussing how web components have evolved over time and where we stand today.

 The goal of web components are to make code as reusable as possible. Web components allow you to create your own custom HTML templates with encapsulated functionality, and it does this all natively.

## Building a Simple Web Component

If you were to create a web component right now, the steps would look something like this:

- Create a class.
- Register your new custom element. This is done with `CustomElementRegistry.define()`, and this is where you create the name of your element.
- Attach a shadow DOM to that custom element (optional). This is where you'd add event listeners and maybe some child elements.
- Define an HTML template with `<template>` or `<slot>` (optional). Using regular DOM methods, you'd clone the template and attach it to the shadow DOM.
- Place your custom element wherever you want in your HTML!

Today we'll be creating a quick counter as a web component. To add some visual effect I've also added an SVG that slowly fills to the top as the counter approaches 10 and, empties as the counter decreases to 0. I also want the maximum range to be 0 to 10.

## Main Building Blocks

There are three core blocks of web components: custom elements, shadow DOM, and HTML templates. The first we'll be discussing are custom elements.

### Custom Elements

Custom elements are a set of JavaScript APIs that allow you to define your custom element as well as its behavior. The main controller of customs elements is an object called `CustomElementRegistry`, available to us in the DOM as `customElements`.

For example, if you were to create a custom element, you'd call its `define` method like this: `customElements.define()`. The `define()` method accepts a `DOMString` for the name, a class object for its behavior, and an optional "options" object that allows you to extend your element.

To build our counter, the first thing we need to do is define our custom element in our HTML:

```html
<my-counter></my-counter>
```

In our JavaScript, we we'll want to write out the HTML that we want this custom element to correspond to, and we'll assign it to a variable for future reference. We can create this element using good ole `document.createElement()` (don't forget the backticks):

```js
const template = document.createElement("template");
template.innerHTML = `
    <style>
        * {
          font-size: 150%;
          text-align: center;
        }
    
        span {
          width: 4rem;
          display: inline-block;
        }
    
        button {
          width: 4rem;
          height: 4rem;
          border: none;
          border-radius: 10px;
          background-color: royalblue;
          color: white;
        }
      </style>
      <button id="dec">-</button>
      <span id="count"></span>
      <button id="inc">+</button>`;
```

Now we'll create a class in JavaScript that extends `HTMLElement`. We'll call it `MyCounter`. And inside of that class, we'll first need to write a constructor that calls `super()`. This is done to establish the correct prototype chain and it always needs to be the first thing inside the class.

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    // Do other things here!
  }
}
```

Then we'll define our custom element with `customElements.define()`, giving it a string for the name and the class we created above as the second argument.

```js
const template = document.createElement("template");
// [..]
// Our template-y stuff up here

class MyCounter extends HTMLElement {
  constructor() {
    super();
    // Do other things here!
  }
}

customElements.define("my-counter", MyCounter);
```



### Shadow DOM

Shadow DOM is a set of JavaScript APIs that allow you to encapsulate your code. It's rendered separately from the main document DOM, so you never have to worry about collision with other parts of the document.

What we're doing is we are attaching shadow root to our element, and we do this from inside the constructor. While we're at it, we'll also set our initial count to 0:

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
  }
}
```

To recap, we previously defined our template at the top of the file and assigned it to a variable called `template`. We then attached shadow root to our element. Now, we can have shadow root clone the template to create the element's internal shadow DOM structure.

We'll do all of this from within the constructor for now:

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
```

We can also add some styling to the shadow root, but we won't be doing that here. Instead, let's add in some event handlers for when the user clicks the + or - buttons: 

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.getElementById("inc").onclick = () => this.inc();
    this.shadowRoot.getElementById("dec").onclick = () => this.dec();
    this.update(this.count);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
```

We'll add create these functions outside of the constructor, but still inside of the class, because we need to be able to access the scope:

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.getElementById("inc").onclick = () => this.inc();
    this.shadowRoot.getElementById("dec").onclick = () => this.dec();
    this.update(this.count);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  inc() {
    // We want the max to be 10
    if(this.count === 10) {
      return;
    } else {
      this.update(++this.count);
    }
  }

  dec() {
    // We want the min to be 0
    if(this.count === 0) {
      return;
    } else {
    this.update(--this.count);
    }
  }

  update(count) {
    this.shadowRoot.getElementById("count").innerHTML = count;
  }
}
```

Looks good! And it seems to be working. But I also would like to add an effect of filling an SVG and emptying it based on the clicks. Let's add an SVG to the HTML, just below our custom element:

```html
<my-counter></my-counter>

<div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
      <linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stop-opacity="1" stop-color="royalblue"/>
          <stop offset="40%" stop-opacity="1" id="secondStop" stop-color="royalblue"/>
          <stop offset="40%" stop-opacity="0" id="thirdStop" stop-color="royalblue"/>
          <stop offset="100%" stop-opacity="0" stop-color="royalblue"/>
      </linearGradient>
      <circle cx="50" cy="50" r="45" fill="url(#lg)" stroke="lightblue" stroke-width="5"/>
    </svg>
</div>
```

Back to our JS, we'll need to make sure the SVG gets updated with every click. Let's add some basic DOM manipulation to the `update` function:

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
  }

  // [..]

  update(count) {
    this.shadowRoot.getElementById("count").innerHTML = count;
    
    // A bit hacky, but use the count to create the string
    const percentage = count + '0%';
    const secondStop = document.getElementById("secondStop");
    const thirdStop = document.getElementById("thirdStop");
    
    secondStop.setAttribute('offset', percentage);
    thirdStop.setAttribute('offset', percentage);
  }
}
```

<p class="codepen" data-height="299" data-theme-id="dark" data-default-tab="js,result" data-user="kahboom" data-slug-hash="PoNgQZL" style="height: 299px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Web Component Counter Fill">
  <span>See the Pen <a href="https://codepen.io/kahboom/pen/PoNgQZL">
  Web Component Counter Fill</a> by Rachel (<a href="https://codepen.io/kahboom">@kahboom</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Now we have a fully functioning counter web component with a cool SVG animation. It doesn't do anything particularly special, but it helps to better understand the basics of web components.

### HTML Templates

HTML templates allow for you to write markup templates for your custom element that you can later reuse with the `<template>` and `<slot>` elements. They do not get displayed in the rendered page.

We didn't need to use templates in our example, because it's not really a component that is meant to be reused in multiple parts of the application, but we just as easily could have by defining the template within the HTML:

```html
<template id="my-counter">
  <style>
    * {
      font-size: 150%;
      text-align: center;
    }

    span {
      width: 4rem;
      display: inline-block;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: royalblue;
      color: white;
    }
  </style>
  <button id="dec">-</button>
  <span id="count"></span>
  <button id="inc">+</button>
</template>
```

It will not appear in the rendered page until we select it with JS and append it to the DOM, or shadow root:

```js
let template = document.getElementById('my-counter');
let templateContent = template.content;
const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
```


### Lifecycle Methods

Something we haven't discussed yet 

## What About TypeScript?

Using TypeScript is possible with web components.

## Build Tools

Parcel, Rollup. If you were to use TypeScript, you may need to take some additional steps.

## Polymer, AMP, and Other Libraries

Many people associated web components with Polymer, and there are a few reasons for that I won't get into. The important thing to note is that you can absolutely use a library like Polymer or AMP to manage your web components, but the truth is, it's not really necessary. Web components come down to how you decide to structure your application and what you decide to use for templating. Sometimes, it's easier not to have to make that decision.

## Template Rendering

When it comes to template rendering, the options are endless. My advice is that you go with what you are most comfortable with, so long as you understand the tradeoffs. It's entirely possible to leave template rendering to a framework like React, Angular, or Vue, or to use a library that is specifically for template rendering like lit-html.


## Browser Compatibility

Polyfills. By the fall of 2018, the only browsers that had full support for web components were Chrome and Safari. Although custom elements were a quick and easy polyfill, shadow DOM was far more complicated and difficult to use without native support. It really wasn't until late 2019 that all major browsers adopted support for Web Components.

## Testing

Especially specific to the frameworks you're using and if they are having trouble rendering custom HTML.

## When To Use Web Components

So, why isn't everyone using web components already? Those that have been working with web components for a long time now are familiar with some of the shortcomings, one of which was lack of compatibility with modern web browsers.

There may have also been some loss of momentum to frameworks like Angular and React, maybe in part because web components didn't seem to be as easy to implement, or maybe because those that had tried them felt let down by the lack of examples, documentation, or browser support. I even found that people often associated web components with other frameworks or libraries like Polymer or OpenComponents, not really having a strong understanding of how to use them without introducing some kind of framework. In my opinion, the lack of marketing is another factor.

In any case, all of this is slowly changing. Browser compatibility is less of a concern, and people seem to be getting a bit fed up with SPA one-size-fits-all solutions. Still, changing common misperceptions of web components is a bit of an uphill battle. My advice is to give web components another go, this time with a fresh mind.

## In Conclusion

Web components have been around for a long time now, and they don't seem to have taken off as quickly as one would hope. But we're only just getting started. Polyfills are a small cost to pay for the flexibility that web components provide us, and I don't think they'll be going anywhere anytime soon.

