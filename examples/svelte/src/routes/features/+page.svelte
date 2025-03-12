<script lang="ts"> 
import { Translate } from "../../languages"

/** @type {import('./$types').RequestHandler} */
async function getFeatures() {
		const response = await fetch('/api/features', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const items = await response.json();
    console.log("Items: ", items);
	}
</script>
<div class="container mx-auto">
  <h1 class="text-4xl font-bold">features Page</h1>
  <p class="text-lg">This is the features page.</p>
  <Translate message="特性"/>  
  <button class="cursor-pointer border-1 border-green-600 p-2 rounded rounded-md text-green-600 " onclick={getFeatures}>Get Features</button>
</div>