import { ipcMain, shell, IpcMainEvent, dialog } from 'electron'
import * as fs from 'fs-extra'
import * as path from 'path'
import pinyin from 'pinyin'
import { transliterate } from 'transliteration'
import Constants from './utils/Constants'

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

    // Translate Chinese to English
    ipcMain.handle(
      'msgTranslateToEnglish',
      async (event: IpcMainEvent, chineseText: string) => {
        try {
          // First try pinyin conversion
          const pinyinResult = pinyin(chineseText, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false,
            segment: true
          })
            .flat()
            .join('')

          // Then use transliteration as fallback
          const transliteratedResult = transliterate(chineseText)

          // Return the better result (prefer pinyin if available)
          return pinyinResult || transliteratedResult || chineseText
        } catch (error) {
          console.error('Translation error:', error)
          return chineseText
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
  }
}
