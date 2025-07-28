<div align="center">

# 📸 图片重命名工具

一个基于 Electron + Vue 3 的桌面应用，专门用于将中文图片文件名自动转换为英文

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

**自动将中文文件名转换为英文，支持多种命名规则和自动分类**

</div>

## ✨ 主要功能

### 🌏 智能翻译

- **中文转英文**：自动将中文文件名转换为英文
- **拼音转换**：使用 pinyin 库进行准确的中文拼音转换
- **备选方案**：集成 transliteration 库作为翻译备选

### 📝 多种命名规则

- **小驼峰** (camelCase)：`myImageFile.jpg`
- **大驼峰** (PascalCase)：`MyImageFile.jpg`
- **下划线** (snake_case)：`my_image_file.jpg`
- **短横线** (kebab-case)：`my-image-file.jpg`
- **小写** (lowercase)：`myimagefile.jpg`

### 📁 文件管理

- **批量处理**：一次性处理整个文件夹的图片
- **格式支持**：支持 jpg, jpeg, png, gif, bmp, webp, svg 等常见图片格式
- **预览功能**：重命名前可预览所有更改
- **安全操作**：重命名前检查文件冲突

### 🎨 用户界面

- **现代化设计**：基于 Vuetify 3 的 Material Design 风格
- **响应式布局**：适配不同屏幕尺寸
- **深色/浅色主题**：支持主题切换
- **中英文界面**：完整的国际化支持

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Windows 10+, macOS 10.15+, 或 Linux

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd vutron

# 安装依赖
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev
```

### 构建应用

```bash
# 构建 Windows 版本
npm run build:win

# 构建 macOS 版本 (需要在 macOS 上运行)
npm run build:mac

# 构建 Linux 版本
npm run build:linux

# 构建所有平台版本
npm run build:all
```

## 📖 使用指南

### 基本使用流程

1. **启动应用**
   - 运行开发版本：`npm run dev`
   - 或运行已构建的应用程序

2. **选择图片文件夹**
   - 点击"选择图片文件夹"按钮
   - 选择包含需要重命名图片的文件夹

3. **配置设置**
   - 选择命名规则（小驼峰、大驼峰等）
   - 开启/关闭自动创建分类文件夹功能

4. **预览更改**
   - 应用会自动扫描文件夹中的图片
   - 显示原文件名、翻译结果和新文件名的对比

5. **执行重命名**
   - 确认预览结果无误后
   - 点击"开始重命名"按钮执行批量重命名

### 高级功能

#### 自动分类

启用"自动创建分类文件夹"功能后，应用会根据文件类型或内容自动创建子文件夹进行分类。

#### 错误处理

- 应用会检查目标文件名是否已存在
- 显示详细的成功/失败统计信息
- 提供友好的错误提示对话框

## 🛠️ 技术架构

### 核心技术栈

- **前端框架**：Vue 3 + Composition API
- **UI组件库**：Vuetify 3
- **桌面应用**：Electron
- **构建工具**：Vite
- **开发语言**：TypeScript
- **状态管理**：Pinia
- **国际化**：Vue I18n

### 翻译引擎

- **pinyin**：中文拼音转换
- **transliteration**：通用音译库
- **fs-extra**：增强的文件系统操作

## 🐛 故障排除

### 常见问题

**Q: 应用启动后显示空白页面** A: 检查是否正确安装了所有依赖，尝试运行 `npm install` 重新安装

**Q: 翻译结果不准确** A: 可以尝试不同的命名规则，或手动编辑预览结果

**Q: 文件重命名失败** A: 检查文件是否被其他程序占用，确保有足够的文件系统权限

### 调试模式

```bash
# 启动调试模式
npm run dev:debug

# 强制重新构建
npm run dev:debug:force
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

---

**图片重命名工具** - 让文件管理更简单 🎯
