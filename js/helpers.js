export function createElem(elem, n) {
  const elemList = [];
    if (!n || n === 1) {
      return document.createElement(elem);
    }
    for (let i = 0; i < n; i++) {
      elemList.push(document.createElement(elem));
    }
    return elemList;
}

export function createParas(n) {
  const paraList = [];
  if (!n || n === 1) {
    return createElem('p');
  }
  for (let i = 0; i < n; i++) {
    paraList.push(createElem('p'));
  }
  return paraList;
}

export function createDescList(listArr) {
  const div = createElem('div');
  div.style.marginBottom = '5px';
  listArr.forEach(item => {
    const p = createElem('p');
    p.style.marginBottom = 0;
    p.textContent = item;
    div.append(p);
  });
  return div;
}

export function getDirObj(dirInfo) {
  const {path} = dirInfo;
  let {fileSystem, currentPath} = dirInfo;

  if (!path) return {error: 'What are you looking for?'};
  if (!fileSystem) return {error: 'Where do you want to look?'};
  if (!currentPath) currentPath = '~';

  let segments = [];
  let pathStack = [];
  let dirObj = fileSystem['~'];
  let clearedPath = '';

  if (currentPath.startsWith('/')) 
    currentPath = '~';

  if (path.startsWith('~'))
    segments = path.split('/');
  else if (path.startsWith('/')) {
    segments = path.split('/');
    segments[0] = '~';
  } else 
    segments = currentPath.split('/').concat(path.split('/'));

  for (let part of segments) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (pathStack.length > 1) pathStack.pop();
    } else {
      pathStack.push(part);
    }
  }

  clearedPath = pathStack.join('/');

  for (let i = 1; i < pathStack.length; i++) {
    if (dirObj.content && dirObj.content[pathStack[i]]) {
      dirObj = dirObj.content[pathStack[i]];
    } else {
      return { error: `${clearedPath} does not exist.` };
    }
  }
  return { dirObj: dirObj, clearedPath: clearedPath };
}