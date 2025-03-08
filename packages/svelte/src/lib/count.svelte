<script lang="ts">
import type { VoerkaI18nScope } from "@voerkai18n/runtime";

    
const { scope }: {scope:VoerkaI18nScope} = $props()

console.log("Hello World!");

</script>

<div>Scope={scope.id}</div>