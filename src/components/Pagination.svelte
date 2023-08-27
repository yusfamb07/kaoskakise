<script>
	import { createEventDispatcher } from 'svelte';

	export let currentPage;
	export let totalPages;

	const dispatch = createEventDispatcher();

	const handleClick = (page) => {
		currentPage = page;
		dispatch('currentPageChange', currentPage);
	};
</script>

<div class="pagination">
	<button
		class="pagination__button pagination__prev"
		disabled={currentPage === 1}
		on:click={() => handleClick(currentPage - 1)}
	>
		Previous
	</button>

	<button
		class="pagination__button {currentPage === 1
			? 'pagination__button--active'
			: ''} {totalPages === 1 || totalPages === 0 ? 'd-none' : ''}"
		disabled={currentPage === 1}
		on:click={() => handleClick(1)}
	>
		1
	</button>

	{#if currentPage > 3}
		<div style="background-color: #2B2E3133;">
			<span class="pagination__ellipsis">...</span>
		</div>
	{/if}

	{#each Array.from({ length: totalPages - 2 }, (_, i) => i + 2) as page}
		{#if currentPage === page}
			<button
				class="pagination__button pagination__button--active"
				on:click={() => handleClick(page)}
			>
				{page}
			</button>
		{:else if Math.abs(currentPage - page) < 2}
			<button class="pagination__button" on:click={() => handleClick(page)}>
				{page}
			</button>
		{/if}
	{/each}

	{#if currentPage < totalPages - 2}
		<div style="background-color: #2B2E3133;">
			<span class="pagination__ellipsis">...</span>
		</div>
	{/if}

	<button
		class="pagination__button {currentPage === totalPages ? 'pagination__button--active' : ''}"
		disabled={currentPage === totalPages}
		on:click={() => handleClick(totalPages)}
	>
		{totalPages}
	</button>

	<button
		class="pagination__next pagination__button"
		disabled={currentPage === totalPages}
		on:click={() => handleClick(currentPage + 1)}
	>
		Next
	</button>
</div>


