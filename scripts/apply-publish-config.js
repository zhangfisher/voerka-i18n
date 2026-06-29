#!/usr/bin/env bun

/**
 * 遍历 packages/* 下的所有 package.json
 * 将 publishConfig 字段合并到根级别，并覆盖原 package.json
 * 跳过 private=true 的包
 *
 * 用法:
 *   bun run apply-publish-config.js          # 正常执行
 *   bun run apply-publish-config.js --dry-run # 仅预览，不修改文件
 */

import { resolve } from 'node:path'
import { readdirSync, existsSync } from 'node:fs'

// 解析命令行参数
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-d')

/**
 * 处理单个 package.json
 */
async function applyPublishConfig(pkgPath) {
	// 读取 package.json
	const file = Bun.file(pkgPath)
	if (!file.exists()) {
		console.warn(`⚠ 未找到: ${pkgPath}`)
		return
	}

	const originalContent = await file.text()
	const pkg = JSON.parse(originalContent)

	// 跳过私有包
	if (pkg.private === true) {
		console.log(`⊘ 跳过私有包: ${pkg.name || pkgPath}`)
		return
	}

	// 检查是否存在 publishConfig
	if (!pkg.publishConfig) {
		console.log(`✓ 无 publishConfig: ${pkg.name || pkgPath}`)
		return
	}

	// 创建新的 package 对象，合并 publishConfig 到根级别
	const distPkg = {
		...pkg,
		...pkg.publishConfig,
	}
	// 删除 publishConfig 字段
	delete distPkg.publishConfig

	if (dryRun) {
		console.log(`[DRY-RUN] 将应用: ${pkg.name || pkgPath}`)
		console.log(`  publishConfig: ${JSON.stringify(pkg.publishConfig)}`)
		return
	}

	// 覆盖原 package.json
	await Bun.write(pkgPath, JSON.stringify(distPkg, null, '\t'))

	console.log(`✓ 已应用: ${pkg.name || pkgPath}`)
}

/**
 * 遍历当前目录下 packages/* 中的 package.json 并处理
 */
async function main() {
	const cwd = process.cwd()
	const packagesDir = resolve(cwd, 'packages')

	// 读取 packages 目录下的所有子目录
	const entries = readdirSync(packagesDir, { withFileTypes: true })
	const pkgDirs = entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)

	console.log(`找到 ${pkgDirs.length} 个包${dryRun ? ' (DRY-RUN 模式)' : ''}\n`)

	for (const dirName of pkgDirs) {
		const pkgPath = resolve(packagesDir, dirName, 'package.json')
		if (existsSync(pkgPath)) {
			await applyPublishConfig(pkgPath)
		}
	}

	console.log(`\n处理完成`)
}

main()
