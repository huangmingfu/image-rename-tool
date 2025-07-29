# GitHub Pages 部署设置指南

本指南帮助你解决 GitHub Pages 部署中的权限和配置问题。

## 🔧 问题解决

### 1. 启用 GitHub Pages

首先确保你的仓库已启用 GitHub Pages：

1. **访问仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 "Settings" 标签

2. **配置 Pages 设置**
   - 在左侧菜单中找到 "Pages"
   - 在 "Source" 部分选择 "GitHub Actions"
   - 保存设置

### 2. 检查 Actions 权限

确保 GitHub Actions 有足够的权限：

1. **访问 Actions 设置**
   - 在仓库设置中找到 "Actions" → "General"

2. **配置工作流权限**
   - 找到 "Workflow permissions" 部分
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
   - 点击 "Save"

### 3. 环境保护规则（可选）

如果你想要更严格的部署控制：

1. **创建环境**
   - 在仓库设置中找到 "Environments"
   - 点击 "New environment"
   - 输入名称 `github-pages`

2. **配置保护规则**
   - 可以设置需要审批的分支
   - 可以限制哪些分支可以部署

## 🚀 工作流说明

更新后的 `.github/workflows/documents.yml` 使用了现代的 GitHub Pages 部署方式：

### 主要改进

1. **使用官方 Actions**
   - `actions/upload-pages-artifact@v3` - 上传构建产物
   - `actions/deploy-pages@v4` - 部署到 Pages

2. **正确的权限配置**

   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

3. **分离构建和部署**
   - `build-documentation-pages` - 构建文档
   - `deploy` - 部署到 GitHub Pages

### 工作流触发条件

- **自动触发**: 当 `docs/` 目录或 `README.md` 有变更时
- **手动触发**: 在 Actions 页面手动运行

## 🔍 故障排除

### 常见错误及解决方案

#### 错误: "You have to provide a GITHUB_TOKEN or GH_PAT"

**原因**: 使用了错误的 token 配置或权限不足

**解决方案**:

1. 确保使用 `secrets.GITHUB_TOKEN` 而不是自定义 token
2. 检查 Actions 权限设置
3. 确保工作流有正确的 permissions 配置

#### 错误: "Resource not accessible by integration"

**原因**: GitHub Actions 权限不足

**解决方案**:

1. 在仓库设置中启用 "Read and write permissions"
2. 确保 Pages 源设置为 "GitHub Actions"

#### 错误: "Pages build and deployment"

**原因**: Pages 配置问题

**解决方案**:

1. 检查 Pages 设置是否正确
2. 确保构建输出目录正确（`docs/dist`）
3. 检查构建是否成功完成

### 调试步骤

1. **检查 Actions 日志**
   - 访问仓库的 "Actions" 标签
   - 查看失败的工作流运行
   - 展开每个步骤查看详细日志

2. **验证构建输出**
   - 确保 `npm run build` 在本地能正常工作
   - 检查 `docs/dist` 目录是否包含正确的文件

3. **测试权限**
   - 尝试手动触发工作流
   - 检查是否有权限相关的错误信息

## 📋 检查清单

部署前请确认：

- [ ] GitHub Pages 已启用且源设置为 "GitHub Actions"
- [ ] Actions 权限设置为 "Read and write permissions"
- [ ] 工作流文件包含正确的 permissions 配置
- [ ] 构建命令在本地能正常工作
- [ ] 构建输出目录路径正确

## 🔗 相关文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 权限文档](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [VitePress 部署指南](https://vitepress.dev/guide/deploy#github-pages)

## 💡 提示

- 第一次部署可能需要几分钟时间
- 部署成功后，你的文档将在 `https://your-username.github.io/your-repo-name` 可访问
- 每次推送到 main 分支的 docs 变更都会自动触发重新部署
