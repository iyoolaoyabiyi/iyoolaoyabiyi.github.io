const posts = {
  'first-blog-post': { 
    type: 'file',
    name: 'first blog post',
    content: `This is my first blog post.`
  },
  'second-blog-post': { 
    type: 'file',
    name: 'second blog post',
    content: `This is my second blog post.`
  },
  'third-blog-post': { 
    type: 'file',
    name: 'third blog post',
    content: `This is my third blog post.`
  },
}

const FILESYSTEM = {
  '~': {
    type: 'directory',
    name: '~',
    content: {
      portfolio: {
        type: 'file',
        name: 'portfolio',
        content: `This is my portfolio`,
      },
      contact: {
        type: 'file',
        name: 'contact',
        content: `This is my contact details`,
      },
      blog: {
        type: 'directory',
        name: 'blog',
        content: posts
      }
    },
  }
}