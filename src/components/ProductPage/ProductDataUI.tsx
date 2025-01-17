import React, { useEffect } from 'react'
import { Container, InputProps } from 'react-neu'
import { useHistory } from 'react-router-dom'
import Page from 'components/Page'
import {
  ProductPageHeader,
  ProductPageContent,
  TokenStats,
  PriceChanges,
  WalletBalance,
  IndexComponentsTable,
} from 'components/ProductPage'
import { BuySellWrapper } from 'components/BuySell'
import MarketData from 'components/MarketData'

import useLocalStorage from 'hooks/useLocalStorage'
import {
  DefiPulseIndex,
  IndexToken,
  ProductToken,
} from 'constants/productTokens'
import BigNumber from 'utils/bignumber'
import { SetComponent } from 'contexts/SetComponents/SetComponent'

export interface TokenDataProps {
  prices: number[][] | undefined
  hourlyPrices: number[][] | undefined
  latestPrice: number | undefined
  latestMarketCap: number | undefined
  latestVolume: number | undefined
  token: ProductToken
  components: SetComponent[] | undefined
  balance: BigNumber | undefined
  supplyCap?: BigNumber | undefined
  currentSupply?: BigNumber | undefined
}

interface ProductDataUIProps extends InputProps {
  tokenDataProps: TokenDataProps
}

const ProductDataUI: React.FC<ProductDataUIProps> = ({
  tokenDataProps,
  children,
}) => {
  const tokenData = tokenDataProps

  const [, setReferral] = useLocalStorage('referral', '')

  const history = useHistory()
  const params = new URLSearchParams(history.location.search)
  const value = params.get('referral')
  useEffect(() => {
    if (value) setReferral(value)
  }, [value, setReferral])

  const netAssetValueReducer = (
    netAssetValue: number,
    component: SetComponent
  ): number => {
    return netAssetValue + (parseFloat(component.totalPriceUsd) || 0)
  }

  const getNetAssetValue = () => {
    return tokenData.components
      ? tokenData.components.reduce(netAssetValueReducer, 0)
      : 0
  }

  return (
    <Page>
      <Container size='lg'>
        <ProductPageHeader>
          <MarketData tokenData={tokenData} />
          <div>
            <BuySellWrapper tokenId={tokenData.token.tokensetsId} />
          </div>
        </ProductPageHeader>
        <ProductPageContent>
          {tokenData.token.symbol !== IndexToken.symbol && (
            <TokenStats
              latestVolume={tokenData.latestVolume}
              latestMarketCap={tokenData.latestMarketCap}
              fees={tokenData.token.fees}
              supplyCap={tokenData.supplyCap}
              netAssetValue={getNetAssetValue()}
              currentSupply={tokenData.currentSupply}
            />
          )}
          <WalletBalance
            token={tokenData.token}
            latestPrice={tokenData.latestPrice}
            currentBalance={tokenData.balance}
          />
          <PriceChanges
            prices={tokenData.prices}
            hourlyPrices={tokenData.hourlyPrices}
          />
          {tokenData.components && (
            <IndexComponentsTable components={tokenData.components} />
          )}
        </ProductPageContent>
      </Container>
    </Page>
  )
}

export default ProductDataUI
