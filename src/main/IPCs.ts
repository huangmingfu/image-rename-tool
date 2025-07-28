import { ipcMain, shell, IpcMainEvent, dialog, app } from 'electron'
import * as fs from 'fs-extra'
import * as path from 'path'
import pinyin from 'pinyin'
import { transliterate } from 'transliteration'
import Constants from './utils/Constants'
import axios from 'axios'
import * as crypto from 'crypto'
import { chineseEnglishDictionary } from './utils/ChineseEnglishDictionary'

// 使用外部词典文件

// 去除文件名中的数字
function removeNumbersFromText(text: string): string {
  // 去除所有数字和常见的数字分隔符
  return text
    .replace(/\d+/g, '') // 去除数字
    .replace(/[-_\s]+/g, ' ') // 将连字符、下划线、空格统一为空格
    .replace(/\s+/g, ' ') // 合并多个空格为一个
    .trim() // 去除首尾空格
}

// 百度翻译API
async function translateWithBaidu(
  text: string,
  appId: string,
  secretKey: string
): Promise<string> {
  try {
    const salt = Date.now().toString()
    const sign = crypto
      .createHash('md5')
      .update(appId + text + salt + secretKey)
      .digest('hex')

    const response = await axios.get(
      'https://fanyi-api.baidu.com/api/trans/vip/translate',
      {
        params: {
          q: text,
          from: 'zh',
          to: 'en',
          appid: appId,
          salt: salt,
          sign: sign
        },
        timeout: 5000
      }
    )

    if (
      response.data &&
      response.data.trans_result &&
      response.data.trans_result[0]
    ) {
      return response.data.trans_result[0].dst
    }
    throw new Error('Translation failed')
  } catch (error) {
    console.error('Baidu translation error:', error)
    throw error
  }
}

