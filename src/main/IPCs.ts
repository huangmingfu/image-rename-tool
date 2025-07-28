import { ipcMain, shell, IpcMainEvent, dialog, app } from 'electron'
import * as fs from 'fs-extra'
import * as path from 'path'
import pinyin from 'pinyin'
import { transliterate } from 'transliteration'
import Constants from './utils/Constants'
import axios from 'axios'
import * as crypto from 'crypto'

// 常用中英文词典映射
const commonChineseToEnglish: { [key: string]: string } = {
  // 人物
  人: 'person',
  男人: 'man',
  女人: 'woman',
  孩子: 'child',
  婴儿: 'baby',
  老人: 'elderly',
  朋友: 'friend',
  家人: 'family',
  父亲: 'father',
  母亲: 'mother',

  // 动物
  猫: 'cat',
  狗: 'dog',
  鸟: 'bird',
  鱼: 'fish',
  马: 'horse',
  牛: 'cow',
  羊: 'sheep',
  猪: 'pig',
  鸡: 'chicken',
  鸭: 'duck',

  // 自然
  山: 'mountain',
  海: 'sea',
  河: 'river',
  湖: 'lake',
  树: 'tree',
  花: 'flower',
  草: 'grass',
  天空: 'sky',
  云: 'cloud',
  太阳: 'sun',
  月亮: 'moon',
  星星: 'star',
  雨: 'rain',
  雪: 'snow',

  // 建筑
  房子: 'house',
  建筑: 'building',
  桥: 'bridge',
  路: 'road',
  街道: 'street',
  公园: 'park',
  学校: 'school',
  医院: 'hospital',
  商店: 'shop',
  餐厅: 'restaurant',

  // 交通
  汽车: 'car',
  自行车: 'bicycle',
  摩托车: 'motorcycle',
  公交车: 'bus',
  火车: 'train',
  飞机: 'airplane',
  船: 'boat',
  地铁: 'subway',

  // 食物
  食物: 'food',
  水果: 'fruit',
  蔬菜: 'vegetable',
  肉: 'meat',
  海鲜: 'seafood',
  米饭: 'rice',
  面条: 'noodles',
  面包: 'bread',
  蛋糕: 'cake',
  水: 'water',

  // 颜色
  红色: 'red',
  蓝色: 'blue',
  绿色: 'green',
  黄色: 'yellow',
  黑色: 'black',
  白色: 'white',
  紫色: 'purple',
  橙色: 'orange',
  粉色: 'pink',
  灰色: 'gray',

  // 时间
  早上: 'morning',
  中午: 'noon',
  下午: 'afternoon',
  晚上: 'evening',
  夜晚: 'night',
  春天: 'spring',
  夏天: 'summer',
  秋天: 'autumn',
  冬天: 'winter',

  // 常用形容词
  大: 'big',
  小: 'small',
  高: 'tall',
  矮: 'short',
  长: 'long',
  美丽: 'beautiful',
  漂亮: 'pretty',
  可爱: 'cute',
  帅: 'handsome',

  // 活动
  运动: 'sport',
  游戏: 'game',
  音乐: 'music',
  舞蹈: 'dance',
  绘画: 'painting',
  阅读: 'reading',
  写作: 'writing',
  旅行: 'travel',
  购物: 'shopping'
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

    const response = await axios.post(
      'https://openapi.youdao.com/api',
      {
        q: text,
        from: 'zh-CHS',
        to: 'en',
        appKey: appKey,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: curtime
      },
      {
        timeout: 5000
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
  if (commonChineseToEnglish[text]) {
    return commonChineseToEnglish[text]
  }

  // 分词匹配
  const words = []
  for (let i = 0; i < text.length; i++) {
    for (let j = text.length; j > i; j--) {
      const substring = text.substring(i, j)
      if (commonChineseToEnglish[substring]) {
        words.push(commonChineseToEnglish[substring])
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
          switch (mode) {
            case 'dictionary':
              // 本地词典翻译
              const dictResult = translateWithLocalDict(chineseText)
              if (dictResult) {
                return dictResult
              }
              // 如果词典没有找到，回退到拼音
              return pinyin(chineseText, {
                style: pinyin.STYLE_NORMAL,
                heteronym: false,
                segment: true
              })
                .flat()
                .join('')

            case 'baidu':
              // 百度翻译API
              if (config && config.appId && config.secretKey) {
                try {
                  return await translateWithBaidu(
                    chineseText,
                    config.appId,
                    config.secretKey
                  )
                } catch (error) {
                  console.error(
                    'Baidu translation failed, falling back to pinyin:',
                    error
                  )
                  return pinyin(chineseText, {
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
              if (config && config.appKey && config.appSecret) {
                try {
                  return await translateWithYoudao(
                    chineseText,
                    config.appKey,
                    config.appSecret
                  )
                } catch (error) {
                  console.error(
                    'Youdao translation failed, falling back to pinyin:',
                    error
                  )
                  return pinyin(chineseText, {
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
              const pinyinResult = pinyin(chineseText, {
                style: pinyin.STYLE_NORMAL,
                heteronym: false,
                segment: true
              })
                .flat()
                .join('')

              // 使用transliteration作为备选
              const transliteratedResult = transliterate(chineseText)

              return pinyinResult || transliteratedResult || chineseText
          }
        } catch (error) {
          console.error('Translation error:', error)
          // 出错时回退到拼音
          try {
            return pinyin(chineseText, {
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

            // Check if target file already exists
            if (await fs.pathExists(operation.newPath)) {
              results.push({
                success: false,
                oldPath: operation.oldPath,
                newPath: operation.newPath,
                error: 'Target file already exists'
              })
              continue
            }

            // Rename the file
            await fs.move(operation.oldPath, operation.newPath)

            results.push({
              success: true,
              oldPath: operation.oldPath,
              newPath: operation.newPath
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
