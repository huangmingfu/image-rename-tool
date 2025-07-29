# 🚀 快速发布指南

你已经有了构建好的文件，现在可以快速发布到 GitHub Release！

## 📁 当前构建文件

你的 `release/1.2.0/` 目录中有以下文件：

- `image-rename-tool 1.2.0_x64.zip` - Windows 版本
- `image-rename-tool 1.2.0_x64.dmg` - Mac Intel 版本
- `image-rename-tool 1.2.0_arm64.dmg` - Mac Apple Silicon 版本
- `image-rename-tool 1.2.0_universal.dmg` - Mac 通用版本

## 🎯 立即发布（推荐）

### 方法 1: 手动上传（最简单）

1. **打开 GitHub 仓库**
   - 访问你的仓库页面
   - 点击右侧的 "Releases"

2. **创建新 Release**
   - 点击 "Create a new release"
   - Tag version: 输入 `v1.2.0`
   - Release title: 输入 `v1.2.0 - 图片重命名工具`

3. **添加说明**

   ```markdown
   ## 🎉 图片重命名工具 v1.2.0

   ### 📦 下载安装包

   - **Windows 用户**: 下载 `image-rename-tool 1.2.0_x64.zip`
   - **Mac 用户**:
     - Intel 芯片: 下载 `image-rename-tool 1.2.0_x64.dmg`
     - Apple Silicon (M1/M2): 下载 `image-rename-tool 1.2.0_arm64.dmg`
     - 通用版本: 下载 `image-rename-tool 1.2.0_universal.dmg`

   ### 📋 安装说明

   - **Windows**: 解压 zip 文件后运行 exe 文件
   - **Mac**: 下载 dmg 文件，双击安装后从应用程序文件夹启动

   ### ✨ 主要功能

   - 自动将中文图片文件名转换为英文
   - 支持多种命名规则和自动分类
   - 简洁易用的桌面应用界面
   ```

4. **上传文件**
   - 将以下 4 个文件拖拽到 "Attach binaries" 区域：
     - `release/1.2.0/image-rename-tool 1.2.0_x64.zip`
     - `release/1.2.0/image-rename-tool 1.2.0_x64.dmg`
     - `release/1.2.0/image-rename-tool 1.2.0_arm64.dmg`
     - `release/1.2.0/image-rename-tool 1.2.0_universal.dmg`

5. **发布**
   - 点击 "Publish release"

### 方法 2: 使用脚本（需要 GitHub CLI）

1. **安装 GitHub CLI**

   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli
   ```

2. **登录**

   ```bash
   gh auth login
   ```

3. **运行脚本**
   ```bash
   chmod +x scripts/create-release.sh
   ./scripts/create-release.sh
   ```

### 方法 3: 使用 GitHub Actions

1. **提交构建文件**（如果还没有）

   ```bash
   git add release/
   git commit -m "Add release builds for v1.2.0"
   git push
   ```

2. **触发手动发布**
   - 访问你的仓库 → Actions 标签
   - 选择 "Manual Release" 工作流
   - 点击 "Run workflow"
   - 输入版本号 `v1.2.0`
   - 点击 "Run workflow"

## ⚠️ 注意事项

1. **文件大小**: 确保每个文件小于 2GB
2. **文件完整性**: 建议在发布前测试安装包
3. **版本号**: 确保版本号与 package.json 中的一致
4. **更新说明**: 添加清晰的更新说明和安装指导

## 🔍 发布后检查

发布完成后，请检查：

- [ ] Release 页面显示正常
- [ ] 所有文件都能正常下载
- [ ] 下载的文件能正常安装和运行
- [ ] Release 说明清晰易懂

## 📞 需要帮助？

如果遇到问题，可以：

1. 检查 GitHub 仓库的 Issues 页面
2. 查看 GitHub Actions 的运行日志
3. 确认文件路径和权限设置

---

**推荐**: 对于第一次发布，建议使用方法 1（手动上传），这样可以更好地控制发布过程。
