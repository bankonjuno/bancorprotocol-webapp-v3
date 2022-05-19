import { Page } from 'components/Page';
import { TradeWidget } from 'elements/trade/TradeWidget';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from 'store/index';
import { getV3Tokens } from 'store/bancor/token';
import { ethToken } from 'services/web3/config';
import { SwapSwitch } from 'elements/swapSwitch/SwapSwitch';

export const Trade = () => {
  const [searchParams] = useSearchParams();

  const from = searchParams.get('from') ?? ethToken;
  const to = searchParams.get('to') ?? undefined;

  const tokens = useAppSelector(getV3Tokens);

  return (
    <Page>
      <div className="flex justify-center mt-[-20px]">
        <div className="content-block p-10 rounded-40">
          <div className="flex items-center justify-between mr-10 ml-20 mt-10">
            <h2 className="text-[22px]">Trade</h2>
            <SwapSwitch />
          </div>
          <hr className="border-1 border-fog my-20 -mx-10" />
          <TradeWidget from={from} to={to} tokens={tokens} />
        </div>
      </div>
    </Page>
  );
};
