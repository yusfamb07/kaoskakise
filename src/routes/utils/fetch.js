export function FetchClient() {
  this.default = {};

  this.default.baseUrl = import.meta.env.VITE_API_SOCK;
  this.default.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

/**
 *
 * @param {string} url
 * @param {XMLHttpRequestBodyInit?} data
 * @param {object?} config
 * @returns {Promise<JSON>} FetchResponse
 */
FetchClient.prototype.post = async function (url, data = {}, config = {}) {
  const response = await fetch(this.default.baseUrl + url, {
    headers: {
      ...this.default.headers,
    },
    ...config,
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  const result = {
    meta: response,
    ...(await response.json()),
  };

  if (!response.ok) throw result;

  return result;
};

/**
 *
 * @param {string} url
 * @param {object?} config
 * @returns {Promise<JSON>} FetchResponse
 */
FetchClient.prototype.get = async function (url, config = {}) {
  const response = await fetch(this.default.baseUrl + url, {
    headers: {
      ...this.default.headers,
    },
    ...config,
    method: "GET",
  });

  const result = {
    meta: response,
    ...(await response.json()),
  };

  if (!response.ok) throw result;

  return result;
};

/**
 *
 * @param {string} url
 * @param {XMLHttpRequestBodyInit?} data
 * @param {object?} config
 * @returns {Promise<JSON>} FetchResponse
 */
FetchClient.prototype.patch = async function (url, data = {}, config = {}) {
  const response = await fetch(this.default.baseUrl + url, {
    headers: {
      ...this.default.headers,
    },
    ...config,
    method: "PATCH",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  const result = {
    meta: response,
    ...(await response.json()),
  };

  if (!response.ok) throw result;

  return result;
};

/**
 *
 * @param {string} url
 * @param {object?} config
 * @returns {Promise<JSON>} FetchResponse
 */
FetchClient.prototype.delete = async function (url, config = {}) {
  const response = await fetch(this.default.baseUrl + url, {
    headers: {
      ...this.default.headers,
    },
    ...config,
    method: "DELETE",
  });

  const result = {
    meta: response,
    ...(await response.json()),
  };

  if (!response.ok) throw result;

  return result;
};
