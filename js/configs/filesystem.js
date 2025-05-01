const FILESYSTEM = {
  '~': {
    type: 'directory',
    name: '~',
    content: {
      someFolder: {
        type: 'directory',
        name: 'someFolder',
        content: {
          someFile: {
            type: 'file',
            name: 'someFile',
            content: `This is my file`,
          },
          anotherFile: {
            type: 'file',
            name: 'anotherFile',
            content: `This is my another file`,
          }
        }
      },
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