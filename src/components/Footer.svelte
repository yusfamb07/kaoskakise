<script>
	import {
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterBrand,
		FooterLink
	} from 'flowbite-svelte';
</script>

<div class="container" />
<Footer footerType="logo" class="bg-gray-200 mt-5">
	<div class="container">
		<div class="about">
			<div class="row">
				<div class="col-md-6 mb-5">
					<h1 class="text-3xl font-nats font-black leading-6 text-start">ABOUT ME</h1>
					<p class="leading-8 font-nats font-extralight text-start mt-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
						dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
						Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
						mollit anim id est laborum.
					</p>
				</div>
				<div class="col-md-6" />
			</div>
		</div>
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterBrand href="https://sockenee.com" src="/logo3.png" alt="Sockenergy Logo" />
			<FooterLinkGroup
				ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400"
			>
				<FooterLink href="/">About</FooterLink>
				<FooterLink href="/">Privacy Policy</FooterLink>
				<!-- <FooterLink href="/">Licensing</FooterLink>
				<FooterLink href="/">Contact</FooterLink> -->
			</FooterLinkGroup>
		</div>
	</div>
	<FooterCopyright href="/" by="Sockenergy" />
</Footer>
