#!/bin/bash

# 图片重命名工具 - GitHub Release 创建脚本
# 使用前请确保已安装 GitHub CLI: https://cli.github.com/
# 注意：请确保已经运行过构建命令（pnpm run build:mac 和 pnpm run build:win）

VERSION="1.2.0"
RELEASE_DIR="./release/${VERSION}"

echo "🚀 创建 GitHub Release v${VERSION}..."

# 检查构建文件是否存在
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ 错误: 找不到构建目录 $RELEASE_DIR"
    echo "请先运行构建命令："
    echo "  pnpm run build:mac"
    echo "  pnpm run build:win"
    exit 1
fi

# 创建 release
gh release create "v${VERSION}" \
  --title "v${VERSION} - 图片重命名工具" \
  --notes "## 🎉 图片重命名工具 v${VERSION}

### 📦 下载安装包
- **Windows 用户**: 下载 \`image-rename-tool ${VERSION}_x64.zip\`
- **Mac 用户**:
  - Intel 芯片: 下载 \`image-rename-tool ${VERSION}_x64.dmg\`
  - Apple Silicon (M1/M2): 下载 \`image-rename-tool ${VERSION}_arm64.dmg\`
  - 通用版本: 下载 \`image-rename-tool ${VERSION}_universal.dmg\`

### ✨ 新功能
- 请在此处添加新功能说明

### 🐛 修复
- 请在此处添加修复说明

### 📋 安装说明
- **Windows**: 解压 zip 文件后运行 exe 文件
- **Mac**: 下载 dmg 文件，双击安装后从应用程序文件夹启动" \
  "${RELEASE_DIR}/image-rename-tool ${VERSION}_x64.zip" \
  "${RELEASE_DIR}/image-rename-tool ${VERSION}_x64.dmg" \
  "${RELEASE_DIR}/image-rename-tool ${VERSION}_arm64.dmg" \
  "${RELEASE_DIR}/image-rename-tool ${VERSION}_universal.dmg"

echo "✅ Release 创建完成！"
echo "🔗 访问: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/releases"
