import { toast } from 'react-toastify'

export const notifyAxiosError = (e: any) => {
  const error = e?.response?.data 
  const message = error?.[Object.keys(error)[0]]

  if (typeof message === "string") {
    toast.error(message)
  } else {
    toast.error('An error has occurred')
  }
}


export const notifySuccess = (msg: string) => {
  toast.success(msg)
}
