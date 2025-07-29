# 发布指南

本文档介绍如何将构建好的应用程序发布到 GitHub Release。

## 📦 构建应用程序

首先确保你已经构建了所需平台的应用程序：

```bash
# 构建 Mac 版本
pnpm run build:mac

# 构建 Windows 版本
pnpm run build:win

# 构建所有平台
pnpm run build:all
```

构建完成后，安装包会保存在 `release/{version}/` 目录中。

## 🚀 发布方法

### 方法一：手动发布（推荐新手）

1. **访问 GitHub 仓库**
   - 打开你的 GitHub 仓库页面
   - 点击 "Releases" 标签

2. **创建新 Release**
   - 点击 "Create a new release"
   - 填写标签版本（如 `v1.2.0`）
   - 填写发布标题和说明

3. **上传文件**
   - 将以下文件拖拽到 "Attach binaries" 区域：
     - `image-rename-tool {version}_x64.zip` (Windows)
     - `image-rename-tool {version}_x64.dmg` (Mac Intel)
     - `image-rename-tool {version}_arm64.dmg` (Mac Apple Silicon)
     - `image-rename-tool {version}_universal.dmg` (Mac 通用版)

4. **发布**
   - 点击 "Publish release"

### 方法二：使用脚本发布

1. **安装 GitHub CLI**

   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli
   ```

2. **登录 GitHub**

   ```bash
   gh auth login
   ```

3. **运行发布脚本**
   ```bash
   chmod +x scripts/create-release.sh
   ./scripts/create-release.sh
   ```

### 方法三：自动化发布

使用 GitHub Actions 实现自动构建和发布：

1. **推送标签触发**

   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

2. **手动触发**
   - 在 GitHub 仓库的 "Actions" 标签页
   - 选择 "Build and Release" 工作流
   - 点击 "Run workflow"
   - 输入版本号并运行

## 📋 发布检查清单

发布前请确认：

- [ ] 版本号已更新（package.json）
- [ ] 更新日志已编写（CHANGELOG.md）
- [ ] 应用程序已在目标平台测试
- [ ] 构建文件完整且可运行
- [ ] Release 说明清晰明了
- [ ] 下载链接和安装说明正确

## 🔧 故障排除

### 构建失败

- 检查 Node.js 版本（需要 >= 20.0.0）
- 检查 pnpm 版本：`pnpm --version`
- 清理依赖：`rm -rf node_modules && pnpm install`
- 检查构建日志中的错误信息

### 上传失败

- 确认文件大小不超过 GitHub 限制（2GB）
- 检查网络连接
- 确认 GitHub 权限设置

### 自动化发布失败

- 检查 GitHub Actions 权限
- 确认 GITHUB_TOKEN 可用
- 查看 Actions 日志中的详细错误

## 📚 相关文档

- [GitHub Releases 官方文档](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [GitHub CLI 文档](https://cli.github.com/manual/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
