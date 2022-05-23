export function today () {
  const date = new Date()
  return date
}

export function yesterday () {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date
}

export function formatDate (date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export function formatedToday () {
  return formatDate(today())
}

export function createDateByString (str) {
  const separeted = str.split('-').map(e => parseInt(e))

  return new Date(separeted[0], separeted[1] - 1, separeted[2])
}

export function currentMonth () {
  return (new Date()).getMonth() + 1
}
