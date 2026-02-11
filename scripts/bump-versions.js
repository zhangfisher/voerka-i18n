#!/usr/bin/env node

/**
 * 自动递增所有 @voerkai18n 包的版本号
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 读取 package.json
function readPackageJson(pkgPath) {
  const content = readFileSync(pkgPath, 'utf-8');
  return JSON.parse(content);
}

// 写入 package.json
function writePackageJson(pkgPath, pkg) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

// 递增版本号
function bumpVersion(version) {
  const parts = version.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: ${version}`);
  }
  parts[2] = parseInt(parts[2], 10) + 1;
  return parts.join('.');
}

// 主函数
function main() {
  console.log('📦 开始自动递增包版本号...\n');

  const packagesDir = join(rootDir, 'packages');
  const packageDirs = readdirSync(packagesDir, { withFileTypes: true });
  const packages = [];

  // 遍历 packages 目录
  for (const dir of packageDirs) {
    if (!dir.isDirectory()) continue;

    const pkgPath = join(packagesDir, dir.name, 'package.json');

    // 检查 package.json 是否存在
    try {
      statSync(pkgPath);
    } catch {
      continue;
    }

    const pkgJson = readPackageJson(pkgPath);

    // 只处理 @voerkai18n 包且不是 private 的
    if (pkgJson.name?.startsWith('@voerkai18n/') && pkgJson.private !== true) {
      packages.push({
        name: pkgJson.name,
        path: join('packages', dir.name),
        version: pkgJson.version
      });
    }
  }

  // 按名称排序
  packages.sort((a, b) => a.name.localeCompare(b.name));

  console.log(`找到 ${packages.length} 个需要更新的包:\n`);

  // 递增每个包的版本号
  for (const pkg of packages) {
    const pkgPath = join(rootDir, pkg.path, 'package.json');
    const pkgJson = readPackageJson(pkgPath);
    const oldVersion = pkgJson.version;
    const newVersion = bumpVersion(oldVersion);

    pkgJson.version = newVersion;
    writePackageJson(pkgPath, pkgJson);

    console.log(`  ${pkg.name}`);
    console.log(`    ${oldVersion} → ${newVersion}\n`);
  }

  console.log('✅ 版本号更新完成！');
}

main();
