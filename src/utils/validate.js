/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} mobile
 * @returns {Boolean}
 */
export function isMobile(mobile) {
  return /^1[0-9]{10}$/.test(mobile)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    email
  )
}

/**
 * 校验密码 只能包含数字、字母、下划线
 * @param {string} password
 * @returns {Boolean}
 */
export function validPassword(password) {
  return /^[a-zA-Z0-9_]*$/.test(password)
}