// 有道翻译API
async function translateWithYoudao(
  text: string,
  appKey: string,
  appSecret: string
): Promise<string> {
  try {
    const salt = Date.now().toString()
    const curtime = Math.round(Date.now() / 1000).toString()
    const signStr = appKey + text + salt + curtime + appSecret
    const sign = crypto.createHash('sha256').update(signStr).digest('hex')

    const params = new URLSearchParams({
      q: text,
      from: 'zh-CHS',
      to: 'en',
      appKey: appKey,
      salt: salt,
      sign: sign,
      signType: 'v3',
      curtime: curtime
    })

    const response = await axios.post(
      'https://openapi.youdao.com/api',
      params,
      {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (
      response.data &&
      response.data.translation &&
      response.data.translation[0]
    ) {
      return response.data.translation[0]
    }
    throw new Error('Translation failed')
  } catch (error) {
    console.error('Youdao translation error:', error)
    throw error
  }
}

// 本地词典翻译
function translateWithLocalDict(text: string): string {
  // 先尝试完整匹配
  if (chineseEnglishDictionary[text]) {
    return chineseEnglishDictionary[text]
  }

  // 分词匹配
  const words = []
  for (let i = 0; i < text.length; i++) {
    for (let j = text.length; j > i; j--) {
      const substring = text.substring(i, j)
      if (chineseEnglishDictionary[substring]) {
        words.push(chineseEnglishDictionary[substring])
        i = j - 1
        break
      }
    }
  }

  return words.length > 0 ? words.join(' ') : ''
}

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    ipcMain.handle('msgRequestGetVersion', () => {
      return Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on(
      'msgOpenExternalLink',
      async (event: IpcMainEvent, url: string) => {
        await shell.openExternal(url)
      }
    )

    // Open file
    ipcMain.handle(
      'msgOpenFile',
      async (event: IpcMainEvent, filter: string) => {
        const filters = []
        if (filter === 'text') {
          filters.push({ name: 'Text', extensions: ['txt', 'json'] })
        } else if (filter === 'zip') {
          filters.push({ name: 'Zip', extensions: ['zip'] })
        } else if (filter === 'image') {
          filters.push({
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
          })
        }
        const dialogResult = await dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters
        })
        return dialogResult
      }
    )

    // Open folder
    ipcMain.handle('msgOpenFolder', async (event: IpcMainEvent) => {
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      return dialogResult
    })

    // Get files in folder
    ipcMain.handle(
      'msgGetFilesInFolder',
      async (event: IpcMainEvent, folderPath: string) => {
        try {
          const files = await fs.readdir(folderPath)
          const imageFiles = files.filter((file) => {
            const ext = path.extname(file).toLowerCase()
            return [
              '.jpg',
              '.jpeg',
              '.png',
              '.gif',
              '.bmp',
              '.webp',
              '.svg'
            ].includes(ext)
          })

          const fileDetails = await Promise.all(
            imageFiles.map(async (file) => {
              const filePath = path.join(folderPath, file)
              const stats = await fs.stat(filePath)
              return {
                name: file,
                path: filePath,
                size: stats.size,
                modified: stats.mtime
              }
            })
          )

          return fileDetails
        } catch (error) {
          console.error('Error reading folder:', error)
          return []
        }
      }
    )

    // Translate Chinese to English with multiple modes
    ipcMain.handle(
      'msgTranslateToEnglish',
      async (
        event: IpcMainEvent,
        chineseText: string,
        mode: string = 'pinyin',
        config?: any
      ) => {
        try {
          // 根据配置决定是否去除数字
          let textToTranslate = chineseText
          if (config && config.removeNumbers) {
            textToTranslate = removeNumbersFromText(chineseText)
            // 如果去除数字后文本为空，则使用原文本
            if (!textToTranslate.trim()) {
              textToTranslate = chineseText
            }
          }

          switch (mode) {
            case 'dictionary':
              // 本地词典翻译
              const dictResult = translateWithLocalDict(textToTranslate)
              if (dictResult) {
                return dictResult
              }
              // 如果词典没有找到，回退到拼音
              return pinyin(textToTranslate, {
                style: pinyin.STYLE_NORMAL,
                heteronym: false,
                segment: true
              })
                .flat()
                .join('')

            case 'baidu':
              // 百度翻译API
              if (
                config &&
                config.baiduConfig &&
                config.baiduConfig.appId &&
                config.baiduConfig.secretKey
              ) {
                try {
                  return await translateWithBaidu(
                    textToTranslate,
                    config.baiduConfig.appId,
                    config.baiduConfig.secretKey
                  )
                } catch (error) {
                  console.error(
                    'Baidu translation failed, falling back to pinyin:',
                    error
                  )
                  return pinyin(textToTranslate, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: false,
                    segment: true
                  })
                    .flat()
                    .join('')
                }
              }
              throw new Error('Baidu translation config missing')

            case 'youdao':
              // 有道翻译API
              if (
                config &&
                config.youdaoConfig &&
                config.youdaoConfig.appKey &&
                config.youdaoConfig.appSecret
              ) {
                try {
                  return await translateWithYoudao(
                    textToTranslate,
                    config.youdaoConfig.appKey,
                    config.youdaoConfig.appSecret
                  )
                } catch (error) {
                  console.error(
                    'Youdao translation failed, falling back to pinyin:',
                    error
                  )
                  return pinyin(textToTranslate, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: false,
                    segment: true
                  })
                    .flat()
                    .join('')
                }
              }
              throw new Error('Youdao translation config missing')

            case 'pinyin':
            default:
              // 拼音转换（默认）
              const pinyinResult = pinyin(textToTranslate, {
                style: pinyin.STYLE_NORMAL,
                heteronym: false,
                segment: true
              })
                .flat()
                .join('')

              // 使用transliteration作为备选
              const transliteratedResult = transliterate(textToTranslate)

              return pinyinResult || transliteratedResult || textToTranslate
          }
        } catch (error) {
          console.error('Translation error:', error)
          // 出错时回退到拼音
          try {
            // 根据配置决定是否去除数字
            let fallbackText = chineseText
            if (config && config.removeNumbers) {
              fallbackText = removeNumbersFromText(chineseText)
              if (!fallbackText.trim()) {
                fallbackText = chineseText
              }
            }

            return pinyin(fallbackText, {
              style: pinyin.STYLE_NORMAL,
              heteronym: false,
              segment: true
            })
              .flat()
              .join('')
          } catch {
            return chineseText
          }
        }
      }
    )

    // Apply naming convention
    ipcMain.handle(
      'msgApplyNamingConvention',
      async (event: IpcMainEvent, text: string, convention: string) => {
        try {
          let result = text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim()

          switch (convention) {
            case 'camelCase':
              result = result.replace(/\s+(.)/g, (match, char) =>
                char.toUpperCase()
              )
              break
            case 'PascalCase':
              result = result.replace(/\s+(.)/g, (match, char) =>
                char.toUpperCase()
              )
              result = result.charAt(0).toUpperCase() + result.slice(1)
              break
            case 'snake_case':
              result = result.replace(/\s+/g, '_')
              break
            case 'kebab-case':
              result = result.replace(/\s+/g, '-')
              break
            case 'lowercase':
              result = result.replace(/\s+/g, '')
              break
            default:
              result = result.replace(/\s+/g, '_')
          }

          return result
        } catch (error) {
          console.error('Naming convention error:', error)
          return text
        }
      }
    )

    // Rename files
    ipcMain.handle(
      'msgRenameFiles',
      async (
        event: IpcMainEvent,
        renameOperations: Array<{ oldPath: string; newPath: string }>
      ) => {
        const results = []

        for (const operation of renameOperations) {
          try {
            // Ensure the directory exists
            await fs.ensureDir(path.dirname(operation.newPath))

            let finalNewPath = operation.newPath

            // Check if target file already exists and find available name
            if (await fs.pathExists(finalNewPath)) {
              const dir = path.dirname(finalNewPath)
              const ext = path.extname(finalNewPath)
              const nameWithoutExt = path.basename(finalNewPath, ext)

              let counter = 1
              do {
                finalNewPath = path.join(
                  dir,
                  `${nameWithoutExt}_${counter}${ext}`
                )
                counter++
              } while (await fs.pathExists(finalNewPath))
            }

            // Rename the file
            await fs.move(operation.oldPath, finalNewPath)

            results.push({
              success: true,
              oldPath: operation.oldPath,
              newPath: finalNewPath,
              actualName: path.basename(finalNewPath)
            })
          } catch (error) {
            results.push({
              success: false,
              oldPath: operation.oldPath,
              newPath: operation.newPath,
              error: error.message
            })
          }
        }

        return results
      }
    )

    // Translation Configuration Management
    const translationConfigPath = path.join(
      app.getPath('userData'),
      'translation-config.json'
    )

    // Get translation configuration
    ipcMain.handle('msgGetTranslationConfig', async () => {
      try {
        if (await fs.pathExists(translationConfigPath)) {
          const config = await fs.readJson(translationConfigPath)
          return config
        }
        return {
          mode: 'pinyin', // 'pinyin', 'dictionary', 'baidu', 'youdao'
          removeNumbers: false, // 是否去除文件名中的数字
          baiduConfig: {
            appId: '',
            secretKey: ''
          },
          youdaoConfig: {
            appKey: '',
            appSecret: ''
          }
        }
      } catch (error) {
        console.error('Error reading translation config:', error)
        return {
          mode: 'pinyin',
          removeNumbers: false,
          baiduConfig: { appId: '', secretKey: '' },
          youdaoConfig: { appKey: '', appSecret: '' }
        }
      }
    })

    // Save translation configuration
    ipcMain.handle(
      'msgSaveTranslationConfig',
      async (event: IpcMainEvent, config: any) => {
        try {
          await fs.ensureDir(path.dirname(translationConfigPath))
          await fs.writeJson(translationConfigPath, config, { spaces: 2 })
          return { success: true }
        } catch (error) {
          console.error('Error saving translation config:', error)
          return { success: false, error: error.message }
        }
      }
    )
  }
}
