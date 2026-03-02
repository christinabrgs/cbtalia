import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();


export async function GET(context) {
  const posts = await getCollection('posts')
  return rss({
    // `<title>` field in output xml
    title: 'Chris’ Blog',
    // `<description>` field in output xml
    description: 'A mediocre attempt at writing about tech and other stuff',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `blog/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
