---
title: "Contact"
date: "2020-09-06"
author: "Rachel"
path: "/contact"
---

<form name="contact" method="POST" netlify-honeypot="dummy-field" data-netlify="true" data-netlify-recaptcha="true">

<p class="hidden">
  <label>Don’t fill this out if you're human: <input name="dummy-field" /></label>
</p>

<div class="field">
  <label class="label">Name</label>
  <div class="control">
    <input class="input" type="text" name="name" placeholder="Alan Turing">
  </div>
</div>

<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="email" name="email" placeholder="alan@turing.com">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Subject</label>
  <div class="control">
    <div class="select">
      <select name="subject">
        <option>Select dropdown</option>
        <option>Feedback/Question</option>
        <option>Business Inquiry</option>
      </select>
    </div>
  </div>
</div>

<div class="field">
  <label class="label">Message</label>
  <div class="control">
    <textarea class="textarea" name="message" placeholder="Hello world"></textarea>
  </div>
</div>

<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox">
      I agree to the <a href="#">terms and conditions</a>
    </label>
  </div>
</div>

<div data-netlify-recaptcha="true"></div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link" type="submit">Submit</button>
  </div>
</div>
</form>
