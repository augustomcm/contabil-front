import { SessionStorage } from 'quasar'

const TokenKey = 'eyJ1c2VySWQiOiJNalE9IiwibmFtZSI6IlNtRmpmR0JnSUM5Q1ljT293Nm5Eb01PeXc3bDFJbUZsY2c9PSJ9'

export function getToken () {
  return SessionStorage.getItem(TokenKey)
}

export function setToken (token) {
  return SessionStorage.set(TokenKey, `${token}`)
}

export function removeToken () {
  return SessionStorage.remove(TokenKey)
}
