<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';
	import { dataAPI } from '../routes/utils/axios';

	const url_API = import.meta.env.VITE_API_DIGITAL;

	function logoutHandler() {
		localStorage.clear();
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
			}
		});

		Toast.fire({
			icon: 'success',
			title: 'Sign out successfully'
		});
		goto('/login');
	}

	onMount(async () => {

		if (!localStorage.getItem('token')) goto('/');
	});
</script>

<nav class="bg-slate-50 sticky-top">
	<div class="flex flex-shrink-0 justify-center">
		<img class="block h-8 w-auto mt-2 lg:hidden" src="/logo3.png" alt="Sock Energy" />
		<img class="hidden mt-2 h-30 w-40 lg:block" src="/logo3.png" alt="Your Company" />
	</div>
	<div class="flex flex-shrink-0 justify-center">
		<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
			<div class="relative flex h-16 items-center justify-between">
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<!-- Mobile menu button-->
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded="false"
					>
						<span class="sr-only">Open main menu</span>

						<svg
							class="block h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>

						<svg
							class="hidden h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
					<div class="hidden sm:ml-6 sm:block">
						<div class="flex space-x-5">
							{#if $page.url.pathname.includes('/user')}
								<a
									href="/user/dashboard"
									class=" text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/dashboard')}
									aria-current="page">Home</a
								>
								<a
									href="/user/product"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/product')}
									>All Product</a
								>
								<a
									href="/user/categories"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/categories')}
									>Categories</a
								>
								<a
									href="/user/cart"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/cart')}
									>Cart</a
								>
								<a
									href="/user/about"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/about')}
									>About</a
								>
								<a
									href="/user/tracking"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/tracking')}
									>Tracking</a
								>
								<a
									href="#!" on:click={logoutHandler}
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									>Sign Out</a
								>
								<!-- {#if (localStorage.getItem('token'))}
								{:else}
									<a
										href="/login" 
										class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
										>Sign In</a
									>
								{/if} -->
							{:else}
								<a
									href="/user/dashboard"
									class=" text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/dashboard')}
									aria-current="page">Home</a
								>
								<a
									href="/user/product"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/product')}
									>All Product</a
								>
								<a
									href="/user/categories"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/categories')}
									>Categories</a
								>
								<a
									href="/user/cart"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/cart')}
									>Cart</a
								>
								<a
									href="/user/about"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/about')}
									>About</a
								>
								<a
									href="/user/tracking"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/user/tracking')}
									>Tracking</a
								>
								<a
									href="/login" 
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									>Sign In</a
								>

							{/if}

							<!-- Current: "bg-gray-900 text-black", Default: "text-black hover:bg-gray-200 hover:text-black" -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="sm:hidden" id="mobile-menu">
		<div class="space-y-1 px-2 pb-3 pt-2">
			<!-- Current: "bg-gray-900 text-black", Default: "text-black hover:bg-gray-200 hover:text-black" -->
			<a
				href="#"
				class="bg-gray-900 text-black block rounded-md px-3 py-2 text-base font-medium"
				aria-current="page">Dashboard</a
			>
			<a
				href="#"
				class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
				>Team</a
			>
			<a
				href="#"
				class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
				>Projects</a
			>
			<a
				href="#"
				class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
				>Calendar</a
			>
		</div>
	</div>
</nav>

<style>

	.active{
		background-color: rgb(209 213 219);
	}
</style>