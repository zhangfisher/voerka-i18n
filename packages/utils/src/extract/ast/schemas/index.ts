

import vueSchema from './vue'
import typescriptSchema from './typescript'
import javascriptSchema from './javascript'
import tsxSchema from './tsx'
import astroSchema from './astro'
import svelteSchema from './svelte'
import litSchema from './lit'
import type { ExtractSections } from '../..'


export default {
    vue   : vueSchema,
    js    : javascriptSchema,
    ts    : typescriptSchema,
    tsx   : tsxSchema,
    jsx   : tsxSchema,
    astro : astroSchema,
    svelte: svelteSchema,
    mdx   : tsxSchema,
    lit   : litSchema
} as unknown as Record<string,ExtractSections>