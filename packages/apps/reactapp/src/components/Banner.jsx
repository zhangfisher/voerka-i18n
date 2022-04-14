import { useState  } from 'react'

function Banner( props ) {
  return (
    <div>
        <h2>{t("一字一世界，一笔一乾坤，汉字是这个星球上最美的语言")}</h2>
        <h3>{props.memo}</h3>
    </div>
  )
}

export default Banner
