export function calcTime(second) {
  let m = Math.floor(second / 60)
  let s = Math.floor(second % 60)
  return cover(m) + ':' + cover(s)

  function cover(v) {
    return String(v).length === 1 ? '0' + v : String(v)
  }
}
