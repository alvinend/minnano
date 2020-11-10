import { color } from 'components/atoms/color'
import { AdminInput } from 'components/atoms/input/AdminInput'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { Card, Form, Spin } from 'antd'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'

const AdminSettingPageContainer = styled.div`
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

export const AdminSettingPage = () => {
  const [isFetched, setIsFetched] = React.useState(false)
  const [layoutSettings, setLayoutSettings] = React.useState<any>(null)

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

  const handleSubmit = React.useCallback(
    async (values: any) => {
      try {
        const data = {
          confirmation: {
            desc: values?.confirmationDesc,
            button: values?.confirmationButton
          },
          picking: {
            desc: values?.pickingDesc
          },
          final: {
            main: values?.finalMain,
            desc: values?.finalDesc,
            button: values?.finalButton
          },
          storename: values?.storename
        }

        const res = await axios.put('/api/admin/layout', data)
        setLayoutSettings(res.data)
        notifySuccess('設定の更新が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
  )

  return isFetched ? (
    <AdminSettingPageContainer>
      <Form
        initialValues={{
          storename: layoutSettings?.storename,
          confirmationDesc: layoutSettings?.confirmation?.desc,
          confirmationButton: layoutSettings?.confirmation?.button,
          pickingDesc: layoutSettings?.picking?.desc,
          finalMain: layoutSettings?.final?.main,
          finalDesc: layoutSettings?.final?.desc,
          finalButton: layoutSettings?.final?.button
        }}
        onFinish={handleSubmit}
      >
        <HeadTitle>設定</HeadTitle>
        <InputGroup>
          <InputTitle>店舗名</InputTitle>
          <InputDesc>メニュー波面に表示されます</InputDesc>
          <Form.Item
            name="storename"
          >
            <AdminInput
              placeholder="店舗名"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>受け取り説明</InputTitle>
          <InputDesc>番号入力画面に表示されます</InputDesc>
          <Form.Item
            name="pickingDesc"
          >
            <AdminInput
              placeholder="受け取り説明"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>確認依頼文言</InputTitle>
          <InputDesc>購入確定前の確定文言</InputDesc>
          <Form.Item
            name="confirmationDesc"
          >
            <AdminInput
              placeholder="確認依頼文言"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>最終画面の受け取り</InputTitle>
          <InputDesc>注文後の受け取り方法説明文</InputDesc>
          <Form.Item
            name="finalDesc"
          >
            <AdminInput
              placeholder="最終画面の受け取り"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>最終画面挨拶</InputTitle>
          <InputDesc>「ありがとうございます」などの挨拶</InputDesc>
          <Form.Item
            name="finalMain"
          >
            <AdminInput
              placeholder="最終画面挨拶"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>注文確定ボタン</InputTitle>
          <InputDesc>注文確定文言</InputDesc>
          <Form.Item
            name="confirmationButton"
          >
            <AdminInput
              placeholder="注文確定ボタン"
            />
          </Form.Item>
        </InputGroup>

        <InputGroup>
          <InputTitle>戻るボタン</InputTitle>
          <InputDesc>最終画面からメニュー画面に戻るボタンの文言</InputDesc>
          <Form.Item
            name="finalButton"
          >
            <AdminInput
              placeholder="戻るボタン"
            />
          </Form.Item>
        </InputGroup>

        <ButtonPrimary type="submit">設定変更</ButtonPrimary>
      </Form>
    </AdminSettingPageContainer>
  ) : <Spin tip="処理中" />
}
