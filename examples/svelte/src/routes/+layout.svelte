<script lang="ts">
	import '../app.css';
	import { VoerkaI18nContext } from "../languages"
	let { children } = $props();
	
</script>

<VoerkaI18nContext>
{@render children()}
</VoerkaI18nContext>
