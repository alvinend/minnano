import { color } from 'components/atoms/color'
import { AdminInput } from 'components/atoms/input/AdminInput'
import { Input } from 'components/atoms/Input'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'

const AdminSettingPageContainer = styled.div`
  padding: 40px 0 40px 120px;
  background-color: #202124;
  width: 100%;
  color: ${color.white};
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

const InputGroup = styled.div`
  margin-bottom: 30px;
`

export const AdminSettingPage = () => {
  return (
    <AdminSettingPageContainer>
      <HeadTitle>設定</HeadTitle>
      <InputGroup>
        <InputTitle>店舗名</InputTitle>
        <InputDesc>メニュー波面に表示されます</InputDesc>
        <AdminInput
          placeholder="店舗名"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>受け取り説明</InputTitle>
        <InputDesc>番号入力画面に表示されます</InputDesc>
        <AdminInput
          placeholder="受け取り説明"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>確認依頼文言</InputTitle>
        <InputDesc>購入確定前の確定文言</InputDesc>
        <AdminInput
          placeholder="確認依頼文言"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>最終画面の受け取り</InputTitle>
        <InputDesc>注文後の受け取り方法説明文</InputDesc>
        <AdminInput
          placeholder="最終画面の受け取り"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>最終画面挨拶</InputTitle>
        <InputDesc>「ありがとうございます」などの挨拶</InputDesc>
        <AdminInput
          placeholder="最終画面挨拶"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>注文確定ボタン</InputTitle>
        <InputDesc>注文確定文言</InputDesc>
        <AdminInput
          placeholder="注文確定ボタン"
        />
      </InputGroup>

      <InputGroup>
        <InputTitle>戻るボタン</InputTitle>
        <InputDesc>最終画面からメニュー画面に戻るボタンの文言</InputDesc>
        <AdminInput
          placeholder="戻るボタン"
        />
      </InputGroup>

      <ButtonPrimary>設定変更</ButtonPrimary>
    </AdminSettingPageContainer>
  )
}
