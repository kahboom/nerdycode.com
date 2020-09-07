import React from 'react';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const ContactPage = () => {
  return (
    <Layout>
      <SEO title="404: Not found"/>
      <form name="contact" method="POST" netlify-honeypot="dummy-field" data-netlify="true" data-netlify-recaptcha="true">

        <p className="hidden">
          <label>Don’t fill this out if you're human: <input name="dummy-field"/></label>
        </p>

        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" name="name" placeholder="Alan Turing"/>
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" type="email" name="email" placeholder="alan@turing.com"/>
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"/>
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"/>
            </span>
          </div>
        </div>

        <div className="field">
          <label className="label">Subject</label>
          <div className="control">
            <div className="select">
              <select name="subject">
                <option>Select dropdown</option>
                <option>Feedback/Question</option>
                <option>Business Inquiry</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Message</label>
          <div className="control">
            <textarea className="textarea" name="message" placeholder="Hello world"/>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox"/>
                I agree to the <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>

        <div data-netlify-recaptcha="true"/>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </Layout>
)}

export default ContactPage;
