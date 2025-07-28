#!/bin/bash

# 文档构建测试脚本
# 用于验证 VitePress 文档是否能正常构建

echo "🔍 测试文档构建..."

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 检查是否在正确的目录
if [ ! -f "docs/package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 进入 docs 目录
cd docs

echo "📦 安装文档依赖..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install
elif [ -f "package-lock.json" ]; then
    npm install
else
    npm install
fi

echo "🏗️ 构建文档..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm run build
else
    npm run build
fi

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 文档构建成功！"
    echo "📁 构建输出目录: docs/dist"
    echo "📄 文件列表:"
    ls -la dist/
    
    # 检查关键文件
    if [ -f "dist/index.html" ]; then
        echo "✅ 主页文件存在"
    else
        echo "⚠️  警告: 找不到 index.html"
    fi
    
    echo ""
    echo "🚀 你可以通过以下方式预览文档:"
    echo "   cd docs && npm run serve"
    echo ""
    echo "📤 现在可以提交更改并推送到 GitHub 触发自动部署:"
    echo "   git add ."
    echo "   git commit -m 'Update documentation'"
    echo "   git push"
    
else
    echo "❌ 文档构建失败！"
    echo "请检查构建日志中的错误信息"
    exit 1
fi
