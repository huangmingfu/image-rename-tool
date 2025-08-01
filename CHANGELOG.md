# 更新日志

本文档记录了图片重命名工具的所有重要更改和版本发布信息。

## [1.0.0] - 2024-07-28

### 🎉 首次发布

这是图片重命名工具的首个正式版本，基于 Vutron (Vite + Vue 3 + Electron) 模板开发。

### ✨ 新增功能

#### 核心功能

- **中文转英文翻译**
  - 集成 `pinyin` 库进行中文拼音转换
  - 集成 `transliteration` 库作为备选翻译方案
  - 智能翻译算法，优先使用拼音转换

- **多种命名规则支持**
  - 小驼峰 (camelCase)：`myImageFile.jpg`
  - 大驼峰 (PascalCase)：`MyImageFile.jpg`
  - 下划线 (snake_case)：`my_image_file.jpg`
  - 短横线 (kebab-case)：`my-image-file.jpg`
  - 小写 (lowercase)：`myimagefile.jpg`

- **批量文件处理**
  - 支持选择整个文件夹进行批量处理
  - 自动扫描支持的图片格式
  - 支持格式：jpg, jpeg, png, gif, bmp, webp, svg

- **重命名预览功能**
  - 实时预览所有文件的重命名结果
  - 显示原文件名、翻译结果、新文件名对比
  - 文件大小和修改时间信息

#### 用户界面

- **现代化设计**
  - 基于 Vuetify 3 的 Material Design 风格
  - 响应式布局，适配不同屏幕尺寸
  - 清晰的功能分区：设置、操作、预览

- **主题支持**
  - 深色主题和浅色主题切换
  - 自动适配系统主题偏好

- **国际化支持**
  - 中文简体界面
  - 英文界面
  - 完整的本地化文本

#### 安全特性

- **文件安全保护**
  - 重命名前检查目标文件是否已存在
  - 不会覆盖现有文件
  - 详细的操作结果报告

- **错误处理**
  - 友好的错误提示对话框
  - 详细的成功/失败统计
  - 完整的错误日志记录

#### 高级功能

- **自动分类选项**
  - 可选的自动创建分类文件夹功能
  - 根据文件类型智能分类

- **性能优化**
  - 异步文件处理
  - 内存使用优化
  - 大文件夹处理支持

### 🛠️ 技术架构

#### 核心技术栈

- **前端框架**：Vue 3 + Composition API + TypeScript
- **UI组件库**：Vuetify 3
- **桌面应用**：Electron
- **构建工具**：Vite
- **状态管理**：Pinia
- **国际化**：Vue I18n

#### 依赖库

- **翻译引擎**：
  - `pinyin@4.0.0` - 中文拼音转换
  - `transliteration@2.3.5` - 通用音译库
- **文件操作**：
  - `fs-extra@11.2.0` - 增强的文件系统操作
  - `path` - 路径处理
- **开发工具**：
  - `cross-env@10.0.0` - 跨平台环境变量

#### IPC 通信接口

- `msgOpenFolder` - 文件夹选择
- `msgGetFilesInFolder` - 获取文件夹中的图片
- `msgTranslateToEnglish` - 中文翻译为英文
- `msgApplyNamingConvention` - 应用命名规则
- `msgRenameFiles` - 执行批量重命名

### 📁 项目结构

```
vutron/
├── src/
│   ├── main/           # Electron 主进程
│   ├── preload/        # 预加载脚本
│   ├── renderer/       # Vue 渲染进程
│   └── public/         # 静态资源
├── docs/               # 项目文档
├── buildAssets/        # 构建配置
└── dist/              # 构建输出
```

### 🚀 构建和部署

#### 支持平台

- Windows 10/11 (x64)
- macOS 10.15+ (x64, arm64)
- Linux Ubuntu 18.04+ (x64)

#### 构建脚本

- `npm run build:win` - 构建 Windows 版本
- `npm run build:mac` - 构建 macOS 版本
- `npm run build:linux` - 构建 Linux 版本
- `npm run build:all` - 构建所有平台版本

### 📖 文档

#### 完整的中文文档

- **README.md** - 项目概览和快速开始
- **docs/USER_GUIDE.md** - 详细的用户使用指南
- **docs/DEVELOPMENT.md** - 开发者文档和扩展指南
- **docs/FAQ.md** - 常见问题解答

#### 代码质量

- TypeScript 类型定义完整
- ESLint + Prettier 代码规范
- 完整的错误处理机制
- 详细的代码注释

### 🐛 已知问题

#### 限制和注意事项

- 单次处理建议不超过 1000 个文件（性能考虑）
- 翻译质量依赖于中文文件名的复杂度
- 某些生僻字可能翻译效果不佳
- 需要文件夹读写权限

#### 兼容性

- 不支持 Windows 7 及更早版本
- 不支持 32 位操作系统
- macOS 需要 10.15 或更高版本

### 🔮 未来计划

#### 计划中的功能

- **翻译引擎增强**
  - 集成在线翻译 API
  - 自定义翻译词典
  - 翻译结果缓存

- **用户体验改进**
  - 拖拽文件夹支持
  - 批量处理进度条
  - 操作历史记录

- **高级功能**
  - 自定义命名规则
  - 文件内容分析分类
  - 批量撤销操作

- **性能优化**
  - Web Workers 支持
  - 大文件夹分页加载
  - 内存使用优化

### 🤝 贡献者

感谢所有为这个项目做出贡献的开发者！

### 📄 许可证

本项目基于 MIT 许可证开源。

---

## 版本说明

### 版本号规则

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 发布周期

- **主版本**：重大功能更新或架构变更
- **次版本**：新功能添加，每月发布
- **修订版本**：Bug 修复，按需发布

### 升级指南

#### 从开发版本升级到 1.0.0

如果您之前使用的是开发版本，升级到 1.0.0 需要：

1. **备份数据**：备份重要的配置和文件
2. **重新安装**：
   ```bash
   npm install
   npm run build
   ```
3. **配置迁移**：重新配置您的偏好设置

#### 未来版本升级

我们承诺：

- 主版本内保持 API 兼容性
- 提供详细的升级指南
- 重要变更会提前通知

---

**感谢您使用图片重命名工具！** 🎉

如果您有任何问题或建议，欢迎：

- 提交 GitHub Issue
- 参与项目讨论
- 贡献代码或文档

让我们一起让文件管理变得更简单！
