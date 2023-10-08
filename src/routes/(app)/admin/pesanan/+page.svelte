<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;

	let page = parseInt(1),
		total,
		products = null,
		province = '';

	async function getProduct() {
		try {
			const res = await dataAPI.get(`/products?page=${page}&record=10`);
			products = res.data.data;;
			total = res.data.pagination.totalPage;

			// console.log(products);
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

	const handlePageChange = (e) => {
		page = e.detail;
		getProduct();
	};
	
	// send request
	let prod_name = '',
		prod_price = '',
		prod_cate_id = '',
		prod_desc = '',
		prod_id = '',
		fileInput = '';
	let formData = {};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formDataUpload = new FormData();
		formDataUpload.append('prod_name', formData.prod_name);
		formDataUpload.append('prod_price',formatPrice(formData.prod_price)) ;
		formDataUpload.append('prod_desc', formData.prod_desc);
		formDataUpload.append('prod_cate_id', formData.prod_cate_id);
		// formData.append('prod_qty', formData.prod_qty);
		formDataUpload.append('prod_image', fileInput.files[0]);

		console.log(formDataUpload);
		try {
			const response = await dataAPI.post(`/products/store`, formDataUpload);
			if (response.status === 200) {
				await Swal.fire({
					icon: 'success',
					title: 'Your product has been saved',
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
			}
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
			console.log(error);
		}
	};

	let updData = {};
	let fileUpdate = '';

	async function handleUpdateData(e) {
		const { prodId } = e.currentTarget.dataset;
		try {
			const response = await dataAPI.get(`/products/${prodId}`);
			updData = response.data[0];
			prod_id = updData.prod_id;
			prod_name = updData.prod_name;
			prod_price = updData.prod_price;
			prod_desc = updData.prod_desc;
			prod_cate_id = updData.prod_cate.cate_id;
			prod_image = updData.prod_image;
			
			console.log(updData);
		} catch (error) {
			bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
			console.log(error);
		}
	}

	const updateData = async (event) => {
		event.preventDefault();

		if (fileUpdate.files[0]) {
			const formData = new FormData();
			formData.append('prod_name', prod_name);
			formData.append('prod_price',formatPrice(prod_price)) ;
			formData.append('prod_desc', prod_desc);
			formData.append('prod_cate_id', prod_cate_id);
			// formData.append('prod_qty', formData.prod_qty);
			formData.append('prod_image', fileUpdate.files[0]);

			console.log(formData);

			const { prodId } = event.currentTarget.dataset;

			try {
				const response = await dataAPI.put(
					`/products/update/${prodId}`,
					formData
				);

				if (response.status === 200) {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						icon: 'success',
						title: 'Your product has been updated',
						showConfirmButton: false,
						timer: 1500
					});
					location.reload();
				} else {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
					console.log(error);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			const { prodId } = event.currentTarget.dataset;

			fetch(`${url_API}/backend/api/incoming_mail/tata_usaha/no_image/${prodId}`, {
				method: 'PUT',
				body: JSON.stringify({
					prod_id: prod_id,
					prod_name: prod_name,
					prod_price: prod_price,
					prod_desc: prod_desc,
					prod_cate_id: prod_cate_id
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
				.then(async (response) => {
					console.log(response);
					if (response.status === 200) {
						bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
							await Swal.fire({
							icon: 'success',
							title: 'Your product has been updated',
							showConfirmButton: false,
							timer: 1500
						});
						location.reload();
					} else {
						bootstrap.Modal.getInstance(document.getElementById('FormModalEdit')).hide();
						await Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Something went wrong!',
						});
						console.log(error);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	function formatPrice(price) {
		const cleanedPrice = price.replace(/[^\d]/g, '');
		const parsedPrice = parseInt(cleanedPrice, 10);
		if (isNaN(parsedPrice)) {
			return ''; // Invalid input, return empty string
		}
		return parsedPrice.toString();
	}

	let search = null;

	async function searchProducts() {
		products = null;

		try {
			const res = await fetch(
				`${url_API}/products/search/products?page=${page}&record=10`,
				{
					method: 'POST',
					body: JSON.stringify({
						search: `%${search}%`
					}),

					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			).then((res) => res.json());
			products = res.data;
			total = res.pagination.totalPage;
		} catch (error) {
			console.log(error);
		}
	}

	function handleSearchSubmitEnter(event) {
		if (event.key === 'Enter') {
			searchProducts();
		}
	}

	function formatRupiah(angka, prefix) {
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
			split = number_string.split(','),
			sisa = split[0].length % 3,
			rupiah = split[0].substr(0, sisa),
			ribuan = split[0].substr(sisa).match(/\d{3}/gi),
			separator = sisa ? '.' : ''; // Declare separator here

		if (ribuan) {
			rupiah += separator + ribuan.join('.');
		}

		rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
		return prefix === undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
	}

	function handleKeyUpWithRupiah(dengan_rupiah) {
		dengan_rupiah.value = formatRupiah(dengan_rupiah.value, 'Rp. ');
	}
		
	let categories = [];
	async function fetchCategories() {
		try {
			const res = await dataAPI.get(`/categories`);
			categories = res.data.data;
		} catch (error) {
			return error;
		}
	}

	let activeTabIndex = 0;

	const tabs = [
		{ icon: `<img src="/all.svg" class="w-5 h-5 mr-3" alt="">`, 
		title: 'Order All', content: [
		{ no_order: 'SE001', image:'<img src="/gallery5.jpg" class="w-20" alt="">', name_product: 'Kaos kaki ribal', price: 'Rp 300.000', qty: '2 pcs', total: 'Rp 600.000'  },
		{ no_order: 'SE001', image:'<img src="/gallery5.jpg" class="w-20" alt="">', name_product: 'Kaos kaki ribal', price: 'Rp 300.000', qty: '2 pcs', total: 'Rp 600.000'  },
		{ no_order: 'SE001', image:'<img src="/gallery5.jpg" class="w-20" alt="">', name_product: 'Kaos kaki ribal', price: 'Rp 300.000', qty: '2 pcs', total: 'Rp 600.000'  },
		{ no_order: 'SE001', image:'<img src="/gallery5.jpg" class="w-20" alt="">', name_product: 'Kaos kaki ribal', price: 'Rp 300.000', qty: '2 pcs', total: 'Rp 600.000'  },
		{ no_order: 'SE001', image:'<img src="/gallery5.jpg" class="w-20" alt="">', name_product: 'Kaos kaki ribal', price: 'Rp 300.000', qty: '2 pcs', total: 'Rp 600.000'  },
		]},
		{ icon: `<img src="/rupiah.png" class="w-5 h-5 mr-3" alt="">`,  
		title: 'Payment', content: [
		{ key: 'Item 1', value: 'Value 1' },
		{ key: 'Item 2', value: 'Value 2' },
		{ key: 'Item 3', value: 'Value 3' }
		]},
		{ icon: `<img src="/fast-delivery.png" class="w-5 h-5 mr-3" alt="">`,  
		title: 'Delivery', content: [
		{ key: 'Item 1', value: 'Value 1' },
		{ key: 'Item 2', value: 'Value 2' },
		{ key: 'Item 3', value: 'Value 3' }
		]},
		{ icon: `<img src="/order-tracking.png" class="w-5 h-5 mr-3" alt="">`,  
		title: 'Tracking', content: [
		{ key: 'Item 1', value: 'Value 1' },
		{ key: 'Item 2', value: 'Value 2' },
		{ key: 'Item 3', value: 'Value 3' }
		]}
	];

	function switchTab(index) {
		activeTabIndex = index;
	}

	onMount(async () => {
		await getProduct();
		await fetchCategories();
		    switchTab(0);
		// await fetchCategories();
		// await addValue();
		// new DataTable('#productlist', {
		// 	ordering: true,
		// 	lengthChange: true,
		// 	searching: true,
		// 	paging: true
		// });
	});
</script>

<div class="p-4 mt-4 sm:ml-64">
	<div class="p-4 border-2 border-gray-200 border-dashed rounded-md dark:border-gray-700 mt-14">
		<div class="flex justify-between">
			<h1 class="text-lg font-bold text-color underline">Orders</h1>
		</div>
		<div class="border-b border-gray-200 dark:border-gray-700">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<ul class="flex flex-wrap -mb-px text-sm font-medium text-center w-full text-gray-500 dark:text-gray-400">
				{#each tabs as tab, index}
				<li class="mr-2">
					<a href="#!" on:click={() => switchTab(index)} class="inline-flex items-center justify-center p-4  {index === activeTabIndex ? 'text-black border-b-2 border-red-500 rounded-t-lg' : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'}
					 dark:text-blue-500 dark:border-blue-500 group" aria-current="page">
						
					 <span class="mr-2">{@html tab.icon}</span>
						{tab.title}
					</a>
				</li>
				
				
				{/each}
			</ul>
		</div>
		<div id="panels">
			{#each tabs as tab, index}
				<div
				class= " mt-4 {index === activeTabIndex ? '' : 'hidden'}"
				>
				<table class="table table-auto border border-1 mt-4 w-100 rounded-sm">
					<thead>
					<tr>
						<th style="width: 10%;" >No Order</th>
						<th style="width: 30%;" >Name Product</th>
						<th >Quantity</th>
						<th >Price</th>
						<th >Total</th>
					</tr>
					</thead>
					<tbody>
					{#each tab.content as item}
						<tr>
							<td >{item.no_order}</td>
							<td class="d-flex gap-3"> {@html item.image}{item.name_product}</td>
							<td >{item.price}</td>
							<td >{item.qty}</td>
							<td >{item.total}</td>
						</tr>
					{/each}
					</tbody>
				</table>
				</div>
			{/each}
		</div>

	</div>
</div>

<div class="modal fade" id="AddModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add Product</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
      </div>
	  <form on:submit={handleSubmit}>
      <div class="modal-body">
			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
					<input type="text" id="product-input" placeholder="Please input your product name" bind:value={prod_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>

				<div class="mb-6">
					<label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Product</label>
					<select on:change={fetchCategories}
						bind:value={prod_cate_id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						{#each categories as cate}
							<option value={cate.cate_id}>{cate.cate_name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
					<div class="flex">
						<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
							<h5 class="text-black font-bold">RP</h5>
						</span>
						<input type="text" id="dengan-rupiah"
							on:keyup={(e) => handleKeyUpWithRupiah(e.target)}  bind:value={prod_price}
							class="rounded-none rounded-r-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input your price">
					</div>
				</div>

				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity </label>
					<input type="number" id="quantiy-input" placeholder="Please input your product name" 
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
			</div>

			<div class="grid grid-cols-1 ">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description </label>
					<textarea id="descripstion" rows="4" bind:value={prod_desc} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please describe your product here..."></textarea>				
				</div>	
			</div>

			<div class="grid grid-cols-1">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Product</label>
				<input bind:this={fileInput} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
			</div>
			
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Save Product</button>
		</div>
	</form>
    </div>
  </div>
</div>

<div class="modal fade" id="EditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Edit Product</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>     
	</div>
	<form on:submit={handleSubmit}>
      	<div class="modal-body">
			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
					<input type="text" id="product-input" placeholder="Please input your product name" bind:value={formData.prod_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>

				<div class="mb-6">
					<label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Product</label>
					<select on:change={fetchCategories}
						bind:value={formData.prod_cate_id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						{#each categories as cate}
							<option value={cate.cate_id}>{cate.cate_name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
					<div class="flex">
						<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
							<h5 class="text-black font-bold">RP</h5>
						</span>
						<input type="text" id="dengan-rupiah"
							on:keyup={(e) => handleKeyUpWithRupiah(e.target)}  bind:value={formData.prod_price}
							class="rounded-none rounded-r-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input your price">
					</div>
				</div>

				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity </label>
					<input type="number" id="quantiy-input" placeholder="Please input your product name" 
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
			</div>

			<div class="grid grid-cols-1 ">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description </label>
					<textarea id="descripstion" rows="4" bind:value={formData.prod_desc} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please describe your product here..."></textarea>				
				</div>	
			</div>

			<div class="grid grid-cols-1">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Product</label>
				<input bind:this={fileInput} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
			</div>
			
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Save Product</button>
		</div>
	</form>
    </div>
  </div>
</div>

<style>
	th {
		background-color: rgb(209 213 219);
	}
</style>
