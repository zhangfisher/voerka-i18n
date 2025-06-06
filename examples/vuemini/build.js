/**
 * @version v1.4.0
 * https://github.com/vue-mini/create-vue-mini
 * 请谨慎修改此文件，改动过多可能会导致你后续升级困难。
 */
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import babel from '@babel/core';
import traverse from '@babel/traverse';
import t from '@babel/types';
import { minify } from 'terser';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import { rollup } from 'rollup';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { green, bold } from 'kolorist';
import { getPackageInfo } from 'local-pkg';

let topLevelJobs = [];
let bundleJobs = [];
const startTime = Date.now();
const NODE_ENV = process.env.NODE_ENV || 'production';
const __PROD__ = NODE_ENV === 'production';
const terserOptions = {
  ecma: 2016,
  toplevel: true,
  safari10: true,
  format: { comments: false },
};

let independentPackages = [];
async function findIndependentPackages() {
  const { subpackages } = await fs.readJson(
    path.resolve('src', 'app.json'),
    'utf8',
  );
  if (subpackages) {
    independentPackages = subpackages
      .filter(({ independent }) => independent)
      .map(({ root }) => root);
  }
}

const builtLibraries = [];
const bundledModules = new Map();
async function bundleModule(module, pkg) {
  const bundled = bundledModules.get(pkg);
  if (
    bundled?.has(module) ||
    builtLibraries.some((library) => module.startsWith(library))
  ) {
    return false;
  }
  if (bundled) {
    bundled.add(module);
  } else {
    bundledModules.set(pkg, new Set([module]));
  }

  const {
    packageJson: { peerDependencies },
  } = await getPackageInfo(module);
  const bundle = await rollup({
    input: module,
    external: peerDependencies ? Object.keys(peerDependencies) : undefined,
    plugins: [
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        },
      }),
      resolve(),
      __PROD__ && terser(terserOptions),
    ].filter(Boolean),
  });
  await bundle.write({
    exports: 'named',
    file: `${pkg.replace('src', 'dist')}/miniprogram_npm/${module}/index.js`,
    format: 'cjs',
  });
  return true;
}

function traverseAST(ast, pkg, babelOnly = false) {
  traverse.default(ast, {
    CallExpression({ node }) {
      if (
        node.callee.name !== 'require' ||
        !t.isStringLiteral(node.arguments[0]) ||
        node.arguments[0].value.startsWith('.') ||
        (babelOnly && !node.arguments[0].value.startsWith('@babel/runtime'))
      ) {
        return;
      }

      const module = node.arguments[0].value;
      let promise = bundleModule(module, pkg);
      if (babelOnly) {
        promise = promise.then((valid) => {
          if (!valid) return;
          return Promise.all(
            independentPackages.map((item) => {
              const bundled = bundledModules.get(item);
              if (bundled) {
                bundled.add(module);
              } else {
                bundledModules.set(pkg, new Set([module]));
              }
              return fs.copy(
                path.resolve('dist', 'miniprogram_npm', module),
                path.resolve('dist', item, 'miniprogram_npm', module),
              );
            }),
          );
        });
      }
      bundleJobs?.push(promise);
    },
  });
}

async function buildComponentLibrary(name) {
  const {
    rootPath,
    packageJson: { miniprogram },
  } = await getPackageInfo(name);

  let source = '';
  if (miniprogram) {
    source = path.join(rootPath, miniprogram);
  } else {
    try {
      const dist = path.join(rootPath, 'miniprogram_dist');
      const stats = await fs.stat(dist);
      if (stats.isDirectory()) {
        source = dist;
      }
    } catch {
      // Empty
    }
  }

  if (!source) return;

  builtLibraries.push(name);
  const destination = path.resolve('dist', 'miniprogram_npm', name);
  await fs.copy(source, destination);

  return new Promise((resolve) => {
    const jobs = [];
    const tnm = async (filePath) => {
      const result = await babel.transformFileAsync(filePath, { ast: true });
      traverseAST(result.ast, 'src', true);
      const code = __PROD__
        ? (await minify(result.code, terserOptions)).code
        : result.code;
      await fs.writeFile(filePath, code);
    };

    const watcher = chokidar.watch([destination], {
      ignored: (file, stats) => stats?.isFile() && !file.endsWith('.js'),
    });
    watcher.on('add', (filePath) => {
      const promise = tnm(filePath);
      jobs.push(promise);
    });
    watcher.on('ready', async () => {
      const promise = watcher.close();
      jobs.push(promise);
      await Promise.all(jobs);
      if (independentPackages.length > 0) {
        await Promise.all(
          independentPackages.map((item) =>
            fs.copy(
              destination,
              path.resolve('dist', item, 'miniprogram_npm', name),
            ),
          ),
        );
      }
      resolve();
    });
  });
}

