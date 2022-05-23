import { login as loginApi, logout as logoutApi } from 'src/api/user'
import { setToken, removeToken } from 'boot/auth'

export function login ({ commit }, loginData) {
  return new Promise((resolve, reject) => {
    const {
      username: email,
      password
    } = loginData
    loginApi({
      email,
      password
    }).then((response) => {
      const { token } = response.data
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export function logout ({ commit, state }) {
  return new Promise((resolve, reject) => {
    logoutApi(state.token).then(() => {
      commit('SET_TOKEN', null)
      removeToken()
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
