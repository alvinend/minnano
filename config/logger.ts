import chalk from 'chalk'

const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9 //  convert to nanoseconds
  const NS_TO_MS = 1e6 // convert to milliseconds
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

// Logger Middleware Function
export const logger = (
  req: any,
  res: any,
  next: any
) => { 
  const current_datetime = new Date()
  const formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds()
  const method = req.method
  const url = req.url
  const status = String(res.statusCode)[0] === '2' ? chalk.green(res.statusCode) : chalk.red(res.statusCode)
  const start = process.hrtime()
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)

  const log = `[${chalk.magenta(formatted_date)}] ${method}:${url} ${status} ${chalk.yellow(durationInMilliseconds.toLocaleString() + "ms")}`

  console.log(log)
  next()
}
