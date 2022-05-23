import { getToken } from 'boot/auth'

export default function () {
  return {
    token: getToken()
  }
}
