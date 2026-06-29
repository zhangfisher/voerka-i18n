# update-workspace-deps.js 使用说明

## 功能

该脚本用于更新 monorepo 项目中的 `workspace:` 协议依赖为实际版本号。

## 核心功能

1. **读取 workspaces 配置**: 从根目录的 `package.json` 读取 workspaces 字段
2. **收集包信息**: 获取所有包的信息 `[包名称, 包版本号, 包路径]`
3. **更新依赖**: 将每个包的 `workspace:` 协议依赖替换为实际版本号

## 转换规则

- **workspace:*** → 带 `^` 的版本号 (例如: `^1.2.3`)
- **workspace:^** → 带 `^` 的版本号 (例如: `^1.2.3`)
- **workspace:~** → 带 `~` 的版本号 (例如: `~1.2.3`)

> ⚠️ **注意**: 所有工作区依赖都会统一添加 `^` 前缀（除了明确使用 `~` 的情况），以兼容 npm 的语义化版本控制。

## 特殊处理

- ✅ 如果依赖包在工作区中存在 → 使用该包的实际版本号
- ❌ 如果依赖包不在工作区中 → 替换为 `latest`

## 支持的依赖类型

- `dependencies`
- `devDependencies`
- `peerDependencies`
- `optionalDependencies`

## 使用方法

### 基本用法

```bash
# 更新当前项目根目录的工作区依赖
node scripts/update-workspace-deps.js

# 更新指定目录的工作区依赖
node scripts/update-workspace-deps.js ./scripts/monorepo
```

### 测试示例

```bash
# 测试脚本功能（使用测试环境）
node scripts/update-workspace-deps.js scripts/monorepo
```

## 测试环境

测试环境位于 `scripts/monorepo/`，包含 3 个测试包：

```
scripts/monorepo/
├── package.json
└── packages/
    ├── pkg-a/  (v1.2.3)
    ├── pkg-b/  (v2.0.0)
    └── pkg-c/  (v3.1.0)
```

### 测试用例

**pkg-a/package.json**:
- 依赖 `pkg-b`: `workspace:*` → `2.0.0` ✅
- 依赖 `pkg-c`: `workspace:*` → `3.1.0` ✅

**pkg-b/package.json**:
- 依赖 `pkg-a`: `workspace:^` → `^1.2.3` ✅
- 依赖 `external-pkg`: `workspace:*` → `latest` (不存在于工作区) ✅
- 依赖 `pkg-c`: `workspace:~` → `~3.1.0` ✅

**pkg-c/package.json**:
- 依赖 `pkg-a`: `workspace:*` → `1.2.3` ✅
- 依赖 `pkg-b`: `workspace:^` → `^2.0.0` ✅

## 输出示例

```
🚀 开始更新工作区依赖...

📁 根目录: e:\Work\Code\sources\autostore\scripts\monorepo

📦 工作区配置: [ 'packages/*' ]
🔍 找到 3 个包目录
  - pkg-a@1.2.3 (e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-a)
  - pkg-b@2.0.0 (e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-b)
  - pkg-c@3.1.0 (e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-c)

📋 包列表:
  - pkg-a@1.2.3
  - pkg-b@2.0.0
  - pkg-c@3.1.0

🔄 开始更新依赖...

📄 处理包: pkg-a
    pkg-b: workspace:* -> 2.0.0
    pkg-c: workspace:* -> 3.1.0
✅ 已更新: e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-a\package.json

📄 处理包: pkg-b
    pkg-a: workspace:^ -> ^1.2.3
    external-pkg: workspace:* -> latest (包不存在于工作区)
    pkg-c: workspace:~ -> ~3.1.0
✅ 已更新: e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-b\package.json

📄 处理包: pkg-c
    pkg-a: workspace:* -> 1.2.3
    pkg-b: workspace:^ -> ^2.0.0
✅ 已更新: e:\Work\Code\sources\autostore\scripts\monorepo\packages\pkg-c\package.json

==================================================
✨ 完成! 成功: 3, 失败: 0
==================================================
```

## 技术实现

- **模块类型**: ES Module
- **依赖**: 仅使用 Node.js 内置模块
  - `fs` - 文件系统操作
  - `path` - 路径处理
  - `url` - 模块 URL 处理

## 注意事项

⚠️ **警告**: 该脚本会直接修改 `package.json` 文件，建议在执行前提交代码或创建备份。

## 在项目中使用

可以将脚本添加到 `package.json` 的 scripts 中：

```json
{
  "scripts": {
    "update:deps": "node scripts/update-workspace-deps.js"
  }
}
```

然后使用：

```bash
bun run update:deps
# 或
npm run update:deps
```
