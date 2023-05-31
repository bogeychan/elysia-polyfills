import { Project } from 'ts-morph';

/**
 * @param {string} path
 * @see https://github.com/bogeychan/elysia-polyfills/issues/1#issuecomment-1568902510
 */
function updateElysia(path) {
  const project = new Project();
  project.addSourceFilesAtPaths(`${path}/dist/**/*.js`);

  const compose = project.getSourceFile('compose.js');

  compose
    ?.getVariableDeclaration('isFnUse')
    ?.getInitializer()
    ?.replaceWithText(isFnUse.toString());

  project.saveSync();

  console.log(`✅ Updated runtime for "${path}"`);
}

/**
 * @param {string[]} elysiaPaths
 */
export function updateElysiaRuntime(elysiaPaths) {
  for (const elysiaPath of elysiaPaths) {
    updateElysia(elysiaPath);
  }
}

/**
 * @param {string} keyword
 * @param {string} fnLiteral
 * @see https://github.com/elysiajs/elysia/blob/08a4375b91d9d359fe7a0264b29d7512a729ea8f/src/compose.ts#L73
 */
const isFnUse = (keyword, fnLiteral) => {
  // >> INSERT
  fnLiteral = fnLiteral.trimStart();

  const argument =
    fnLiteral.startsWith('(') || fnLiteral.startsWith('function')
      ? // (context) => {}
        fnLiteral.slice(fnLiteral.indexOf('(') + 1, fnLiteral.indexOf(')'))
      : // context => {}
        fnLiteral.slice(0, fnLiteral.indexOf('=') - 1);
  // << INSERT

  if (argument === '') return false;

  if (argument.charCodeAt(0) === 123) {
    // >> INSERT
    if (argument.includes(`{${keyword}`) || argument.includes(`,${keyword}`))
      return true;
    // << INSERT

    if (argument.includes(`{ ${keyword}`) || argument.includes(`, ${keyword}`))
      return true;

    return false;
  }

  if (
    fnLiteral.match(new RegExp(`${argument}(.${keyword}|\\["${keyword}"\\])`))
  ) {
    return true;
  }

  const aliases = [argument];

  const findAliases = new RegExp(` (\\w+) = context`, 'g');
  for (const found of fnLiteral.matchAll(findAliases)) aliases.push(found[1]);

  const destructuringRegex = new RegExp(`{.*?} = (${aliases.join('|')})`, 'g');

  for (const [params] of fnLiteral.matchAll(destructuringRegex)) {
    if (params.includes(`{ ${keyword}`) || params.includes(`, ${keyword}`))
      return true;
  }

  return false;
};
