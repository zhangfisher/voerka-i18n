import { useVoerkaI18n } from '@voerkai18n/react'
import React  from 'react'

// eslint-disable-next-line react-refresh/only-export-components
function Banner( props:{memo:string} ) {
    const { t } = useVoerkaI18n()
  return (
    <div>
        <h2>{t("一字一世界，一笔一乾坤，汉字是这个星球上最美的语言")}</h2>
        <h3>{props.memo}</h3>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(Banner)
