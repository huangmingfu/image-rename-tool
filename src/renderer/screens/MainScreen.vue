<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import {
  openFolder,
  getFilesInFolder,
  translateToEnglish,
  applyNamingConvention,
  renameFiles
} from '@/renderer/utils'
import { onMounted, ref, computed, nextTick } from 'vue'
import {
  mdiBrightness6,
  mdiCamera,
  mdiFolderOpen,
  mdiCog,
  mdiPlay,
  mdiRefresh,
  mdiCheck,
  mdiAlert
} from '@mdi/js'

const { t, locale, availableLocales } = useI18n()
const theme = useTheme()

// 应用状态
const languages = ref([
  { value: 'zh-hans', title: '中文简体' },
  { value: 'en', title: 'English' }
])
const appVersion = ref('Unknown')

// 类型定义
interface ImageFile {
  name: string
  path: string
  size: number
  modified: Date
}

interface RenamePreviewItem {
  originalFile: ImageFile
  originalName: string
  newName: string
  translatedName: string
  formattedName: string
}

interface RenameResult {
  success: boolean
  oldPath: string
  newPath: string
  error?: string
}

// 图片重命名工具状态
const selectedFolder = ref('')
const imageFiles = ref<ImageFile[]>([])
const isLoading = ref(false)
const isProcessing = ref(false)

// 提示信息状态
const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const resultMessage = ref('')
const errorMessage = ref('')

// 设置
const namingConvention = ref('camelCase')
const autoCreateFolders = ref(true)

// 命名规则选项
const namingOptions = computed(() => [
  { value: 'camelCase', title: t('naming.camelCase') },
  { value: 'PascalCase', title: t('naming.PascalCase') },
  { value: 'snake_case', title: t('naming.snake_case') },
  { value: 'kebab-case', title: t('naming.kebab-case') },
  { value: 'lowercase', title: t('naming.lowercase') }
])

// 重命名预览
const renamePreview = ref<RenamePreviewItem[]>([])

onMounted((): void => {
  getApplicationVersionFromMainProcess()
})

const getApplicationVersionFromMainProcess = (): void => {
  window.mainApi.invoke('msgRequestGetVersion').then((result: string) => {
    appVersion.value = result
  })
}

const handleChangeTheme = (): void => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleChangeLanguage = (val): void => {
  locale.value = val
}

