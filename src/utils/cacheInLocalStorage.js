const PREFFIX = 'Centific'

const cacheInLocalStorage = {
  set(key, value) {
    localStorage.setItem(`${PREFFIX}-${key}`, JSON.stringify(value))
  },
  get(key, defaultValue) {
    const item = localStorage.getItem(`${PREFFIX}-${key}`) || defaultValue
    let data
    try {
      data = JSON.parse(item)
    } catch (error) {
      data = defaultValue
    }
    return data
  },
  remove(key) {
    localStorage.removeItem(`${PREFFIX}-${key}`)
  }
}

export default cacheInLocalStorage
