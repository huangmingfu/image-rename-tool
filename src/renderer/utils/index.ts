export function getCurrentLocale(): string {
  return navigator?.language?.split('-')[0] || 'en'
}

export async function openExternal(url: string): Promise<void> {
  await window.mainApi.send('msgOpenExternalLink', url)
}

export async function openFile(type: string): Promise<any> {
  return window.mainApi.invoke('msgOpenFile', type)
}

export async function openFolder(): Promise<any> {
  return window.mainApi.invoke('msgOpenFolder')
}

export async function getFilesInFolder(folderPath: string): Promise<any> {
  return window.mainApi.invoke('msgGetFilesInFolder', folderPath)
}

export async function translateToEnglish(
  chineseText: string,
  mode: string = 'pinyin',
  config?: any
): Promise<string> {
  return window.mainApi.invoke(
    'msgTranslateToEnglish',
    chineseText,
    mode,
    config
  )
}

export async function applyNamingConvention(
  text: string,
  convention: string
): Promise<string> {
  return window.mainApi.invoke('msgApplyNamingConvention', text, convention)
}

export async function renameFiles(
  renameOperations: Array<{ oldPath: string; newPath: string }>
): Promise<any> {
  return window.mainApi.invoke('msgRenameFiles', renameOperations)
}

// Translation Configuration Management
export async function getTranslationConfig(): Promise<any> {
  return window.mainApi.invoke('msgGetTranslationConfig')
}

export async function saveTranslationConfig(config: any): Promise<any> {
  return window.mainApi.invoke('msgSaveTranslationConfig', config)
}
