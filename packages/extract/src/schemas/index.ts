

import VueSchema from './vue'
import TypescriptSchema from './typescript'
import JavascriptSchema from './javascript'
import tsxSchema from './tsx'
import type { ExtractSchema } from '..'
import astroSchema from './astro'


export default {
    vue  : VueSchema,
    js   : JavascriptSchema,
    ts   : TypescriptSchema,
    tsx  : tsxSchema,
    jsx  : tsxSchema,
    astro: astroSchema
} as unknown as Record<string,ExtractSchema>