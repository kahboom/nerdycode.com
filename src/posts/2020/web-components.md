---
title: Understanding Web Components
date: 2020-10-01
permalink: "/understanding-web-components/"
dynamicPermalink: false
layout: post.njk
references:
  - {title: 'Web Components', url: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components', note: 'MDN Docs'}
tags:
  - web-components
---

## What Are Web Components

You have likely heard of web components in passing, maybe seen an example of one or two, and wondered if it's a solution you could actually use at scale. I'm here to tell you that you can. While today's examples will be simple for the sake of clarity, I'll also be discussing how web components have evolved over time and where we stand today.

 The goal of web components are to make code reusable. Web components allow you to create your own custom HTML templates with encapsulated functionality, and it does this natively.

## Building a Simple Web Component

If you were to create a web component right now, the steps would look something like this:

- Create a class.
- Register a new custom element. This is where you create the name of your element.
- Attach a shadow DOM to that custom element. This is where you'd add event listeners and maybe some child elements.
- Optionally, define an HTML template with `<template>` or `<slot>`, to prepare it to be reused somewhere else.
- Place your custom element in your HTML.

Today we'll be creating a quick counter as a web component. To add some visual effect I've also added an SVG that slowly fills to the top as the counter approaches 10 and, empties as the counter decreases to 0. I also want the maximum range to be 0 to 10.

## Main Building Blocks

There are three core blocks of web components: custom elements, shadow DOM, and HTML templates.

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

What we're doing is attaching the shadow root to our element, and we do this from inside the constructor. While we're at it, we'll also set our initial count to 0:

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

We'll create these functions outside of the constructor, but still inside of the class, because we need to be able to access the scope:

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

Looks good! But I also would like to add an effect of filling an SVG and emptying it based on the clicks. Let's add a fun little SVG to the HTML, just below our custom element:

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

Now we have a fully functioning counter web component with a cool SVG animation. It doesn't do anything particularly special, but at least we've got some of the basics down.

### HTML Templates

HTML templates allow for you to write markup templates for your custom element that you can later reuse with the `<template>` and `<slot>` elements. They do not get displayed in the rendered page.

We didn't use templates in our example, but we just as easily could have by defining the template within the HTML:

```html
<template id="my-counter">
  <style>
    [..]
  </style>
  <button id="dec">-</button>
  <span id="count"></span>
  <button id="inc">+</button>
</template>
```

It will not appear in the rendered page until we select it with JS and append it to the DOM, or shadow root, during runtime:

```js
let template = document.getElementById('my-counter');
let templateContent = template.content;
const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
```

### Slots

Although there is less browser support for slots than templates, I still think they are valuable enough that you should understand the basics.

This is a slot: `<slot></slot>`

Slots are meant to be used with templates, though technically it's possible to use it without them. The purpose of slots is to provide a placeholder for consumers, or application developers, that are using the component, to replace content within it. The consumer adds slottable elements they specify inside of the provided slots. Elements can vary anywhere from `<p>` to `<h2>`.

When the browser renders the document, it composes the template and the slottable elements that the consumer has provided. In other words, two different DOM trees will be composed together.

Slots can have names. We'll want to use this name attribute to make it easier to reference our slots when someone wants to consume them. These names will not be rendered in the DOM, but provide a kind of internal reference.

Drawing on our previous template example, here's what it would look like if we provided slots that could be overridden:

```html
<template id="my-counter">
  <style>
    [..]
  </style>
  <h1>Some Counter</h1>
  <slot name="decrease">-</slot>
  <slot name="count"></slot>
  <slot name="increase">+</slot>
</template>
```

Then, the consumer application would provide slottable elements for it like this (removing any `id` for the sake of clarity):

```html
<my-counter>
  <button slot="decrease">Subtract</button>
  <span slot="count"></span>
  <button slot="increase">Add</button>
</my-counter>
```

This would compose the following:

```html
<my-counter>
  <style>
    [..]
  </style>
  <h1>Some Counter</h1>
  <button>Subtract</button>
  <span></span>
  <button>Add</button>
</my-counter>
```

Slots also allow you to specify default values to be used when the consumer does not provide a slottable element with a matching name. Our template had provided the text inside of the buttons as "+" and "-", and we had provided the text "Subtract" and "Add" in our consumer application. If we had not done that, it would have defaulted to the strings ("+" and "-") originally provided in the template.

## Lifecycle Callbacks of Web Components

Something we haven't discussed yet are the lifecycle methods that you get within a custom element's class definition. Each of these fire at different points in the element's lifecycle:

- `connectedCallback` - Gets invoked when the custom element is attached to the DOM.
- `disconnectedCallback` - Invoked when the custom element is removed from the DOM.
- `adoptedCallback` - Invoked when the custom element is moved to a new document.
- `attributeChangedCallback` - Invoked when the custom element's attributes change (e.g. added, removed).

We can test this my adding a simple log to our custom element example:

```js
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log('Custom element has been attached to the DOM!');
  }

  disconnectedCallback() {
    console.log('Custom element has been removed from the DOM!');
  }
}
```

`attributeChangedCallback` can be quite useful since we can act on attributes individually.

## Build Tools and Preparing for Production

The question of whether or not you will need a transpiler or bundler is subjective. You have some options, like Parcel, Rollup, Webpack, etc. but also consider just using ES6's `import`/`export`.

In your HTML, make sure to set `type` to `'module'`:

```html
<script src='/my-counter.js' type='module'></script>
```

By adding a `package.json` you could publish the module to npm, even if it's not a Node.js library. Just make sure to list the files that pertain to your component:

```json
{
  "name": "my-counter",
  "version": "1.0.0",
  "description": "My custom counter web component",
  "repository": {
    "type": "git",
    "url": "https://www.github.com/example/my-counter.git"
  },
  "files": [
    "my-counter.css",
    "my-counter.html",
    "my-counter.js"
  ]
}
```

## What About TypeScript + Web Components?

Using TypeScript is possible with web components, but the implementation varies depending on what build tool you are using, if you're using one at all. Typically, this isn't very different than if you were using TypeScript for any other project, so I recommend you check the documentation for your specific build tool.

## Polymer, AMP, and Other Libraries

You can absolutely use a library like Polymer or AMP to manage your web components, but it's not really necessary. Web components come down to how you decide to structure your application and what you decide to use for templating. Sometimes, it's easier not to have to make that decision.

## Template Rendering for Web Components

When it comes to template rendering, the options are endless. My advice is that you go with what you are most comfortable with, so long as you understand the tradeoffs. It's possible to leave template rendering to a framework like React, Angular, or Vue. Of course, you can also use a library that is specifically for template rendering like lit-html, Slim.js, or Pencil.

## Browser Compatibility of Web Components

As recently as Fall 2018, the only browsers that had full support for web components were Chrome and Safari. Although custom elements were a quick and easy polyfill, shadow DOM was far more complicated and difficult to use without native support. It really wasn't until late 2019 that all major browsers adopted support for Web Components. Today, with the release of Chromium-based Edge 76, web components are supported by most modern browsers.

If you do need to support older browsers, you'll need to include polyfills. They add a little bit of overhead, but they're a small cost to pay for the flexibility that web components provide us.

## Styling Web Components

One of the benefits of using shadow DOM is that our elements are isolated. As such, we won't need to use prefixed CSS variable names like `--my-counter-background`. Instead, we can simply use `--background()`.

Probably the easiest way to make our host components easy for a consumer to use their own styles is by creating CSS variables and assigning them a default value through the `:host` selector:

```css
:host {
  --background-color: royalblue;
}
#my-counter {
  background-color: var(--background-color);
}
``` 

It then becomes easy to override these CSS variables from the consumer side, because all they would need to use is select the custom element name:

```css
my-counter {
  --background-color: purple;
}
```

When creating components, we can also style our slots using the `::slotted()` selector:

```html
<template id="my-counter">
  <style>
    ::slotted(button) {
      background-color: orange;
    }
  </style>
  <h1>Some Counter</h1>
  <slot name="decrease">-</slot>
  <slot name="count"></slot>
  <slot name="increase">+</slot>
</template>
```

The argument of the `::slotted()` function should be the element that the consuming application is providing. In our case from before, that was a `<button>`. We need to use a top-level element, because a nested one will not work with `::slotted()`.

## Testing Web Components

Especially specific to the frameworks you're using and if they are having trouble rendering custom HTML.

## When To Use Web Components

So, why isn't everyone using web components already? Those that have been working with web components for a long time now are familiar with some of the shortcomings, one of which was lack of compatibility with modern web browsers.

There may have also been some loss of momentum to frameworks like Angular and React, maybe in part because web components didn't seem to be as easy to implement, or maybe because those that had tried them felt let down by the lack of examples, documentation, or browser support. I even found that people often associated web components with other frameworks or libraries like Polymer or OpenComponents, not really having a strong understanding of how to use them without introducing some kind of framework. In my opinion, the lack of marketing is another factor.

In any case, all of this is slowly changing. Browser compatibility is less of a concern, and people seem to be getting a bit fed up with SPA one-size-fits-all solutions. Still, changing common misperceptions of web components is a bit of an uphill battle. My advice is to give web components another go, this time with a fresh mind.

## In Conclusion

Web components have been around for a long time now, and they don't seem to have taken off as quickly as one would hope. But we're only just getting started. 

