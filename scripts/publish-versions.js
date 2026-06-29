#!/usr/bin/env bun

/**
 * 更新所有包的版本号并创建 release-<版本号> tag
 *
 * 用法:
 *   bun run update-versions -v 1.2.3          # 更新版本号并创建 tag
 *   bun run update-versions -v 1.2.3 --dry-run # 预览模式
 */

import { $ } from "bun";
import { resolve } from "node:path";
import { readdirSync, existsSync } from "node:fs";

// 解析命令行参数
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-d");
const autoCommit = args.includes("--auto-commit") || args.includes("-a");

// 获取版本号参数
const versionIndex = args.indexOf("-v");
if (versionIndex === -1 || versionIndex === args.length - 1) {
    console.error(`❌ 错误: 请提供版本号`);
    console.error(`\n用法: bun run publish-versions -v <版本号>`);
    console.error(`示例: bun run publish-versions -v 1.2.3`);
    console.error(`      bun run publish-versions -v 1.2.3 --dry-run`);
    console.error(`      bun run publish-versions -v 1.2.3 --auto-commit`);
    process.exit(1);
}

const targetVersion = args[versionIndex + 1];

// 记录执行状态，用于回滚
let hasUpdatedPackages = false;
let hasCreatedTag = false;

/**
 * 验证版本号格式
 */
function validateVersion(version) {
    // 简单的语义化版本号验证：major.minor.patch
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version)) {
        console.error(`❌ 错误: 版本号格式无效`);
        console.error(`   格式应为: major.minor.patch (例如: 1.2.3)`);
        console.error(`   收到的: ${version}`);
        process.exit(1);
    }
    return true;
}

/**
 * 检查是否存在未提交的文件
 */
async function checkUncommittedChanges() {
    try {
        const result = await $`git status --porcelain`.quiet();
        const output = result.stdout.toString().trim();

        if (output) {
            return true; // 存在未提交的文件
        }
        return false;
    } catch (error) {
        console.warn(`⚠ 无法检查 git 状态`);
        return false;
    }
}

/**
 * 自动提交未提交的文件
 */
async function autoCommitChanges(version) {
    try {
        console.log(`\n📝 检测到未提交的文件，开始自动提交...`);

        // 添加所有更改
        await $`git add .`.quiet();
        console.log(`✓ 已添加所有文件到暂存区`);

        // 提交
        await $`git commit -m "chore: bump version to ${version}"`.quiet();
        console.log(`✓ 已创建提交: chore: bump version to ${version}`);

        return true;
    } catch (error) {
        console.error(`✗ 自动提交失败`);
        console.error(`   ${error.stderr?.toString() || error.message}`);
        return false;
    }
}

/**
 * 更新单个 package.json 的版本号
 */
async function updatePackageVersion(pkgPath, newVersion) {
    const file = Bun.file(pkgPath);
    if (!file.exists()) {
        console.warn(`⚠ 未找到: ${pkgPath}`);
        return false;
    }

    const content = await file.text();
    const pkg = JSON.parse(content);

    // 跳过私有包
    if (pkg.private === true) {
        console.log(`⊘ 跳过私有包: ${pkg.name || pkgPath}`);
        return false;
    }

    // 检查版本号是否需要更新
    if (pkg.version === newVersion) {
        console.log(`= 版本已是最新: ${pkg.name} ${newVersion}`);
        return false;
    }

    if (dryRun) {
        console.log(`[DRY-RUN] 将更新: ${pkg.name}`);
        console.log(`  ${pkg.version} → ${newVersion}`);
        return true;
    }

    // 更新版本号
    const oldVersion = pkg.version;
    pkg.version = newVersion;
    await Bun.write(pkgPath, JSON.stringify(pkg, null, "\t"));

    console.log(`✓ 已更新: ${pkg.name} ${oldVersion} → ${newVersion}`);
    return true;
}

/**
 * 撤销所有更改
 */
async function rollbackChanges(tagName) {
    if (dryRun) {
        console.log(`\n[DRY-RUN] 将撤销更改`);
        console.log(`[DRY-RUN] 将删除标签: ${tagName}`);
        return;
    }

    console.log(`\n⚠ 执行撤销操作...`);

    try {
        // 撤销 package.json 的更改
        if (hasUpdatedPackages) {
            try {
                await $`git checkout -- package.json packages/*/package.json`.quiet();
                console.log(`✓ 已撤销 package.json 的更改`);
            } catch (checkoutError) {
                console.warn(
                    `⚠ 撤销 package.json 失败: ${checkoutError.stderr?.toString() || checkoutError.message}`,
                );
            }
        }

        // 删除已创建的标签
        if (hasCreatedTag) {
            try {
                await $`git tag -d ${tagName}`.quiet();
                console.log(`✓ 已删除本地标签: ${tagName}`);
            } catch (tagError) {
                console.warn(`⚠ 删除标签失败: ${tagError.stderr?.toString() || tagError.message}`);
            }
        }

        console.log(`\n✅ 撤销完成`);
    } catch (error) {
        console.error(`\n✗ 撤销过程中出现错误`);
        console.error(`   ${error.message || error}`);
    }
}

