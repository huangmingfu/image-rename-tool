# 用户使用指南

欢迎使用图片重命名工具！本指南将详细介绍如何使用这个应用来批量重命名您的图片文件。

## 📋 目录

- [应用概览](#应用概览)
- [界面介绍](#界面介绍)
- [基本操作](#基本操作)
- [高级功能](#高级功能)
- [最佳实践](#最佳实践)
- [注意事项](#注意事项)

## 🎯 应用概览

图片重命名工具是一个专门用于将中文图片文件名转换为英文的桌面应用。它可以：

- ✅ 自动翻译中文文件名为英文
- ✅ 支持多种英文命名规则
- ✅ 批量处理整个文件夹的图片
- ✅ 提供重命名预览功能
- ✅ 安全的文件操作，避免覆盖现有文件

## 🖥️ 界面介绍

### 主界面布局

应用界面分为四个主要区域：

#### 1. 标题区域

- 显示应用名称："图片重命名工具"
- 显示应用描述和功能说明

#### 2. 设置区域

- **命名规则选择**：选择输出的英文命名格式
- **自动创建分类文件夹**：开启后可自动分类文件
- **语言切换**：支持中文/英文界面
- **主题切换**：支持深色/浅色主题

#### 3. 操作区域

- **选择图片文件夹**：选择要处理的图片文件夹
- **刷新预览**：重新生成重命名预览
- **开始重命名**：执行批量重命名操作
- **状态显示**：显示当前选择的文件夹和找到的图片数量

#### 4. 预览区域

- **重命名预览表格**：显示所有文件的重命名对比
  - 原文件名
  - 翻译结果
  - 新文件名
  - 文件大小

## 🚀 基本操作

### 步骤 1：启动应用

1. **开发模式**：

   ```bash
   npm run dev
   ```

2. **已安装版本**：
   - 双击桌面图标
   - 或从开始菜单启动

### 步骤 2：选择命名规则

在设置区域选择您喜欢的命名规则：

| 命名规则 | 示例 | 说明 |
| --- | --- | --- |
| 小驼峰 (camelCase) | `beautifulSunset.jpg` | 首字母小写，后续单词首字母大写 |
| 大驼峰 (PascalCase) | `BeautifulSunset.jpg` | 所有单词首字母大写 |
| 下划线 (snake_case) | `beautiful_sunset.jpg` | 单词间用下划线连接 |
| 短横线 (kebab-case) | `beautiful-sunset.jpg` | 单词间用短横线连接 |
| 小写 (lowercase) | `beautifulsunset.jpg` | 全部小写，无分隔符 |

### 步骤 3：选择图片文件夹

1. 点击"选择图片文件夹"按钮
2. 在弹出的文件夹选择对话框中选择包含图片的文件夹
3. 应用会自动扫描文件夹中的图片文件

**支持的图片格式**：

- JPG/JPEG
- PNG
- GIF
- BMP
- WebP
- SVG

### 步骤 4：预览重命名结果

选择文件夹后，应用会自动：

1. **扫描图片文件**：找出所有支持的图片格式
2. **翻译文件名**：将中文文件名转换为英文
3. **应用命名规则**：根据选择的规则格式化文件名
4. **显示预览表格**：展示所有文件的重命名对比

在预览表格中，您可以看到：

- **原文件名**：当前的中文文件名
- **翻译结果**：中文转英文的翻译
- **新文件名**：应用命名规则后的最终文件名
- **文件大小**：文件的大小信息

### 步骤 5：执行重命名

1. 仔细检查预览结果
2. 确认无误后，点击"开始重命名"按钮
3. 应用会显示处理进度
4. 完成后会弹出结果提示对话框

## 🔧 高级功能

### 自动创建分类文件夹

启用此功能后，应用可以根据文件类型或内容自动创建子文件夹：

1. 在设置区域开启"自动创建分类文件夹"
2. 应用会分析文件特征
3. 自动创建相应的分类文件夹
4. 将重命名后的文件移动到对应文件夹

### 刷新预览功能

如果您：

- 更改了命名规则
- 修改了其他设置
- 想要重新生成预览

可以点击"刷新预览"按钮重新生成预览结果。

### 主题和语言切换

**主题切换**：

- 点击设置区域的主题切换按钮
- 支持深色和浅色两种主题

**语言切换**：

- 在语言下拉菜单中选择
- 支持中文简体和英文

## 💡 最佳实践

### 文件管理建议

1. **备份重要文件**：
   - 重命名前建议备份原始文件
   - 可以复制到其他文件夹作为备份

2. **分批处理**：
   - 对于大量文件（1000+），建议分批处理
   - 避免一次性处理过多文件导致性能问题

3. **文件夹组织**：
   - 建议按项目或日期组织文件夹
   - 避免在系统重要文件夹中操作

### 命名规则选择

**推荐场景**：

- **编程项目**：使用 `camelCase` 或 `snake_case`
- **Web 项目**：使用 `kebab-case`
- **文档整理**：使用 `PascalCase`
- **简单场景**：使用 `lowercase`

### 翻译质量优化

1. **简化文件名**：
   - 使用简洁明了的中文描述
   - 避免过于复杂的词汇组合

2. **预处理建议**：
   - 移除特殊符号和数字
   - 使用常用汉字而非生僻字

3. **结果检查**：
   - 仔细检查预览结果
   - 对不满意的结果可以尝试不同命名规则

## ⚠️ 注意事项

### 安全提醒

1. **文件覆盖保护**：
   - 应用不会覆盖已存在的文件
   - 如果目标文件名已存在，会跳过该文件

2. **权限要求**：
   - 确保应用有读写文件夹的权限
   - 在某些系统上可能需要管理员权限

3. **文件占用检查**：
   - 确保要重命名的文件没有被其他程序打开
   - 关闭图片查看器、编辑器等相关程序

### 性能考虑

1. **文件数量限制**：
   - 建议单次处理不超过 1000 个文件
   - 大量文件可能导致内存占用过高

2. **系统资源**：
   - 处理过程中避免运行其他重型程序
   - 确保有足够的磁盘空间

### 兼容性说明

1. **文件路径**：
   - 避免使用包含特殊字符的文件路径
   - 路径长度不要超过系统限制

2. **文件名长度**：
   - 生成的文件名会自动控制长度
   - 过长的文件名会被适当截断

## 🆘 遇到问题？

如果在使用过程中遇到问题：

1. **查看错误提示**：应用会显示详细的错误信息
2. **参考 FAQ**：查看 [常见问题解答](FAQ.md)
3. **重启应用**：简单的重启可以解决大部分问题
4. **提交反馈**：在 GitHub 上提交 Issue

## 📞 获取帮助

- **用户指南**：本文档
- **开发文档**：[DEVELOPMENT.md](DEVELOPMENT.md)
- **常见问题**：[FAQ.md](FAQ.md)
- **项目主页**：[README.md](../README.md)

---

希望这个指南能帮助您更好地使用图片重命名工具！如果您有任何建议或反馈，欢迎联系我们。
