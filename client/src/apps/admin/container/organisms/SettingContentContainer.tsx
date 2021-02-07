import axios from 'axios'
import * as React from 'react'
import { SettingContent } from 'apps/admin/components/organisms/SettingContent'
import { Layout } from 'models/common'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { notifyAxiosError, notifySuccess } from 'models/notification'

export const SidebarContainer: React.FC = () => {
  const [layoutSettings, setLayoutSettings] = React.useState<Layout>({} as Layout)
  const [isFetched, setIsFetched] = React.useState(false)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`SettingPage.${str}`),
    [rawT]
  )

  React.useEffect(
    () => {
      const init = async () => {
        const res = await axios.get('/api/admin/layout')
        setLayoutSettings(res.data)
        setIsFetched(true)
      }

      init()
    },
    []
  )

  const updateLayout = React.useCallback(
    async (data: any) => {
      try {
        const res = await axios.put('/api/admin/layout', data)
        setLayoutSettings(res.data)
        notifySuccess('設定の更新が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
  )

  const uploadImage = React.useCallback(
    async (image: any) => {
      try {
        const formData = new FormData()
        formData.append('file', image)
        const res = await axios.post(`/api/aws/image`, formData)
        return res.data.url as string
      } catch (e) {
        notifySuccess(e)
        return ''
      }
    },
    []
  )

  return isFetched ? <SettingContent
    layoutSettings={layoutSettings}
    updateLayout={updateLayout}
    uploadImage={uploadImage}
  /> : <Spin tip={t('Loading')} />
}
