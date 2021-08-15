import { AdminInput } from 'components/atoms/input/AdminInput'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { Card, Form, Spin } from 'antd'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import { Layout } from 'models/common'
import { useTranslation } from 'react-i18next'
import {
  AdminContentWrapper,
  AdminSectionTitle
} from '../components/molecules'

const AdminSettingPageContainer = styled.div`
  width: 100%;

  & > form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  } 
`

const InputTitle = styled.h3`
  font-size: 24px;
`

const InputDesc = styled.p`
  font-size: 14px;
  margin: 5px 0 15px 0;
`

export const SettingPage = () => {
  const [isFetched, setIsFetched] = React.useState(false)
  const [layoutSettings, setLayoutSettings] = React.useState<Layout>({} as Layout)
  const { t: rawT } = useTranslation('admin')
  const [image, setImage] = React.useState<any>(null)

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

  const handleChangeFile = React.useCallback(
    e => {
      setImage(e?.target?.files[0])
    },
    []
  )

  const handleSubmit = React.useCallback(
    async (values: any) => {
      try {
        const data = {
          storename: values?.storename,
          currency: values?.currency,
          confirmation: {
            desc: values?.confirmationDesc,
            button: values?.confirmationButton
          },
          picking: {
            desc: values?.pickingDesc,
            tableOverlay: {
              backButton: values?.pickingTableOverlayBackButton,
              finishButton: values?.pickingTableOverlayFinishButton
            }
          },
          final: {
            main: values?.finalMain,
            desc: values?.finalDesc,
            button: values?.finalButton
          },
          idle: {
            backgroundUrl: '',
            greeting: values?.idleGreeting,
            startButton: values?.idleStartButton
          },
          waiting: {
            closing: values?.waitingClosing,
            instruction: values?.waitingInstruction
          }
        }

        if (image) {
          const formData = new FormData()
          formData.append('file', image)
          const res = await axios.post(`/api/aws/image`, formData)
          data.idle.backgroundUrl = res.data.url as string
          setImage(null)
        }

        const res = await axios.put('/api/admin/layout', data)
        setLayoutSettings(res.data)
        notifySuccess('設定の更新が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [image]
  )

  return isFetched ? (
    <AdminSettingPageContainer>
      <Form
        initialValues={{
          storename: layoutSettings?.storename,
          currency: layoutSettings?.currency,
          confirmationDesc: layoutSettings?.confirmation?.desc,
          confirmationButton: layoutSettings?.confirmation?.button,
          pickingDesc: layoutSettings?.picking?.desc,
          pickingTableOverlayBackButton: layoutSettings?.picking?.tableOverlay?.backButton,
          pickingTableOverlayFinishButton: layoutSettings?.picking?.tableOverlay?.finishButton,
          finalMain: layoutSettings?.final?.main,
          finalDesc: layoutSettings?.final?.desc,
          idleGreeting: layoutSettings?.idle?.greeting,
          idleStartButton: layoutSettings?.idle?.startButton,
          waitingClosing: layoutSettings?.waiting?.closing,
          waitingInstruction: layoutSettings?.waiting?.instruction
        }}
        onFinish={handleSubmit}
      >
        <AdminContentWrapper>
          <AdminSectionTitle>{t('General')}</AdminSectionTitle>
          <InputTitle>{t('Store Name')}</InputTitle>
          <InputDesc>{t('Your store name here')}</InputDesc>
          <Form.Item
            name="storename"
          >
            <AdminInput
              placeholder={t('Your store name here')}
            />
          </Form.Item>

          <InputTitle>{t('Currency')}</InputTitle>
          <InputDesc>{t('Currency for pricing (exp Yen, USD)')}</InputDesc>
          <Form.Item
            name="currency"
          >
            <AdminInput
              placeholder={t('Currency for pricing (exp: Yen, USD)')}
            />
          </Form.Item>
        </AdminContentWrapper>

        <AdminContentWrapper>
          <AdminSectionTitle>{t('Idle Page')}</AdminSectionTitle>
          <InputTitle>{t('Background')}</InputTitle>
          <InputDesc>{t('Will be shown on idle page')}</InputDesc>
          <Form.Item
            name="idleBackgroundUrl"
          >
            <AdminInput
              placeholder={t('Will be shown on idle page')}
              name="imagelink"
              onChange={handleChangeFile}
              type="file"
            />
          </Form.Item>

          <InputTitle>{t('Greeting')}</InputTitle>
          <InputDesc>{t('Will be shown on idle page')}</InputDesc>
          <Form.Item
            name="idleGreeting"
          >
            <AdminInput
              placeholder={t('Will be shown on idle page')}
            />
          </Form.Item>

          <InputTitle>{t('Start Button')}</InputTitle>
          <InputDesc>{t('Mark the start of ordering process')}</InputDesc>
          <Form.Item
            name="idleStartButton"
          >
            <AdminInput
              placeholder={t('Mark the start of ordering process')}
            />
          </Form.Item>
        </AdminContentWrapper>

        <AdminContentWrapper>
          <AdminSectionTitle>{t('Catalog Page')}</AdminSectionTitle>

          <InputTitle>{t('Order Overlay - Confirm Desc')}</InputTitle>
          <InputDesc>{t('Descriptive text about confirmation of purchase')}</InputDesc>
          <Form.Item
            name="confirmationDesc"
          >
            <AdminInput
              placeholder={t('Descriptive text about confirmation of purchase')}
            />
          </Form.Item>

          <InputTitle>{t('Order Overlay - Confirm Button')}</InputTitle>
          <InputDesc>{t('Confirmation of purchase button text')}</InputDesc>
          <Form.Item
            name="confirmationButton"
          >
            <AdminInput
              placeholder={t('Confirmation of purchase button text')}
            />
          </Form.Item>

          <InputTitle>{t('Table Overlay - Back Button')}</InputTitle>
          <InputDesc>{t('Button to get out from table overlay')}</InputDesc>
          <Form.Item
            name="pickingTableOverlayBackButton"
          >
            <AdminInput
              placeholder={t('Button to get out from table overlay')}
            />
          </Form.Item>

          <InputTitle>{t('Table Overlay - Finish Button')}</InputTitle>
          <InputDesc>{t('Button to finsih ordering process and enter payment process')}</InputDesc>
          <Form.Item
            name="pickingTableOverlayFinishButton"
          >
            <AdminInput
              placeholder={t('Button to finsih ordering process and enter payment process')}
            />
          </Form.Item>
        </AdminContentWrapper>

        <AdminContentWrapper>
          <AdminSectionTitle>{t('Confirmed Order Page')}</AdminSectionTitle>
          <InputTitle>{t('Descriptive Text')}</InputTitle>
          <InputDesc>{t('Text shown after orders are placed')}</InputDesc>
          <Form.Item
            name="finalDesc"
          >
            <AdminInput
              placeholder={t('Text shown after orders are placed')}
            />
          </Form.Item>

          <InputTitle>{t('Main Greeting Text')}</InputTitle>
          <InputDesc>{t('Greetings such as "Thank you"')}</InputDesc>
          <Form.Item
            name="finalMain"
          >
            <AdminInput
              placeholder={t('Greetings such as "Thank you"')}
            />
          </Form.Item>
        </AdminContentWrapper>

        <AdminContentWrapper>
          <AdminSectionTitle>{t('Picking Page')}</AdminSectionTitle>
          <InputTitle>{t('Picking Method Text')}</InputTitle>
          <InputDesc>{t('Text about what customer should do next after ordering')}</InputDesc>
          <Form.Item
            name="pickingDesc"
          >
            <AdminInput
              placeholder={t('Text about what customer should do next after ordering')}
            />
          </Form.Item>
        </AdminContentWrapper>

        <ButtonPrimary type="submit">{t('Change Settings')}</ButtonPrimary>
      </Form>
    </AdminSettingPageContainer>
  ) : <Spin tip={t('Loading')} />
}
