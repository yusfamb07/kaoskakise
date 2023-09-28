<script>

	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;

	let carts = [];
	let qty = ''
	let total = '';
	let carts_qty = [];
	let formData = {
		value: '',
    	etd: ''
	};


	async function countCart() {
		try {
			const res = await dataAPI.get(`carts/showCarts`);
			carts = res.data.data.result;
			total = res.data.data.sum;

			const cartsWithTotalCost = carts.map((item) => {
			const cartQty = parseFloat(item.cart_qty);
			const prodPrice = parseFloat(item.cart_prod.prod_price);
			const totalCost = cartQty * prodPrice;

				return {
					...item,
					totalCost: totalCost,
					cartQty: cartQty
				};
			});

			const totalAllCost = cartsWithTotalCost.reduce((total, item) => total + item.totalCost, 0);
			return totalAllCost

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
	}
	
	function calculateTotalCost(cart) {
		const cartQty = parseFloat(cart.cart_qty);
		const prodPrice = parseFloat(cart.cart_prod.prod_price);
		return cartQty * prodPrice;
	}

	

	const TotalQty = async (isIncrement, cart) => {
		const newCartQty = isIncrement
			? parseFloat(cart.cart_qty) + 1
			: Math.max(parseFloat(cart.cart_qty) - 1, 0);
		
		cart.cart_qty = newCartQty;

		try {
			const res = await fetch(
				`${url_API}/carts/updateCart/${cart.cart_id}`,
				{
					method: 'POST',
					body: JSON.stringify({
						cart_qty: newCartQty // Assuming your API expects 'cart_qty' as the parameter to update
					}),

					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			).then((res) => res.json());
			console.log('Updated quantity for cart item:', cart.cart_id, 'New quantity:', newCartQty);
			console.log('API response:', res.data);
			await countCart();
			
		} catch (error) {
			console.log(error);
		}
		
		carts = [...carts];
	};

	let data_address = [];
	let data_ongkirs = [];
	let data_payment = [];
	let payment_id = '';
	let sub_total_prod = '';
	let totalAllCost;
	let data_cart = [];

	async function handleCheckout(event) {
		
		const user_id = localStorage.getItem('user_id');

		const selectedValue = event.target.value;
			formData.value = selectedValue;

			const selectedOption = data_ongkirs.find(option => option.value === Number(selectedValue));
			if (selectedOption) {
				formData.etd = selectedOption.etd;
			}

		try {
			const response = await dataAPI.get(`/carts/checkout/${user_id}`);
			data_address = response.data.data.data_address;
			data_ongkirs = response.data.data.data_ongkirs;
			data_payment = response.data.data.data_payment;
			data_cart = response.data.data.data_cart;
			sub_total_prod = response.data.data.subtotal;


			const cartsWithTotalCost = data_cart.map((item) => {
			const cartQty = parseFloat(item.qty);
			const prodPrice = parseFloat(item.price);
			const totalCost = cartQty * prodPrice;
				
				return {
					...item,
					totalCost: totalCost
				};
			});


			// Log the total values (you can use them as needed)
			console.log('Total product cost:', sub_total_prod);
			console.log('Total ongkirs value:', selectedValue);

			const totalCost = parseFloat(sub_total_prod);
			const totalOngkir = parseFloat(selectedValue);
			const totalAllCost =  totalCost + totalOngkir;
		
			// console.log('Total all cost:', totalAllCost);

		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

	function calculateTotalCostCheckout(data) {
		const cartQty = parseFloat(data.qty);
		const prodPrice = parseFloat(data.price);
		return cartQty * prodPrice;
	}

	let NoRekening = "7030248095";
	let isCopy = false;

	function copyToClipboard() {
		const textarea = document.createElement('textarea');
		textarea.value = NoRekening;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		isCopy = true;
		setTimeout(() => {
			isCopy = false;
		}, 1000);
	}



	onMount(async () => {
		await countCart();
		
	});
</script>

<div class="container lg mx-auto">
	<h1 class="text-xl font-belanosima d-flex justify-center mt-4">CART</h1>
	<div class="flex justify-center ">
		<div class="border-b border-black border-1  w-16"></div>
	</div>

	<div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-3 mt-3">
		<div class="lg:col-span-2 sm:col-span-1">
			<div class="rounded shadow-md sm:rounded-lg">
				<table class="w-full rounded text-sm text-left text-gray-500 mt-2">
					<thead class="text-base text-black uppercase border-dark border-bottom">
						<tr>
							<th scope="col" class="lg:px-6 lg:py-3 sm:px-5 sm:py-2 text-center"> Product  </th>
							<th scope="col" class="lg:px-8 lg:py-3 sm:px-7 sm:py-2"> Price </th>
							<th scope="col" class="px-8 py-3"> Quantity </th>
							<th scope="col" class="lg:px-8 lg:py-1 sm:px-7 sm:py-2"> Total </th>
							<th scope="col" class="px-3 py-3"> Action </th>
						</tr>
					</thead>
					<tbody>
						{#if carts}
							{#each carts as cart }
								<tr class="bg-white border-bottom">
									<td class="px-3 py-2">
											<div class="d-flex justify-items-center">
												<img
													src={cart?.cart_prod.prod_image
													? `${url_API}/products/image/${cart?.cart_prod.prod_image}`
													: '/product-default.png'}
													class="lg:w-40 lg:h-40 sm:w-24 sm:h-20 px-3 py-1"
													alt=""
												/>
												<p class="lg:text-base sm:text-sm font-medium text-gray-900  whitespace-normal flex items-center">
													{cart?.cart_prod.prod_name}
												</p>
											</div>
									</td>

									<td class="px-3 py-2">

										<p class="lg:text-base sm:text-sm font-medium text-gray-900  whitespace-normal">
											{`Rp ${Number(cart?.cart_prod.prod_price).toLocaleString('id-ID')}`}
										</p>
									</td>
									<td class="px-3 py-2">
										<div class="flex justify-center gap-1">
											<button on:click={() => TotalQty(true, cart)}>
												<img src="/add.svg" alt="" class="w-4 cursor-pointer" />
											</button>
											<p class="text-base font-xl text-gray-900 whitespace-normal">
											{cart.cart_qty}
											</p>
											<button on:click={() => TotalQty(false, cart)}>
												<img src="/remove.svg" alt="" class="w-4 cursor-pointer" />
											</button>
										</div>
									</td>
									<td class="px-3 py-2">
										<p class="lg:text-base sm:text-sm font-medium text-gray-900  whitespace-normal">
											{`Rp ${Number(calculateTotalCost(cart)).toLocaleString('id-ID')}`}
										</p>
									</td>
									<td class="px-3 py-2">
										
										<a href="#!" class="lg:text-base sm:text-sm font-medium text-red-400 dark:text-red-300 hover:underline"
											>Remove</a
										>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="12">
									<div
										class="loader-container m-0 h-100 px-3 py-3 gap-3 d-flex align-items-center justify-content-center"
									>
										<div class="custom-loader" />
										<h4 class="text-black load-title text-lg">Loading....</h4>
									</div>
								</td>
							</tr>
						{/if}

						
					</tbody>
				</table>
			</div>
		</div>
		<div class=" rounded-lg bg-gray-200 max-h-44 mt-2">

			<h1 class="px-6 py-3 text-base text-black uppercase font-bold">Total {carts.length} Product</h1>
			<hr />
				<h1 class=" px-6 py-3 text-xl font-semibold text-gray-900  whitespace-normal">
					{`Rp ${Number(total).toLocaleString('id-ID')}`}
				</h1>
			<div class="container flex items-end">
				<button
					on:click={handleCheckout}
					data-bs-toggle="modal"
					data-bs-target="#checkoutModal"
					class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-10 mt-2"
					>CHECKOUT</button
				>
			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="checkoutModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-scrollable modal-xl">
		<div class="modal-content">
			<div class="modal-body">
				<table class="w-full rounded  text-left mt-3">
					<thead class="text-base text-black border-dark border-bottom" >
						<tr>
							<th scope="col" class="w-60 px-2 py-2 text-lg bg-white"> SHIPPING ADDRESS </th>
							<th scope="col" class="w-auto bg-white" />
							<th scope="col" class="w-30 bg-white" />
						</tr>
					</thead>
					<tbody>
						{#each data_address as data }							
							<tr class="bg-white border-bottom">
								<td class="px-2 py-2">
									<p class="text-base font-semibold text-gray-900  whitespace-normal">
										{data?.personal_name}
									</p>
									<p class="text-base font-semibold text-gray-900  whitespace-normal">
										{data?.phone_number}
									</p>
								</td>
								<td class="px-1 py-2">
									<div class="flex justify-center gap-1">
										<p class="text-base font-medium text-gray-900  whitespace-normal">
											{data?.address}
										</p>
										<p class="text-base font-medium text-gray-900  whitespace-normal">
											{data?.area}
										</p>
									</div>
								</td>
								<td class="px-3 py-2">
									<a href="#" class="text-base font-medium whitespace-nowrap text-red-400 dark:text-red-300 hover:underline"
										>Change Address</a
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				
					<!-- <h1 class="font-bold text-base mt-3">ORDERED PRO</h1> -->
				<table class="w-full rounded text-sm text-left  mt-3 border-dark border-bottom">
					<thead class="text-base text-black border-dark border-bottom">
						<tr>
							<th scope="col" class=" px-2 py-2 font-semibold"> Product name </th>
							<th scope="col" class=" px-2 py-2 font-semibold w-36 "> Price </th>
							<th scope="col" class=" px-2 py-2 font-semibold flex justify-center"> Quantity </th>
							<th scope="col" class=" px-2 py-2 font-semibold w-36"> Total </th>
						</tr>
					</thead>
					<tbody>
						{#each data_cart as data }
							<tr class="bg-white border-bottom">
								<td class="px-2 py-2">
									<div class="d-flex justify-items-center">
										<img
												src={data?.image
												? `${url_API}/products/image/${data?.image}`
												: '/product-default.png'}
												class="lg:w-44 lg:h-40 sm:w-24 sm:h-20 px-3 py-1"
												alt=""
											/>
										<p class="text-base font-semibold text-gray-900  whitespace-normal flex items-center">
											{data.name}
										</p>

										
									</div>
								</td>

								<td class="px-2 py-2">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										{`Rp ${Number(data.price).toLocaleString('id-ID')}`}
									</p>
								</td>
								<td class="px-2 py-2">
									<div class="flex justify-center gap-1">
										<p class="text-base font-medium text-gray-900  whitespace-normal">
											{data.qty}
										</p>
									</div>
								</td>
								<td class="px-2 py-2">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										{`Rp ${Number(calculateTotalCostCheckout(data)).toLocaleString('id-ID')}`}
									</p>
								</td>

							</tr>
							
						{/each}
					</tbody>
				</table>


				<div class="grid grid-cols-3 gap-0 mt-3">
					<div class="">
						<h1 class="font-bold text-lg">SHIPPING SERVICE</h1>
					</div>
					<div>
					<select id="countries" on:change={handleCheckout} bind:value={formData.value} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						<option selected>Choose a service</option>
						{#each data_ongkirs as data}
							<option value={data?.value}>{data?.service}</option>
						{/each}
					</select>

					</div>
					<div>
						<label for="countries" class="block mb-0 text-lg ml-4 font-semibold text-black dark:text-white">{`Rp ${Number(formData?.value).toLocaleString('id-ID')}`}</label>
						{#if formData.etd}
							<label for="countries" class="block mb-0 text-sm ml-4 font-medium text-black dark:text-white">Estimasi Pengiriman: {formData.etd} Hari</label>
						{/if}
					</div>				
				</div>

				<div class="grid grid-cols-3 gap-0 mt-3">
					<div class="">
						<h1 class="font-bold text-lg">PAYMENT METHOD</h1>
					</div>
					<div class="col-span-2 flex justify-start gap-2">
						{#each data_payment as data }
							<button class=" flex justify-start items-center gap-1 border-solid border-2 border-black rounded py-1 px-1">
								<h1 class="text-sm font-semibold whitespace-normal hover:underline">{data?.payment_name}</h1>
							</button>
						{/each}
						<!-- <button type="button" class="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
						
							<img src="/bca.svg" class="h-4 mr-2 -ml-1 w-12" alt="">
							Pay with BCA
						</button>
						<button type="button" class="text-white bg-[#ff541c] hover:bg-[#da4210]/80 focus:ring-4 focus:outline-none focus:ring-[#b73105]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
							<img src="/cod.png" class="h-6 mr-2 -ml-1 w-12" alt="">							
							Pay COD
						</button> -->
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-5">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5">
						<h3 class="font-semibold text-base whitespace-nowrap">Subtotals for Products</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">{`Rp ${Number(sub_total_prod).toLocaleString('id-ID')}`}</h3>
				
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5 border-b border-black">
						<h3 class="font-semibold text-base whitespace-normal">Shipping Cost</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">{`Rp ${Number(formData?.value).toLocaleString('id-ID')}`}</h3>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-3">
						<h3 class="font-semibold text-base whitespace-nowrap">Total</h3>
						<h3 class="font-semibold text-2xl text-red-400 whitespace-normal flex justify-end">{`Rp ${Number(sub_total_prod + formData?.value).toLocaleString('id-ID')}`}</h3>					
					</div>
				</div>

				<div class="grid grid-cols-3 gap-0 mt-4">
					<div class="col-span-2 w-40"></div>
					<button
						data-bs-toggle="modal"
						data-bs-target="#paymentModal"
						class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3"
						>MAKE AN ORDER</button
					>
				</div>


			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="paymentModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body">
				<div class="grid grid-cols-2 gap-2">
					<div><h3  class="font-semibold text-lg whitespace-normal">Total Pembayaran</h3></div>
					<div><h3  class="font-bold text-xl whitespace-normal flex justify-end">{`Rp ${Number(sub_total_prod + formData?.value).toLocaleString('id-ID')}`}</h3></div>
				</div>
				<hr class="mt-2" />
				<div class="grid grid-cols-2 gap-2">
					<div><img src="/bca.png" class="w-44" alt=""></div>
					<div>
						<p class="font-medium text-sm whitespace-normal mt-4">No. Rekening</p>
						<div class="flex justify-start gap-2">
							
							<h3 class="font-semibold text-2xl mt-0 text-red-400 whitespace-normal">{NoRekening}</h3>
							<h3 class="font-medium text-base mt-1 text-gray-600 whitespace-normal cursor-pointer" on:click={copyToClipboard}>SALIN</h3>
							<br>
						</div>
						{#if isCopy}
							<p class="text-xs">Teks berhasil disalin</p>
						{/if}
						<p class="text-sm font-bold mt-0">A.n Yusfa Muhammad Bakran</p>
					</div>

				</div>
				<div class="flex justify-center">
					<button
						data-bs-dismiss="modal"
						class=" w-72 rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3 "
						>OK</button
					>
				</div>

				


			</div>
		</div>
	</div>
</div>

<style>
	
</style>
