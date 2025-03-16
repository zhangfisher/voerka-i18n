<script lang="ts">
import { VoerkaI18nContext} from "@voerkai18n/svelte";
import '../app.css'; 
import Footer from '../components/Footer.svelte';
import Navbar from "../components/Navbar.svelte";


let { children } = $props();
	
</script>
<VoerkaI18nContext>
`	<div class="min-h-full">
		<Navbar/>
		<div class="container mx-auto mt-20 p-2 min-h-150">
			{@render children()} 
		</div>	
		<Footer/>
	</div>`
</VoerkaI18nContext>