import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import '../styles/elements/marquee.css';
import '../styles/elements/picture.css';

import Img from "gatsby-image"

export const query = graphql`
  query {
    file(relativePath: { eq: "photos/rachel-cropped.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

const AboutPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="About Rachel Yordán"/>
      <div className="picture">
        <div className="picture__border">
          <Img fluid={data.file.childImageSharp.fluid} />

          <figcaption>I wonder if they do sticky toffee pudding here?</figcaption>
        </div>
      </div>
      <p>Hello, world. My name is Rachel and I wear my sunglasses at night. I'm also a software engineer at Red Hat.</p>

      <p>I've been a "webmaster" since the 90s (weren't we all?). I sometimes blog about technology from the perspective
      of a pragmatic developer, other times I blog about rainbows and unicorns. I've proudly been eating cheese since
      I grew my first baby tooth.</p>

      <p>I was born in the beautiful Dominican Republic. I later went on to study Chemistry in college, but eventually
      decided to do what I had been doing for fun for most of my life -- lounging around, eating pizza, and writing
        code -- instead.</p>

      <p className="marquee">
   <span>
     Things I like: dancing - ballet, jazz+modern, jumping around, etc; dogs; eating - cheese, sticky toffee pudding; whiskey + beer; climbing trees; programming; science; documentaries; learning; music; playing the guitar; mechanical keyboards; pizza
   </span>
      </p>
    </Layout>
  )
}

export default AboutPage;
