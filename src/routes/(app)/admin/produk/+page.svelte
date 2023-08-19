<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	const url_API = import.meta.env.VITE_API_DIGITAL;
	import Swal from 'sweetalert2';

	let letterSearch = [];
	let search = null;
	let request;

	let page, total;
</script>

<div class="p-4 mt-4 sm:ml-64">
	<div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
		<h1 class="text-lg font-bold text-color underline">Products</h1>
		<table id="example" class="table table-auto border border-1 mt-4 w-100">
			<thead class="border border-1 rounded-lg">
				<tr>
					<th>Image Product</th>
					<th>Product Name</th>
					<th>Categories</th>
					<th>Description</th>
					<th>Price</th>
					<th>Quantity</th>
				</tr>
			</thead>
			<tbody>
				<!-- {#if letterSearch.length > 0}
					{#each letterSearch as request, i}{/each}
				{/if} -->
				<tr>
					<td>Tiger Nixon</td>
					<td>System Architect</td>
					<td>Edinburgh</td>
					<td>61</td>
					<td>2011-04-25</td>
					<td>1000</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	th {
		background-color: rgb(209 213 219);
	}
</style>