async function scanDependencies() {
  const { dependencies } = await fs.readJson('package.json', 'utf8');
  for (const name of Object.keys(dependencies)) {
    const promise = buildComponentLibrary(name);
    topLevelJobs.push(promise);
  }
}

async function processScript(filePath) {
  let ast, code;
  try {
    const result = await babel.transformFileAsync(path.resolve(filePath), {
      ast: true,
    });
    ast = result.ast;
    code = result.code;
  } catch (error) {
    console.error(`Failed to compile ${filePath}`);

    if (__PROD__) throw error;

    console.error(error);
    return;
  }

  const pkg = independentPackages.find((item) =>
    filePath.startsWith(path.normalize(`src/${item}`)),
  );
  // The `src/` prefix is added to to distinguish `src` and `src/src`.
  traverseAST(ast, pkg ? `src/${pkg}` : 'src');

  if (__PROD__) {
    code = (await minify(code, terserOptions)).code;
  }

  const destination = filePath.replace('src', 'dist').replace(/\.ts$/, '.js');
  // Make sure the directory already exists when write file
  await fs.copy(filePath, destination);
  await fs.writeFile(destination, code);
}

async function processTemplate(filePath) {
  const destination = filePath
    .replace('src', 'dist')
    .replace(/\.html$/, '.wxml');
  await fs.copy(filePath, destination);
}

async function processStyle(filePath) {
  const source = await fs.readFile(filePath, 'utf8');
  const { plugins, options } = await postcssrc({ from: filePath });

  let css;
  try {
    const result = await postcss(plugins).process(source, options);
    css = result.css;
  } catch (error) {
    console.error(`Failed to compile ${filePath}`);

    if (__PROD__) throw error;

    console.error(error);
    return;
  }

  const destination = filePath
    .replace('src', 'dist')
    .replace(/\.css$/, '.wxss');
  // Make sure the directory already exists when write file
  await fs.copy(filePath, destination);
  await fs.writeFile(destination, css);
}

const cb = async (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    await processScript(filePath);
    return;
  }

  if (filePath.endsWith('.html')) {
    await processTemplate(filePath);
    return;
  }

  if (filePath.endsWith('.css')) {
    await processStyle(filePath);
    return;
  }

  await fs.copy(filePath, filePath.replace('src', 'dist'));
};

async function dev() {
  await fs.remove('dist');
  await findIndependentPackages();
  await scanDependencies();
  chokidar
    .watch(['src'], {
      ignored: (file, stats) =>
        stats?.isFile() &&
        (file.endsWith('.gitkeep') || file.endsWith('.DS_Store')),
    })
    .on('add', (filePath) => {
      const promise = cb(filePath);
      topLevelJobs?.push(promise);
    })
    .on('change', (filePath) => {
      cb(filePath);
    })
    .on('ready', async () => {
      await Promise.all(topLevelJobs);
      await Promise.all(bundleJobs);
      console.log(bold(green(`启动完成，耗时：${Date.now() - startTime}ms`)));
      console.log(bold(green('监听文件变化中...')));
      // Release memory.
      topLevelJobs = null;
      bundleJobs = null;
    });
}

async function prod() {
  await fs.remove('dist');
  await findIndependentPackages();
  await scanDependencies();
  const watcher = chokidar.watch(['src'], {
    ignored: (file, stats) =>
      stats?.isFile() &&
      (file.endsWith('.gitkeep') || file.endsWith('.DS_Store')),
  });
  watcher.on('add', (filePath) => {
    const promise = cb(filePath);
    topLevelJobs.push(promise);
  });
  watcher.on('ready', async () => {
    const promise = watcher.close();
    topLevelJobs.push(promise);
    await Promise.all(topLevelJobs);
    await Promise.all(bundleJobs);
    console.log(bold(green(`构建完成，耗时：${Date.now() - startTime}ms`)));
  });
}

if (__PROD__) {
  await prod();
} else {
  await dev();
}
