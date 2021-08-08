import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { RiEditBoxLine } from 'react-icons/ri'
import { Category, Item, Subitem } from 'models/common'
import { IoIosTrash } from 'react-icons/io'
import { AlertModal } from 'components/organisms/AlertModal'
import { AdminItemModal } from 'components/organisms/AdminItemModal'
import { useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2';

const DashboardContentWrapper = styled.div`
  width: 90%;
  border: 1px solid ${color.secondary};
  padding: 40px;
  background-color: ${color.white};
  border-radius: 20px;
  margin-bottom: 40px;
`

const HeadTitle = styled.h1`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 1px solid ${color.secondary};
`

const BoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const BoxWidget  = styled.div<{ boxColor: 'yellowChart' | 'redChart' | 'blueChart' | 'greenChart'}>`
  width: 240px;
  height: 140px;
  padding: 30px;
  color: ${color.white};
  background-color: ${({ boxColor }) => color[boxColor]};
  border-radius: 10px;

  b {
    font-size: 18px;
  }
`

const BoxBorderWidget  = styled.div<{ boxColor: 'yellowChart' | 'redChart' | 'blueChart' | 'greenChart'}>`
  width: 240px;
  height: 140px;
  padding: 30px;
  color: ${({ boxColor }) => color[boxColor]};
  border: 1px solid ${({ boxColor }) => color[boxColor]};
  border-radius: 10px;

  b {
    font-size: 18px;
  }
`

const BarContainer = styled.div`
  margin-top: 50px;
`

type iDashboardContent = {
}

const data = {
  labels: ['March', 'April', 'May', 'June', 'July', 'August'],
  datasets: [
    {
      label: 'Sales',
      data: [120000000, 190000000, 30000000, 50000000, 20000000, 30000000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const DashboardContent: React.FC<iDashboardContent> = () => {
  return (
    <>
      <DashboardContentWrapper>
        <HeadTitle>
          Sales
        </HeadTitle>
        <BoxContainer>
          <BoxBorderWidget boxColor="yellowChart">
            Daily Sales <br />
            <b>20.000.000 IDR</b><br />
            <span>Per 19 August</span>
          </BoxBorderWidget>

          <BoxBorderWidget boxColor="greenChart">
            Monthly Sales <br />
            <b>130.000.000 IDR</b> <br />
            <span>Per August</span>
          </BoxBorderWidget>

          <BoxBorderWidget boxColor="blueChart">
            Products Sold <br />
            <b>232</b> <br />
            <span>Per August</span>
          </BoxBorderWidget>

          <BoxBorderWidget boxColor="redChart">
            Transactions Count <br />
            <b>150</b> <br />
            <span>Per August</span>
          </BoxBorderWidget>
        </BoxContainer>
        <BarContainer>
          <Bar data={data} />
        </BarContainer>
      </DashboardContentWrapper>

      <DashboardContentWrapper>
        <HeadTitle>
          Stock
        </HeadTitle>
        <BoxContainer>
          <BoxWidget boxColor="greenChart">
            Well Stocked <br />
            <b>200</b><br />
            <span>/ 252 Items</span>
          </BoxWidget>

          <BoxWidget boxColor="yellowChart">
            Almost Out of Stock <br />
            <b>40</b> <br />
            <span>/ 252 Items</span>
          </BoxWidget>

          <BoxWidget boxColor="redChart">
            Out of Stock<br />
            <b>12</b> <br />
            <span>/ 252 Items</span>
          </BoxWidget>

          <BoxWidget boxColor="blueChart">
            Categories Count <br />
            <b>5</b> <br />
            <span>Categories</span>
          </BoxWidget>
        </BoxContainer>
      </DashboardContentWrapper>
    </>
  )
}
