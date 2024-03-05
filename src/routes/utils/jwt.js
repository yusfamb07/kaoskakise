// utils/auth.js

export const decodeJwt = (token) => {
	try {
		if (!token) {
			throw new Error('Token is empty or undefined');
		}

		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Error decoding token:', error);
		return null;
	}
};
