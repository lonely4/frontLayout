function append0(value) {
  if (typeof value !== 'number') return
  return value < 10 ? '0' + value : value
}

export default function getRandomId() {
  let date_ = new Date(),
    year = date_.getFullYear(),
    month = append0(date_.getMonth() + 1),
    day = append0(date_.getDate()),
    hours = append0(date_.getHours()),
    mins = append0(date_.getMinutes()),
    secs = append0(date_.getSeconds()),
    msecs = append0(date_.getMilliseconds())

  return `${year}${month}${day}${hours}${mins}${secs}${msecs}${Math.floor(
    Math.random() * 1000
  )}`
}
