import { logSuccessGroup, logErrorGroup } from './logger'

const BASE_URL = import.meta.env.VITE_API_PATH || '/'

const DEFAULT_REQUEST_CONFIG = {
  headers: {
    Accept: 'application/json',
  },
}

const AUTH_ERROR_CODES = [401, 403, 407]
const VALIDATION_ERROR_CODES = [409, 422]
const GENERIC_NETWORK_ERROR = 'Something went wrong'
const GENERIC_VALIDATION_ERROR = 'Unable to Proceed'

export const getEndpointUrl = endpoint => {
  console.assert(!!BASE_URL, 'BASE_URL is ' + BASE_URL)
  return BASE_URL + endpoint
}

export const get = async (endpoint, params = {}, config = {}) => {
  const url = getEndpointUrl(endpoint) + toSearchParamsString(params)
  const fetchConfig = mergeRequestConfigs(DEFAULT_REQUEST_CONFIG, config, { method: 'get' })
  try {
    const result = await doFetch(url, fetchConfig)
    logSuccessGroup(endpoint, {
      ...fetchConfig,
      GET: url,
      'Request Params': params,
      'Response JSON': result.body,
    })
    return result.body
  } catch (errorObject) {
    const { error, errors, body } = errorObject
    logErrorGroup(endpoint, {
      ...fetchConfig,
      GET: url,
      'Error Message': error,
      'Validation Errors': errors,
      'Response Body': body,
    })
    return Promise.reject(errorObject)
  }
}

export const remove = async (endpoint, id, config = {}) => {
  const url = [getEndpointUrl(endpoint), id].join('/')
  const fetchConfig = mergeRequestConfigs(DEFAULT_REQUEST_CONFIG, config, { method: 'delete' })
  try {
    const result = await doFetch(url, fetchConfig)
    logSuccessGroup(endpoint, {
      ...fetchConfig,
      DELETE: url,
      ID: id,
      'Response JSON': result.body,
    })
    return result.body
  } catch (errorObject) {
    const { error, errors, body } = errorObject
    logErrorGroup(endpoint, {
      ...fetchConfig,
      DELETE: url,
      ID: id,
      'Error Message': error,
      'Validation Errors': errors,
      'Response Body': body,
    })
    return Promise.reject(errorObject)
  }
}

export const post = async (endpoint, data = {}, config = { headers: {} }) => {
  const url = getEndpointUrl(endpoint)
  const body = JSON.stringify(data)
  const fetchConfig = mergeRequestConfigs(
    DEFAULT_REQUEST_CONFIG,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    },
    config,
    {
      body,
    },
  )
  try {
    const result = await doFetch(url, fetchConfig)
    logSuccessGroup(endpoint, {
      ...fetchConfig,
      POST: url,
      'Request Data': data,
      'Response Body': result.body,
    })
    return result.body
  } catch (errorObject) {
    const { error, errors, body } = errorObject
    logErrorGroup(endpoint, {
      ...fetchConfig,
      POST: url,
      'Request Data': data,
      'Error Message': error,
      'Validation Errors': errors,
      Result: body,
    })
    throw errorObject
  }
}

export const postFormData = async (endpoint, data = {}, config = { headers: {} }) => {
  const formData = new FormData()
  Object.entries(data).forEach(([name, value]) => {
    formData.append(name, value)
  })
  const url = getEndpointUrl(endpoint)
  const fetchConfig = mergeRequestConfigs(
    DEFAULT_REQUEST_CONFIG,
    {
      method: 'post',
      cors: true,
    },
    config,
    {
      body: formData,
    },
  )
  try {
    const result = await doFetch(url, fetchConfig)
    logSuccessGroup(endpoint, {
      ...fetchConfig,
      POST: url,
      'Request Data': formData,
      'Response Body': result.body,
    })
    return result.body
  } catch (errorObject) {
    const { error, errors, body } = errorObject
    logErrorGroup(endpoint, {
      ...fetchConfig,
      POST: url,
      'Request Data': formData,
      'Error Message': error,
      'Validation Errors': errors,
      Result: body,
    })
    throw errorObject
  }
}

export const put = (endpoint, data = {}, config = { headers: {} }) =>
  post(endpoint, data, { ...config, method: 'PUT' })

export const patch = (endpoint, data = {}, config = { headers: {} }) =>
  post(endpoint, data, { ...config, method: 'PATCH' })

function toSearchParamsString(data = {}) {
  if (!Object.entries(data).length) {
    return ''
  }
  const searchParams = new URLSearchParams()
  for (let [name, value] of Object.entries(data)) {
    searchParams.set(name, value)
  }
  const searchParamsString = searchParams.toString()
  return '?' + searchParamsString
}