// 选择文件夹
const handleSelectFolder = async (): Promise<void> => {
  try {
    isLoading.value = true
    const dialogResult = await openFolder()

    if (!dialogResult.canceled && dialogResult.filePaths.length > 0) {
      selectedFolder.value = dialogResult.filePaths[0]
      await loadImagesFromFolder()
    }
  } catch (error) {
    console.error('Error selecting folder:', error)
    errorMessage.value = `选择文件夹时发生错误：${getErrorMessage(error)}`
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
}

// 从文件夹加载图片
const loadImagesFromFolder = async (): Promise<void> => {
  try {
    isLoading.value = true
    const files = await getFilesInFolder(selectedFolder.value)
    imageFiles.value = files

    if (files.length === 0) {
      errorMessage.value =
        '所选文件夹中没有找到支持的图片文件。\n\n支持的格式：jpg, jpeg, png, gif, bmp, webp, svg'
      showErrorDialog.value = true
    } else {
      await generatePreview()
    }
  } catch (error) {
    console.error('Error loading images:', error)
    errorMessage.value = `加载图片文件时发生错误：${getErrorMessage(error)}`
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
}

// 生成重命名预览
const generatePreview = async (): Promise<void> => {
  try {
    const preview: RenamePreviewItem[] = []

    for (const file of imageFiles.value) {
      const fileName = file.name
      const fileExt = fileName.substring(fileName.lastIndexOf('.'))
      const fileNameWithoutExt = fileName.substring(
        0,
        fileName.lastIndexOf('.')
      )

      // 翻译中文文件名
      const translatedName = await translateToEnglish(fileNameWithoutExt)

      // 应用命名规则
      const formattedName = await applyNamingConvention(
        translatedName,
        namingConvention.value
      )

      const newFileName = formattedName + fileExt

      preview.push({
        originalFile: file,
        originalName: fileName,
        newName: newFileName,
        translatedName: translatedName,
        formattedName: formattedName
      })
    }

    renamePreview.value = preview
  } catch (error) {
    console.error('Error generating preview:', error)
  }
}

// 执行重命名
const executeRename = async (): Promise<void> => {
  try {
    isProcessing.value = true

    const renameOperations = renamePreview.value.map((item) => {
      const oldPath = item.originalFile.path
      const newPath = selectedFolder.value + '/' + item.newName

      return { oldPath, newPath }
    })

    const results = (await renameFiles(renameOperations)) as RenameResult[]

    // 处理结果
    let successCount = 0
    let errorCount = 0
    const errorDetails: string[] = []

    results.forEach((result) => {
      if (result.success) {
        successCount++
      } else {
        errorCount++
        errorDetails.push(`${result.oldPath}: ${result.error || '未知错误'}`)
        console.error('Rename error:', result.error)
      }
    })

    // 重新加载文件列表
    if (successCount > 0) {
      await loadImagesFromFolder()
    }

    // 显示结果提示
    if (errorCount === 0) {
      // 全部成功
      resultMessage.value = `重命名完成！成功处理了 ${successCount} 个文件。`
      showSuccessDialog.value = true
    } else if (successCount === 0) {
      // 全部失败
      errorMessage.value = `重命名失败！所有 ${errorCount} 个文件都处理失败。\n\n错误详情：\n${errorDetails.join('\n')}`
      showErrorDialog.value = true
    } else {
      // 部分成功
      resultMessage.value = `重命名部分完成！\n成功：${successCount} 个文件\n失败：${errorCount} 个文件\n\n失败详情：\n${errorDetails.join('\n')}`
      showErrorDialog.value = true
    }
  } catch (error) {
    console.error('Error executing rename:', error)
    errorMessage.value = `重命名过程中发生错误：${getErrorMessage(error)}`
    showErrorDialog.value = true
  } finally {
    isProcessing.value = false
  }
}

// 刷新预览
const refreshPreview = async (): Promise<void> => {
  if (selectedFolder.value) {
    await generatePreview()
  }
}

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// 计算属性
const hasImages = computed(() => imageFiles.value.length > 0)
const hasPreview = computed(() => renamePreview.value.length > 0)
</script>

<template>
  <v-container
    fluid
    class="pa-4"
  >
    <!-- 标题区域 -->
    <v-row class="mb-6">
      <v-col
        cols="12"
        class="text-center"
      >
        <div class="d-flex align-center justify-center mb-4">
          <v-icon
            :icon="mdiCamera"
            size="48"
            color="primary"
            class="mr-3"
          />
          <h1 class="text-h3 font-weight-bold">
            {{ t('app.title') }}
          </h1>
        </div>
        <p class="text-h6 text-medium-emphasis">
          {{ t('app.description') }}
        </p>
      </v-col>
    </v-row>

    <!-- 设置区域 -->
    <v-card
      class="mb-6"
      elevation="2"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          :icon="mdiCog"
          class="mr-2"
        />
        {{ t('settings.title') }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="namingConvention"
              :label="t('settings.naming-rule')"
              :items="namingOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              @update:model-value="refreshPreview"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-switch
              v-model="autoCreateFolders"
              :label="t('settings.auto-create-folders')"
              color="primary"
              inset
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <div class="d-flex align-center justify-space-between">
              <v-select
                :model-value="locale"
                :label="t('menu.change-language')"
                :items="languages"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="comfortable"
                @update:model-value="handleChangeLanguage"
              />
              <v-btn
                icon
                variant="text"
                @click="handleChangeTheme"
                class="ml-2"
              >
                <v-icon :icon="mdiBrightness6" />
                <v-tooltip
                  activator="parent"
                  location="bottom"
                >
                  {{ t('menu.change-theme') }}
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 操作区域 -->
    <v-card
      class="mb-6"
      elevation="2"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          :icon="mdiFolderOpen"
          class="mr-2"
        />
        {{ t('operation.title') }}
      </v-card-title>
      <v-card-text>
        <v-row class="mb-4">
          <v-col
            cols="12"
            md="8"
          >
            <v-btn
              color="primary"
              size="large"
              :loading="isLoading"
              @click="handleSelectFolder"
              class="mr-3"
            >
              <v-icon
                :icon="mdiFolderOpen"
                class="mr-2"
              />
              {{ t('operation.select-folder') }}
            </v-btn>
            <v-btn
              v-if="hasImages"
              color="secondary"
              size="large"
              :loading="isLoading"
              @click="refreshPreview"
              class="mr-3"
            >
              <v-icon
                :icon="mdiRefresh"
                class="mr-2"
              />
              {{ t('operation.refresh-preview') }}
            </v-btn>
            <v-btn
              v-if="hasPreview"
              color="success"
              size="large"
              :loading="isProcessing"
              @click="executeRename"
            >
              <v-icon
                :icon="mdiPlay"
                class="mr-2"
              />
              {{ t('operation.start-rename') }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="text-right"
          >
            <div
              v-if="selectedFolder"
              class="text-caption text-medium-emphasis"
            >
              {{ t('operation.selected-folder') }}: {{ selectedFolder }}
            </div>
            <div
              v-if="hasImages"
              class="text-caption text-medium-emphasis"
            >
              {{ t('operation.found-images', { count: imageFiles.length }) }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 预览区域 -->
    <v-card
      v-if="hasPreview"
      elevation="2"
    >
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon
            :icon="mdiCheck"
            class="mr-2"
          />
          {{ t('preview.title') }}
        </div>
        <v-chip
          color="primary"
          variant="outlined"
        >
          {{ t('preview.count', { count: renamePreview.length }) }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="[
            {
              title: t('preview.original-name'),
              key: 'originalName',
              sortable: false
            },
            {
              title: t('preview.translated-name'),
              key: 'translatedName',
              sortable: false
            },
            { title: t('preview.new-name'), key: 'newName', sortable: false },
            { title: t('preview.file-size'), key: 'size', sortable: false }
          ]"
          :items="renamePreview"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #item.originalName="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :icon="mdiCamera"
                size="small"
                class="mr-2"
              />
              <span class="text-body-2">{{ item.originalName }}</span>
            </div>
          </template>

          <template #item.translatedName="{ item }">
            <v-chip
              size="small"
              color="info"
              variant="outlined"
              class="text-caption"
            >
              {{ item.translatedName }}
            </v-chip>
          </template>

          <template #item.newName="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :icon="mdiCheck"
                size="small"
                color="success"
                class="mr-2"
              />
              <span class="text-body-2 font-weight-medium">{{
                item.newName
              }}</span>
            </div>
          </template>

          <template #item.size="{ item }">
            <span class="text-caption text-medium-emphasis">
              {{ formatFileSize(item.originalFile.size) }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 空状态 -->
    <v-card
      v-if="!selectedFolder"
      class="text-center pa-8"
      elevation="1"
    >
      <v-icon
        :icon="mdiFolderOpen"
        size="64"
        color="grey-lighten-1"
        class="mb-4"
      />
      <h3 class="text-h5 mb-2">
        {{ t('empty.title') }}
      </h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ t('empty.description') }}
      </p>
      <v-btn
        color="primary"
        size="large"
        @click="handleSelectFolder"
      >
        <v-icon
          :icon="mdiFolderOpen"
          class="mr-2"
        />
        {{ t('operation.select-folder') }}
      </v-btn>
    </v-card>

    <!-- 成功提示对话框 -->
    <v-dialog
      v-model="showSuccessDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon
            :icon="mdiCheck"
            color="success"
            class="mr-2"
          />
          重命名成功
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">
            {{ resultMessage }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            @click="showSuccessDialog = false"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 错误提示对话框 -->
    <v-dialog
      v-model="showErrorDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon
            :icon="mdiAlert"
            color="error"
            class="mr-2"
          />
          提示信息
        </v-card-title>
        <v-card-text>
          <p
            class="text-body-1"
            style="white-space: pre-line"
          >
            {{ errorMessage }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="showErrorDialog = false"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
