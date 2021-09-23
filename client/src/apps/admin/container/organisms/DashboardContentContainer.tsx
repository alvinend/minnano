import { DashboardContent } from 'apps/admin/components/organisms/DashboardContent'
import axios from 'axios'
import { Loading } from 'components/atoms/Loading'
import { notifyAxiosError } from 'models/notification'
import * as React from 'react'

export type ISalesData = {
  dailySales: number
  monthlySales: number
  productsSold: number
  transactionsCount: number
  sales: number[]
}

export type IStockArgs = {
  goodStockCount: number
  warningStockCount: number
  outStockCount: number
  unlimitedStockCount: number
  totalItemCount: number
}


export const DashboardContentContainer: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [salesData, setSalesData] = React.useState({
      dailySales: 0,
      monthlySales: 0,
      productsSold: 0,
      transactionsCount: 0, 
      sales: [0, 0, 0, 0, 0, 0]
    } as ISalesData)
    const [stockArgs, setStockArgs] = React.useState({
      goodStockCount: 0,
      warningStockCount: 0,
      outStockCount: 0,
      unlimitedStockCount: 0,
      totalItemCount: 0
    })

    const fetchSales = React.useCallback(
      async  () => {
        try {
          setIsLoading(true)
          const res = await axios.get('/api/admin/sales')
          setSalesData(res.data)
        } catch (e) {
          notifyAxiosError(e)
        } finally {
          setIsLoading(false)
        }
      },
      []
    )

    const fetchStockArgs = React.useCallback(
      async  () => {
        try {
          setIsLoading(true)
          const res = await axios.get('/api/admin/item/stock/args')
          console.log(res.data)
          setStockArgs(res.data)
        } catch (e) {
          notifyAxiosError(e)
        } finally {
          setIsLoading(false)
        }
      },
      []
    )

  React.useEffect(
    () => {
      fetchSales() 
      fetchStockArgs()
    },
    []
  )

  return <DashboardContent
    salesData={salesData}
    stockArgs={stockArgs}
  />
}
