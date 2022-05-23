import { Quasar } from 'quasar'
import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const defaultLocale = Quasar.lang.isoName

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  },
  'pt-BR': {
    currency: {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'symbol'
    }
  }
}

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: defaultLocale,
    fallbackLocale: 'en-US',
    messages,
    numberFormats
  })

  // Set i18n instance on app
  app.use(i18n)
})
