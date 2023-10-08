<script>
    import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;
	import { goto } from '$app/navigation';

    let unpayment_cart = [];
    let status_payment = '';
    let shipping_cost = '';
    let subtotal = '';

    async function unPaymentTabs() {

		try {
			const res = await dataAPI.get(`carts/listUnpayment`);
			unpayment_cart = res.data.data.data_cart;
			status_payment = res.data.data.data_payment.status;
            shipping_cost = parseFloat(res.data.data.data_payment.ongkir);
			subtotal = parseFloat(res.data.data.data_payment.totalAll);

            
            tabs[1].content = unpayment_cart.map(item => ({
                no_order: item.id,  
                image: `<img src="${item.prod_image
                        ? `${url_API}/products/image/${item.prod_image}`
                        : '/product-default.png'}" class="w-32" alt="">`,
                name_product: item.prod_name,
                desc_product: item.prod_desc,
                price: `Rp ${Number(item.prod_price).toLocaleString('id-ID')}`,
                subtotal: `Rp ${Number(item.total).toLocaleString('id-ID')}`,
                qty: item.qty,
                shipping_cost: `Rp ${Number(item.ongkir).toLocaleString('id-ID')}`,
                payment: item.payment, 
                action: `
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#transferPayment"
                        id="handleTransfer"
                        data-order= ${item?.id}
                        class="w-28 rounded-md bg-red-500 text-white font-semibold text-sm h-9 mt-3 mb-3"
                    >
                        Upload Bukti
                    </button>
                `
            }));

           

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

    let payment = [];

    async function PaymentTabs() {
		// isLoading = true;
		// setTimeout(() => {
		// 	isLoading = false;
		// }, 1000);
		try {
			const res = await dataAPI.get(`carts/listPayment`);
			payment = res.data.data;

            tabs[2].content = payment.map(item => ({
                no_order: item.id,
                
                image: `<img src="${item.prod_image
                        ? `${url_API}/products/image/${item.prod_image}`
                        : '/product-default.png'}" class="w-32" alt="">`,
                name_product: item.prod_name,
                price: `Rp ${Number(item.prod_price).toLocaleString('id-ID')}`,
                qty: item.qty,
                shipping_cost: `Rp ${Number(item.ongkir).toLocaleString('id-ID')}`,
                payment: item.payment,
               
                // total: item.total
            }));

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

    let files = '';

	async function submitTransfer(e) {
        const { orderId } = e.currentTarget.dataset;
		const formDataWithFile = new FormData();
		formDataWithFile.append('fopa_image_transaction', files[0]);

		try {
			const response = await dataAPI.post(`/carts/upload_bukti/${orderId}`, formDataWithFile);
			if (response.status === 200) {
					await Swal.fire({
						icon: 'success',
						title: 'Successful adding to cart',
						showConfirmButton: false,
						timer: 1500
					});
					location.reload();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
                console.log(error);
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

    let requestTransfer = ''

    async function getDetailOrder() {
		try {
			const res = await dataAPI.get(`/backend/api/lawful_inter/binda/detail/${lawinId}`);
			requestTransfer = res.data.data[0];
			// orderId = requestTransfer.id;
			

			console.log(requestEdit);
		} catch (error) {
			console.log(error);
		}
	}

    let activeTabIndex = 0;

	const tabs = [
		{ icon: `<img src="/all.svg" class="w-6 h-6 mr-3" alt="">`, 
		title: 'Order All', content: [
          
		]},
        { icon: `<img src="/unpaid.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Unpayment', content: [
           
		]},
		{ icon: `<img src="/rupiah.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Payment', content: [
           
		]},
		{ icon: `<img src="/fast-delivery.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Delivery', content: [
            
		]},
		{ icon: `<img src="/cancelled.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Cancelled', content: [
           
		]}
	];

	function switchTab(index) {
		activeTabIndex = index;
	}

    function handleRowClick(item) {
        goto(`/user/tracking/${item.no_order}`);
    }

    onMount(async () => {
		switchTab(0);
        await unPaymentTabs()
        await PaymentTabs()
        
        document.querySelectorAll('#handleTransfer').forEach((el) => {
            el.addEventListener('click', () => {
                orderId = el.dataset.order;
            });
        });
        document.getElementById('transferPayment').addEventListener('shown.bs.modal', getDetailOrder);

	});
</script>

<div class="container">
    <div class="grid grid-cols-1">
        <h1 class="text-xl font-belanosima flex justify-center mt-4">ORDERS</h1>
        <div class="flex justify-center ">
            <div class="border-b border-black border-1  w-24"></div>
        </div>
        
    </div>
    <div class="border-b border-gray-200 mt-3">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center w-full text-gray-800 gap-3 ">
            {#each tabs as tab, index}
                <li class="mr-2">
                    <a href="" on:click={() => switchTab(index)} class="inline-flex items-center justify-center p-4  {index === activeTabIndex ? 'text-black border-b-2 border-red-500 rounded-t-lg' : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'}
                        group" aria-current="page">
                        
                        <span class="mr-2">{@html tab.icon}</span>
                        {tab.title}
                    </a>
                </li>
            {/each}
            <div class="flex justify-center ">
                <form class="w-96 mt-4">
                    <div class="flex items-center border-b border-black py-2">
                        <input
                            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type="text"
                            placeholder="Search by Product Name or No Orders "
                            aria-label="Search"
                        />
                        <button class="flex-shrink-0 bg-black text-sm text-white py-1 px-2 rounded" type="button">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </ul>
		</div>
		<div id="panels">
			{#each tabs as tab, index}
				<div class= " mt-4 {index === activeTabIndex ? '' : 'hidden'}">
                    {#if tab.content.length > 0}
                             <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
                                <div class="grid grid-cols-9 mt-3">
                                    <div class="col-span-8 border-b border-gray-300">
                                        <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 ">No. Orders : </h5>
                                    </div>
                                    <div class="border-b border-gray-300">
                                        <h5 class="font-semibold text-xl  uppercase text-red-500 flex justify-end">{status_payment}</h5>
                                    </div>
                                </div>
                                 {#each tab.content as item}

                                <div class="grid grid-cols-9 mt-3">
                                    <div class="col-span-8 border-b border-gray-300">
                                        <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                            <div class=" py-2 w-full ml-5 flex items-start">
                                               {@html item?.image}
                                                    <div>
                                                        <p class="text-xl font-semibold text-black">{item?.name_product} <br><span class="text-base font-medium">{item?.desc_product}</span><br><span class="font-medium text-base">x {item.qty}</span></p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border-b border-gray-300">
                                        <h5 class="font-semibold text-xl text-red-500 flex justify-end">{item?.subtotal}</h5>
                                    </div>
                                </div>
                                {/each}
                                <div class="grid grid-cols-3 gap-0 mt-1">
                                    <div class="col-span-2 w-40"></div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <h3 class="font-semibold text-xl whitespace-nowrap flex justify-end">Shipping Cost</h3>
                                        <h3 class="font-semibold text-xl whitespace-normal flex justify-end">  {`Rp ${Number(shipping_cost).toLocaleString('id-ID')}`}</h3>					
                                    </div>
                                </div>
                                <div class="grid grid-cols-3 gap-0 mt-1">
                                    <div class="col-span-2 w-40"></div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <h3 class="font-semibold text-xl whitespace-nowrap flex justify-end">Total</h3>
                                        <h3 class="font-semibold text-2xl text-red-500 whitespace-normal flex justify-end">  {`Rp ${Number(subtotal + shipping_cost).toLocaleString('id-ID')}`}</h3>					
                                    </div>
                                </div>
                                <div class="flex justify-end gap-2">

                                   <button
                                        data-bs-toggle="modal"
                                        data-bs-target="#transferPayment"
                                        id="handleTransfer"
                                        class="w-28 rounded-md bg-red-500 text-white font-semibold text-sm h-9 mt-3 mb-3"
                                    >
                                        Upload Bukti
                                    </button>
                                     
                                </div>
                            </div>
                    {:else}
                        <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
                            <div class="flex justify-center items-center">
                                <img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
                            </div>
                            <div class="flex justify-center items-center">
                                <h4 class=" text-center text-base  font-semibold uppercase text-gray-800">Data is Empty</h4>
                            </div>
                            <div class="flex justify-center items-center mb-3">
                                <p class="text-gray-600 text-sm">Please order the product</p>
                            </div>  
                        </div>          
                    {/if}
                   

                    <!-- <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table class="w-full text-base text-left text-gray-600 ">
                            <thead class="text-sm text-gray-800 uppercase font-semibold bg-gray-100 ">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        No Order
                                    </th>
                                    <th scope="col" class="px-3 py-3">
                                        <span class="sr-only">Image</span>
                                    </th>
                                    <th scope="col" class="px-6 py-3 w-36">
                                        Product
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Qty
                                    </th>
                                    <th scope="col" class="px-6 py-3 w-32">
                                        Price
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Shipping Cost
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Payment Method
                                    </th>
                                  
                                    <th scope="col" class="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {#if tab.content.length > 0}
                                {#each tab.content as item}
                                    <tr class="bg-white border-b cursor-pointer" on:click={() => handleRowClick(item)} >
                                        <td class="px-6 py-4">
                                            {item.no_order}
                                        </td>
                                        <td class="w-44 p-4">
                                            {@html item.image}
                                        </td>
                                        <td class="px-6 py-4 font-semibold text-gray-900 ">
                                            {item.name_product}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.qty}x
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.price}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.shipping_cost}
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="">
                                                 {item.payment}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            {#if item.payment === 'Transfer Bank'}
                                                <div class="">
                                                    {@html item.action}
                                                </div>
                                                
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            {:else}
                                <tr>
                                    <td colspan="12">
                                        <div class="flex justify-center items-center">
                                            <img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
                                        </div>
                                        <div class="flex justify-center items-center">
                                            <h4 class=" text-center text-base  font-semibold uppercase text-gray-800">Data is Empty</h4>
                                        </div>
                                        <div class="flex justify-center items-center mb-3">
                                            <p class="text-gray-600 text-sm">Please order the product</p>
                                        </div>
                                        
                                    </td>
                                </tr>
                            {/if}
                            </tbody>
                        </table>
                    </div> -->
				</div>
			{/each}
		</div>
    <div
        class="modal fade"
        id="transferPayment"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-body">
                   <div class="container">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file</label>
                        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 " type="file">
                   </div>
                    <div class="flex justify-center">
                        <button on:click={() => reloadPage()}
                            data-bs-dismiss="modal"
                            class=" w-72 rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3 "
                            >OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
   
</div>