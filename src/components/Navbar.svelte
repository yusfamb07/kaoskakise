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

	let carts = '';
	async function countCart() {
		const token = localStorage.getItem('token');


		if (token) {
			try {
				const res = await dataAPI.get(`carts/showCarts`);
				carts = res.data.data.result;
				// total = res.data.pagination.totalPage;
	
				// console.log(carts);
			} catch (error) {
				console.log(error);
				await Swal.fire({
					icon: 'error',
					title: 'Oops!',
					confirmButtonColor: '#596066',
					customClass: 'swal-height',
					text: 'An error occurred while fetching data'
				});
			}
		} else{
			console.log('tidak ada token');
		}

	}

	onMount(async () => {
		await countCart();

		// 
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
									>Cart
									<div class="absolute inline-flex items-center justify-center w-8 h-6 text-xs font-semibold text-white bg-red-500 border-2 border-gray-300  rounded-full top-2 dark:border-gray-900">
										{carts.length}
									</div>
								</a>
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
								<div class="dropdown flex justify-center items-center ">
									<button
										type="button"
										class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
										id="dropdownMenuButton1"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<span class="sr-only">Open user menu</span>
										<img
											class="w-7 h-7 rounded-full "
											src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
											alt="user photo"
										/>
									</button>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
										
										<li><a class="dropdown-item hover:bg-gray-300" href="#!">Edit Profile</a></li>
										<li><a class="dropdown-item hover:bg-gray-300" href="#!">Upload Bukti Transfer</a></li>
										<li>
											<a class="dropdown-item hover:bg-gray-300" href="#!" on:click={logoutHandler}
												>Logout</a
											>
										</li>
									</ul>
								</div>
								<!-- <a
									href="#!" on:click={logoutHandler}
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									>Sign Out</a
								> -->
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
									href="/guest/dashboard"
									class=" text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('//guest/dashboard')}
									aria-current="page">Home</a
								>
								<a
									href="/guest/product"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/guest/product')}
									>All Product</a
								>
								<a
									href="/guest/categories"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/guest/categories')}
									>Categories</a
								>
								<a
									href="/login"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/login')}
									>Cart</a
								>
								<a
									href="/guest/about"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/guest/about')}
									>About</a
								>
								<a
									href="/guest/tracking"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/guest/tracking')}
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