async function doFetch(url, config) {
  const token = localStorage.getItem('access_token')
  if (token) {
    config = withBearerAuth(token, config)
  }

  /** @type {Response} */
  let response
  let body = {}
  try {
    response = await fetch(url, config)

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      body = await response.json()
    }

    if (!body) {
      body = {}
    }
  } catch (error) {
    return Promise.reject({
      error: (response && response.statusText) || (error && error.message) || GENERIC_NETWORK_ERROR,
      response,
      body,
    })
  }

  // ok
  if (response.ok) {
    return Promise.resolve({ response, body })
  }

  // auth
  if (AUTH_ERROR_CODES.includes(response.status)) {
    if (!config.skipAuthRedirect) {
      localStorage.removeItem('access_token')
      window.location.href = '/'
    }

    return Promise.reject({
      error: parseAuthError(body),
      response,
      body,
      unauthorized: true,
    })
  }

  // validation error
  if (VALIDATION_ERROR_CODES.includes(response.status)) {
    return Promise.reject({
      error: parseValidationError(body),
      errors: parseValidationErrors(body),
      response,
      body,
    })
  }

  // network error
  return Promise.reject({
    error:
      body?.error ||
      body?.message ||
      body?.description ||
      (response && response.statusText) ||
      GENERIC_NETWORK_ERROR,
    errors: parseValidationErrors(body),
    response,
    body,
  })
}

/**
 * @param {{title:String,source:String,detail:String}[]} errors
 * @returns {Object.<String,String>|null}
 */
function parseValidationErrors(body = {}) {
  const { errors } = body

  if (errors) {
    if (typeof errors === 'string') {
      try {
        body.errors = JSON.parse(errors)
      } catch {
        return null
      }
    }

    if (!body.errors || typeof body.errors !== 'object') {
      return null
    }

    return Object.entries(body.errors).reduce(
      (result, [name, error]) => ({
        ...result,
        [name]: arrayToString(error),
      }),
      {},
    )
  }

  if (Array.isArray(body?.detail)) {
    return body.detail.reduce((result, item) => {
      const fieldName = getDetailFieldName(item)

      if (!fieldName) {
        return result
      }

      return {
        ...result,
        [fieldName]: normalizeValidationMessage(item?.msg, fieldName),
      }
    }, {})
  }

  return null
}

function parseValidationError(body = {}) {
  if (typeof body?.message === 'string' && body.message) {
    return body.message
  }
  if (typeof body?.description === 'string' && body.description) {
    return body.description
  }
  if (body && typeof body.error === 'string') {
    return body.error
  }
  try {
    return normalizeValidationMessage(arrayToString(Object.values(parseValidationErrors(body))))
  } catch {
    return GENERIC_VALIDATION_ERROR
  }
}

function parseAuthError(body = {}) {
  return (
    body?.error ||
    body?.message ||
    body?.description ||
    GENERIC_VALIDATION_ERROR
  )
}

function getDetailFieldName(item) {
  const loc = item?.loc

  if (!Array.isArray(loc) || !loc.length) {
    return null
  }

  const filteredLoc = loc.filter(value => typeof value === 'string')

  if (!filteredLoc.length) {
    return null
  }

  const fieldName = filteredLoc[filteredLoc.length - 1]

  if (fieldName === 'body' || fieldName === 'query' || fieldName === 'path') {
    return null
  }

  return fieldName
}

function normalizeValidationMessage(message, fieldName) {
  if (!message) {
    return GENERIC_VALIDATION_ERROR
  }

  if (message === 'String should have at least 8 characters') {
    return fieldName === 'password' || fieldName === 'confirm_password'
      ? 'Пароль должен содержать минимум 8 символов'
      : 'Минимум 8 символов'
  }

  return message
}

/**
 * @param  {...RequestInit} configs
 * @returns {RequestInit}
 */
function mergeRequestConfigs(...configs) {
  return configs.reduce(
    (result, config) => ({
      ...result,
      ...config,
      headers: {
        ...(result.headers || {}),
        ...(config.headers || {}),
      },
    }),
    {},
  )
}

/**
 * @param  {RequestInit} config
 * @returns {RequestInit}
 */
export function withBearerAuth(token, config = {}) {
  return mergeRequestConfigs(config, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

function arrayToString(value) {
  return typeof value === 'string'
    ? value
    : Array.isArray(value)
    ? arrayToString(value[0])
    : undefined
}
