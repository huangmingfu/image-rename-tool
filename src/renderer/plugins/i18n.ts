import { createI18n } from 'vue-i18n'
import en from '@/renderer/locales/en.json'
import ko from '@/renderer/locales/ko.json'
import zhHans from '@/renderer/locales/zh-hans.json'
import zhHant from '@/renderer/locales/zh-hant.json'
import de from '@/renderer/locales/de.json'
import es from '@/renderer/locales/es.json'
import ja from '@/renderer/locales/ja.json'
import fr from '@/renderer/locales/fr.json'
import ru from '@/renderer/locales/ru.json'
import pt from '@/renderer/locales/pt.json'
import nl from '@/renderer/locales/nl.json'
import { getCurrentLocale } from '@/renderer/utils'

export default createI18n({
  locale: 'zh-hans',
  fallbackLocale: 'zh-hans',
  globalInjection: true,
  messages: {
    en,
    ko,
    'zh-hans': zhHans,
    'zh-hant': zhHant,
    de,
    es,
    ja,
    fr,
    ru,
    pt,
    nl
  }
})
