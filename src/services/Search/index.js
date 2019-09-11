export default class SearchService {
  constructor() {
    this.domain = process.env.API_DOMAIN || 'http://localhost:7777';
  }

  fetch(endpoint, options = {}) {
    const headers = {
      'Access-Control-Allow-Origin': this.domain,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return fetch(`${this.domain}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })
      .then(this._checkStatus)
      .then(response => response.json())
      .catch(err => err);
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  init() {
    // Requires AUTH(if it was built out...)
    return this.fetch('/api/search/init')
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => Promise.reject(err));
  }

  list({ table, columns, selectedColumn, queryValue, offset, limit }) {
    return this.fetch(
      `/api/search/list?table=${table}&selectedColumn=${selectedColumn}&queryValue=${queryValue}&offset=${offset}&limit=${limit}`,
      {
        method: 'POST',
        body: JSON.stringify({
          columns,
        }),
      },
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => Promise.reject(err));
  }

  fetchRecord({ id, table, requestedFeatures }) {
    return this.fetch(`/api/search/fetch?id=${id}&table=${table}`, {
      method: 'POST',
      body: JSON.stringify({
        requestedFeatures,
      }),
    })
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => Promise.reject(err));
  }
  update({ id, table, updatedValues, updatedColumns }) {
    return this.fetch(`/api/search/update?id=${id}&table=${table}`, {
      method: 'POST',
      body: JSON.stringify({
        updatedColumns,
        updatedValues,
      }),
    })
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => Promise.reject(err));
  }
}
