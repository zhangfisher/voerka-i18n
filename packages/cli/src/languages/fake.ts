import type { VoerkaI18nScope } from "@voerkai18n/runtime";


export default {
    t: ((v: string) => v) as VoerkaI18nScope['translate'],
    i18nScope: { change: () => { } } as unknown as VoerkaI18nScope
}