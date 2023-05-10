
export function filter (obj) {
  Object.keys(obj).forEach(key => {
    obj[key] !== '' || delete obj[key]
  })
  return obj
}