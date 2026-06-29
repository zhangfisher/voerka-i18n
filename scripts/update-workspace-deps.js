#!/usr/bin/env node

/**
 * 更新工作区依赖脚本
 *
 * 功能：
 * 1. 读取根 package.json 的 workspaces 字段
 * 2. 获取所有包信息 [包名称, 包版本号, 包路径][]
 * 3. 解析每个包的依赖项，将 workspace: 协议替换为实际版本号
 *
 * 使用方法：
 *   node scripts/update-workspace-deps.js [根目录路径]
 *
 * 示例：
 *   node scripts/update-workspace-deps.js
 *   node scripts/update-workspace-deps.js ./scripts/monorepo
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 读取 JSON 文件
 */
function readJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 读取文件失败: ${filePath}`);
    console.error(error.message);
    return null;
  }
}

/**
 * 写入 JSON 文件
 */
function writeJSON(filePath, data) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`✅ 已更新: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ 写入文件失败: ${filePath}`);
    console.error(error.message);
    return false;
  }
}

/**
 * 将 glob 模式转换为路径数组
 */
function globToPatterns(globPatterns) {
  // 简单实现：支持 packages/* 这种模式
  const patterns = [];
  for (const pattern of globPatterns) {
    if (pattern.includes('*')) {
      // 这里简化处理，实际可以使用 fast-glob 等库
      patterns.push(pattern.replace('*', ''));
    } else {
      patterns.push(pattern);
    }
  }
  return patterns;
}

/**
 * 递归查找匹配 workspaces 的包目录
 */
function findPackageDirs(baseDir, workspacePatterns) {
  const packageDirs = [];

  for (const pattern of workspacePatterns) {
    // 处理 packages/* 模式
    if (pattern.endsWith('/*')) {
      const parentDir = join(baseDir, pattern.replace('/*', ''));
      if (!existsSync(parentDir)) continue;

      const dirs = readdirSync(parentDir, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory()) {
          const pkgPath = join(parentDir, dir.name);
          const pkgJsonPath = join(pkgPath, 'package.json');
          if (existsSync(pkgJsonPath)) {
            packageDirs.push(pkgPath);
          }
        }
      }
    } else {
      // 直接路径
      const pkgPath = join(baseDir, pattern);
      if (existsSync(join(pkgPath, 'package.json'))) {
        packageDirs.push(pkgPath);
      }
    }
  }

  return packageDirs;
}

/**
 * 获取所有包信息
 * @returns [包名称, 包版本号, 包路径][]
 */
function getPackagesInfo(rootDir) {
  const rootPkgJsonPath = join(rootDir, 'package.json');

  if (!existsSync(rootPkgJsonPath)) {
    console.error(`❌ 根目录未找到 package.json: ${rootDir}`);
    return [];
  }

  const rootPkg = readJSON(rootPkgJsonPath);
  if (!rootPkg || !rootPkg.workspaces) {
    console.error(`❌ 根 package.json 中未找到 workspaces 字段`);
    return [];
  }

  console.log(`📦 工作区配置:`, rootPkg.workspaces);

  // 查找所有包目录rootPkg.workspaces
  const packageDirs = findPackageDirs(rootDir, ["packages/*"]);
  console.log(`🔍 找到 ${packageDirs.length} 个包目录`);

  const packagesInfo = [];

  for (const pkgDir of packageDirs) {
    const pkgJsonPath = join(pkgDir, 'package.json');
    const pkg = readJSON(pkgJsonPath);

    if (pkg && pkg.name && pkg.version) {
      packagesInfo.push([pkg.name, pkg.version, pkgDir]);
      console.log(`  - ${pkg.name}@${pkg.version} (${pkgDir})`);
    }
  }

  return packagesInfo;
}

/**
 * 更新依赖项中的 workspace: 协议
 */
function updateWorkspaceDeps(dependencies, packagesMap, packageName) {
  if (!dependencies) return dependencies;

  let updated = false;

  for (const [depName, depVersion] of Object.entries(dependencies)) {
    // 检查是否是 workspace: 协议
    if (typeof depVersion === 'string' && depVersion.startsWith('workspace:')) {
      const workspaceProtocol = depVersion;

      // 检查依赖是否在包列表中
      if (packagesMap.has(depName)) {
        const [, targetVersion] = packagesMap.get(depName);
        const range = workspaceProtocol.replace('workspace:', '');

        // 处理不同的 range 前缀，统一添加 ^ 前缀（除了 ~）
        if (range === '~') {
          dependencies[depName] = `~${targetVersion}`;
        } else {
          // 所有其他情况都添加 ^ 前缀
          dependencies[depName] = `^${targetVersion}`;
        }

        console.log(`    ${depName}: ${workspaceProtocol} -> ${dependencies[depName]}`);
        updated = true;
      } else {
        // 包不存在于工作区，更新为 latest
        dependencies[depName] = 'latest';
        console.log(`    ${depName}: ${workspaceProtocol} -> latest (包不存在于工作区)`);
        updated = true;
      }
    }
  }

  return updated ? dependencies : null;
}

/**
 * 处理单个包的依赖更新
 */
function processPackage(pkgInfo, packagesMap) {
  const [pkgName, , pkgPath] = pkgInfo;
  const pkgJsonPath = join(pkgPath, 'package.json');

  console.log(`\n📄 处理包: ${pkgName}`);

  const pkg = readJSON(pkgJsonPath);
  if (!pkg) return false;

  let updated = false;

  // 处理 dependencies
  if (pkg.dependencies) {
    const newDeps = updateWorkspaceDeps(pkg.dependencies, packagesMap, pkgName);
    if (newDeps) {
      pkg.dependencies = newDeps;
      updated = true;
    }
  }

  // 处理 devDependencies
  if (pkg.devDependencies) {
    const newDeps = updateWorkspaceDeps(pkg.devDependencies, packagesMap, pkgName);
    if (newDeps) {
      pkg.devDependencies = newDeps;
      updated = true;
    }
  }

  // 处理 peerDependencies
  if (pkg.peerDependencies) {
    const newDeps = updateWorkspaceDeps(pkg.peerDependencies, packagesMap, pkgName);
    if (newDeps) {
      pkg.peerDependencies = newDeps;
      updated = true;
    }
  }

  // 处理 optionalDependencies
  if (pkg.optionalDependencies) {
    const newDeps = updateWorkspaceDeps(pkg.optionalDependencies, packagesMap, pkgName);
    if (newDeps) {
      pkg.optionalDependencies = newDeps;
      updated = true;
    }
  }

  // 写入更新后的 package.json
  if (updated) {
    return writeJSON(pkgJsonPath, pkg);
  } else {
    console.log(`  ℹ️  无需更新`);
    return true;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始更新工作区依赖...\n');

  // 获取根目录（默认为项目根目录，可接受参数）
  const args = process.argv.slice(2);
  const rootDir = args[0] ? resolve(args[0]) : resolve(__dirname, '..');

  console.log(`📁 根目录: ${rootDir}\n`);

  // 获取所有包信息
  const packagesInfo = getPackagesInfo(rootDir);

  if (packagesInfo.length === 0) {
    console.error('❌ 未找到任何包');
    process.exit(1);
  }

  // 创建包映射表：包名 -> [包名, 版本号, 路径]
  const packagesMap = new Map(
    packagesInfo.map(([name, version, path]) => [name, [name, version, path]])
  );

  console.log('\n📋 包列表:');
  for (const [name, version] of packagesInfo) {
    console.log(`  - ${name}@${version}`);
  }

  // 处理每个包
  console.log('\n🔄 开始更新依赖...\n');
  let successCount = 0;
  let failCount = 0;

  for (const pkgInfo of packagesInfo) {
    const success = processPackage(pkgInfo, packagesMap);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // 输出结果
  console.log('\n' + '='.repeat(50));
  console.log(`✨ 完成! 成功: ${successCount}, 失败: ${failCount}`);
  console.log('='.repeat(50));
}

// 运行主函数
main();
