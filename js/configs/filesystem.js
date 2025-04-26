const FILESYSTEM = {
  '~': {
    type: 'directory',
    name: '~',
    content: {
      about: {
        type: 'file',
        name: 'about',
        content: `This is my about page`,
      },
      contact: {
        type: 'file',
        name: 'contact',
        content: `This is my contact details`,
      }
    }
  }
}

export default FILESYSTEM;