/**
 * 推送标签到远程仓库
 */
async function pushTagToRemote(tagName) {
    if (dryRun) {
        console.log(`[DRY-RUN] 将推送标签到远程: ${tagName}`);
        return;
    }

    try {
        await $`git push origin ${tagName}`.quiet();
        console.log(`✓ 已推送标签到远程: ${tagName}`);
    } catch (pushError) {
        // 检查各种错误情况
        const pushStderr = pushError.stderr?.toString() || "";
        if (pushStderr.includes("already exists")) {
            console.log(`ℹ 标签已在远程存在: ${tagName}`);
        } else if (pushStderr.includes("does not appear to be a git repository")) {
            // 没有配置远程仓库，给出提示但不抛出错误
            console.log(`⚠ 未配置远程仓库，跳过推送`);
            console.log(`💡 提示: 如需推送，请先配置远程仓库`);
        } else {
            console.error(`✗ 推送标签失败`);
            console.error(`   ${pushStderr}`);
            throw pushError;
        }
    }
}

/**
 * 创建 release-<版本号> tag
 */
async function createPublishTag(version) {
    const tagName = `release-${version}`;

    if (dryRun) {
        console.log(`\n[DRY-RUN] 将创建标签: ${tagName}`);
        return;
    }

    try {
        // 创建标签
        await $`git tag ${tagName}`.quiet();
        console.log(`\n✓ 已创建标签: ${tagName}`);

        // 标记已创建标签
        hasCreatedTag = true;
    } catch (error) {
        // 检查是否是标签已存在的错误
        const stderr = error.stderr?.toString() || "";
        if (stderr.includes("already exists")) {
            console.log(`\nℹ 标签已存在: ${tagName}`);
            // 标签已存在也算作成功创建，因为后续可以推送
            hasCreatedTag = true;
        } else {
            console.error(`\n✗ 创建标签失败`);
            console.error(`   ${stderr}`);
            throw error;
        }
    }
}

/**
 * 更新所有包的版本号
 */
async function updateAllPackageVersions(targetVersion) {
    const cwd = process.cwd();
    const packagesDir = resolve(cwd, "packages");
    const entries = readdirSync(packagesDir, { withFileTypes: true });
    const pkgDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    console.log(`找到 ${pkgDirs.length} 个包${dryRun ? " (DRY-RUN 模式)" : ""}\n`);

    let updatedCount = 0;
    for (const dirName of pkgDirs) {
        const pkgPath = resolve(packagesDir, dirName, "package.json");
        if (existsSync(pkgPath)) {
            const updated = await updatePackageVersion(pkgPath, targetVersion);
            if (updated) updatedCount++;
        }
    }

    // 标记已更新包版本号
    if (updatedCount > 0 && !dryRun) {
        hasUpdatedPackages = true;
    }

    return updatedCount;
}

/**
 * 主函数
 */
async function main() {
    const tagName = `release-${targetVersion}`;

    try {
        // 验证版本号
        validateVersion(targetVersion);

        // 检查是否存在未提交的文件
        if (!dryRun) {
            const hasUncommitted = await checkUncommittedChanges();

            if (hasUncommitted) {
                if (autoCommit) {
                    // 自动提交未提交的文件
                    const committed = await autoCommitChanges(targetVersion);
                    if (!committed) {
                        console.error(`\n❌ 自动提交失败，请手动处理后重试`);
                        process.exit(1);
                    }
                } else {
                    // 提示用户存在未提交的文件
                    console.error(`\n❌ 错误: 当前工作区存在未提交的文件`);
                    console.error(`\n请先提交或暂存这些更改后再运行此脚本`);
                    console.error(`\n提示: 可以使用 --auto-commit 参数自动提交这些更改`);
                    console.error(`\n查看未提交的文件:`);
                    await $`git status`.quiet();
                    process.exit(1);
                }
            }
        }

        console.log(`📦 更新包版本号\n`);
        console.log(`📌 目标版本: ${targetVersion}\n`);

        // 更新所有包的版本号
        const updatedCount = await updateAllPackageVersions(targetVersion);

        // 创建 publish tag
        await createPublishTag(targetVersion);

        // 推送标签到远程
        await pushTagToRemote(tagName);

        console.log();
        if (dryRun) {
            console.log(
                `📊 预览完成: 将更新 ${updatedCount} 个包并创建标签 release-${targetVersion}`,
            );
        } else {
            console.log(
                `✅ 更新完成: 已更新 ${updatedCount} 个包并创建标签 release-${targetVersion}`,
            );
        }
    } catch (error) {
        console.error(`\n❌ 执行过程中出现错误`);
        console.error(`   ${error.message || error}`);

        // 执行撤销操作
        await rollbackChanges(tagName);

        // 退出程序
        process.exit(1);
    }
}

main();
