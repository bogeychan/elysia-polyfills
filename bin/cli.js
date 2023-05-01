#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { updateScriptFolders } from '../scripts/utils.js';

const CWD = process.cwd();
const NODE_MODULES_PATH = path.resolve(CWD, 'node_modules');
const DENO_NESTED_MODULES_PATH = path.resolve(NODE_MODULES_PATH, '.deno');

const ELYSIA_MODULE_NAME = 'elysia';
const RAIKIRI_MODULE_NAME = 'raikiri';
const EXTRA_MODULE_NAMES = process.argv.slice(2);

/**
 * @param {string} filePath
 */
function exitOnMissingFile(filePath) {
  console.error(
    `❌ "${path.dirname(filePath)}" doesn't contain '${path.basename(
      filePath
    )}'`
  );
  process.exit(1);
}

if (!fs.existsSync(NODE_MODULES_PATH)) {
  exitOnMissingFile(NODE_MODULES_PATH);
}

/**
 * @type {string[]}
 */
let denoModules = [];

if (fs.existsSync(DENO_NESTED_MODULES_PATH)) {
  denoModules = fs.readdirSync(DENO_NESTED_MODULES_PATH);
}

/**
 * @param {string} moduleName
 * @returns {string[]}
 */
function resolveModulePaths(moduleName) {
  const paths = [];

  // Check -> ./node_modules/elysia
  const nodeModulePath = path.join(NODE_MODULES_PATH, moduleName);

  if (fs.existsSync(nodeModulePath)) {
    paths.push(nodeModulePath);
  }

  /**
   * @param {string} mainModuleName
   */
  function pushNestedNodeModulePath(mainModuleName) {
    // Check -> ./node_modules/elysia/node_modules/raikiri
    const nestedNodeModulePath = path.join(
      NODE_MODULES_PATH,
      mainModuleName,
      'node_modules',
      moduleName
    );

    if (fs.existsSync(nestedNodeModulePath)) {
      paths.push(nestedNodeModulePath);
    }
  }

  pushNestedNodeModulePath(ELYSIA_MODULE_NAME);
  pushNestedNodeModulePath(RAIKIRI_MODULE_NAME);

  // Check -> ./node_modules/.deno/elysia@0.4.9
  const denoModuleNamePrefix = moduleName.replaceAll('/', '+');

  for (const denoModuleName of denoModules) {
    if (denoModuleName.startsWith(`${denoModuleNamePrefix}@`)) {
      const denoModulePath = path.join(
        DENO_NESTED_MODULES_PATH,
        denoModuleName,
        'node_modules',
        moduleName
      );

      paths.push(denoModulePath);
    }
  }

  if (paths.length === 0) {
    exitOnMissingFile(nodeModulePath);
  }

  return paths;
}

const elysiaPaths = resolveModulePaths(ELYSIA_MODULE_NAME);
const raikiriPaths = resolveModulePaths(RAIKIRI_MODULE_NAME);

console.log("Let's goo\n");

/**
 * @param {string[]} folderPaths
 * @see https://github.com/denoland/deno/issues/17784#issuecomment-1445195226
 */
function modifyPackageJson(folderPaths) {
  for (const folderPath of folderPaths) {
    const filePath = path.resolve(folderPath, 'package.json');
    const json = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));

    json['type'] = 'module';

    fs.writeFileSync(filePath, JSON.stringify(json));
    console.log(`✅ Updated package for "${filePath}"`);
  }
}

modifyPackageJson(elysiaPaths);
modifyPackageJson(raikiriPaths);

const extraPaths = EXTRA_MODULE_NAMES.map((extraPath) =>
  resolveModulePaths(extraPath)
);

for (const extraPath of extraPaths) {
  modifyPackageJson(extraPath);
}

console.log('\n');

updateScriptFolders(elysiaPaths);
updateScriptFolders(raikiriPaths);

for (const extraPath of extraPaths) {
  updateScriptFolders(extraPath);
}

console.log('\ndone.');
process.exit(0);

