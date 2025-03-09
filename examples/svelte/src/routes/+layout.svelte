<script lang="ts">
import '../app.css'; 
import Footer from '../components/Footer.svelte';
import Navbar from "../components/Navbar.svelte";

let { children } = $props();
	
</script>
<div class="min-h-full">
    <Navbar/>
	<div class="container mx-auto mt-20 p-2 min-h-150">
		{@render children()} 
	</div>	
	<Footer/>
</div>
