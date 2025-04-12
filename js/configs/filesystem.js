const portfolio = {
  categories: {
    type: 'directory',
    name: 'categories',
    content: {
      'personal': {
          type: 'directory',
          name: 'personal',
          content: {
            'static-calculator': {
              type: 'file',
              name: 'static calculator',
              content: `This is my calculator`
            }
          }
        },
        'freeCodeCamp': {
          type: 'directory',
          name: 'freeCodeCamp',
          content: {
            'portfolio-2': {
              type: 'file',
              name: 'portfolio-2',
              content: `This is my portfolio 2`
            }
          }
        }
      }
    },
    'portfolio-1': {
      type: 'file',
      name: 'portfolio-1',
      content: `This is my portfolio 1`
  },
  'portfolio-2': {
    type: 'file',
    name: 'portfolio-2',
    content: `This is my portfolio 2`
  },
  'portfolio-3': {
    type: 'file',
    name: 'portfolio-3',
    content: `This is my portfolio 3`
  }
}

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
        type: 'directory',
        name: 'portfolio',
        content: portfolio
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