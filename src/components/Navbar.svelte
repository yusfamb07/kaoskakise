<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';
	import { dataAPI } from '../routes/utils/axios';
	import { countCartBadge } from '../routes/(app)/user/product/countCartBadge';
	import { updateCartCountUI } from '../routes/(app)/user/product/countCartBadge';

	const url_API = import.meta.env.VITE_API_DIGITAL;
	let user_id = '',
		usernname = '',
		userRoles = '',
		user_photo = '';
		// token = '';
	
  	let cartCount = 0;
		

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
		await countCartBadge();
		user_id = localStorage.getItem('user_id');
		usernname = localStorage.getItem('usernname');
		userRoles = localStorage.getItem('userRoles');
		user_photo = localStorage.getItem('user_photo');
		if (localStorage.getItem('token')) {
			
			cartCount = await countCartBadge();
	
			await updateCartCountUI();
		}
		// console.log(cartCount);
		if (!localStorage.getItem('token')) goto('/');

		// console.log(cartCount, 'Cart Update');
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
									<div id="cart-count" class="absolute inline-flex items-center justify-center w-8 h-6 text-xs font-semibold text-white bg-red-500 border-2 border-gray-300  rounded-full top-2 ">
										0
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
									>Orders</a
								>
								
								<div class="dropdown flex justify-center items-center gap-2 ">
									<img
										class="w-7 h-7 rounded-full "
										src={user_photo
											? `${url_API}/auth/image/${user_photo}`
											: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
										alt=""
									/>
									<!-- <img
										class="w-7 h-7 rounded-full "
										src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
										alt="user photo"
									/> -->
									<button
										type="button"
										class="flex text-sm "
										id="dropdownMenuButton1"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
									<p class="text-black text-base break-all whitespace-normal">{usernname}</p>
										
									</button>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
										
										<li><a class="dropdown-item hover:bg-gray-300" href="#!">Edit Profile</a></li>
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
									class:active={$page.url.pathname.includes('/guest/dashboard')}
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
									id="dropdownHoverButton1" data-dropdown-toggle="dropdownHover1" data-dropdown-trigger="hover"
									>Cart</a
								>
								<div id="dropdownHover1" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
									<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton1">
										<li>
											<a href="#" class="block px-4 py-2 ">
												<div class="flex justify-center items-center">
													<img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
												</div>
												<div class="flex justify-center items-center">
													<p class=" text-center text-sm  font-semibold uppercase text-gray-800">No product yet</p>
												</div>
												<div class="flex justify-center items-center">
													<p class=" text-center text-sm  font-medium text-gray-800">Please Sign in</p>
												</div>
											</a>
										</li>
									</ul>
								</div>
								<a
									href="/guest/about"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/guest/about')}
									>About</a
								>
								<a
									href="/login"
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									class:active={$page.url.pathname.includes('/login')}
									id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover"
									>Orders</a
								>
								<div id="dropdownHover" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
									<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
									<li>
										<a href="#" class="block px-4 py-2 ">
											<div class="flex justify-center items-center">
												<img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
											</div>
											<div class="flex justify-center items-center">
												<p class=" text-center text-sm  font-semibold uppercase text-gray-800">No orders yet</p>
											</div>
											<div class="flex justify-center items-center">
												<p class=" text-center text-sm  font-medium text-gray-800">Please Sign in</p>
											</div>
										</a>
									</li>
								</div>
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