import { AdminInput } from 'components/atoms/input/AdminInput'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { Card, Form } from 'antd'
import { Layout } from 'models/common'
import { useTranslation } from 'react-i18next'

const SettingContentContainer = styled.div`
  padding: 40px 0 40px 120px;
  width: calc(100% - 350px);
`

const HeadTitle = styled.h1`
  margin-bottom: 20px;
  font-size: 48px;
`

const InputTitle = styled.h3`
  font-size: 24px;
`

const InputDesc = styled.p`
  font-size: 14px;
  margin: 5px 0 15px 0;
`

const InputGroup = styled(Card)`
  margin-bottom: 30px;
`

type iSettingContent = {
  layoutSettings: Layout
  updateLayout: (data: any) => void
  uploadImage: (image: any) => Promise<string>
}

export const SettingContent: React.FC<iSettingContent> = ({
  layoutSettings,
  updateLayout,
  uploadImage
}) => {
  const { t: rawT } = useTranslation('admin')
  const [image, setImage] = React.useState<any>(null)

  const t = React.useCallback(
    (str: string) => rawT(`SettingPage.${str}`),
    [rawT]
  )

  const handleChangeFile = React.useCallback(
    e => {
      setImage(e?.target?.files[0])
    },
    []
  )

  const handleSubmit = React.useCallback(
    async (values: any) => {
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
        const url = await uploadImage(image)
        data.idle.backgroundUrl = url
        setImage(null)
      }

      await updateLayout(data)
    },
    [image]
  )

  return (
    <SettingContentContainer>
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
        <HeadTitle>{t('Layout')}</HeadTitle>
        <InputGroup>
          <HeadTitle>{t('General')}</HeadTitle>
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
        </InputGroup>

        <InputGroup>
          <HeadTitle>{t('Idle Page')}</HeadTitle>
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
        </InputGroup>

        <InputGroup>
          <HeadTitle>{t('Catalog Page')}</HeadTitle>

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
        </InputGroup>

        <InputGroup>
          <HeadTitle>{t('Confirmed Order Page')}</HeadTitle>
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
        </InputGroup>

        <InputGroup>
          <HeadTitle>{t('Picking Page')}</HeadTitle>
          <InputTitle>{t('Picking Method Text')}</InputTitle>
          <InputDesc>{t('Text about what customer should do next after ordering')}</InputDesc>
          <Form.Item
            name="pickingDesc"
          >
            <AdminInput
              placeholder={t('Text about what customer should do next after ordering')}
            />
          </Form.Item>
        </InputGroup>

        <ButtonPrimary type="submit">{t('Change Settings')}</ButtonPrimary>
      </Form>
    </SettingContentContainer>
  )
}
