import { useContext, useState } from 'react';
import { classNameGenerator, sanitizeNumberInput } from 'utils/pureFunctions';
import { SearchableTokenList } from 'components/searchableTokenList/SearchableTokenList';
import { getTokenLogoURI, TokenListItem } from 'services/observables/tokens';
import { ReactComponent as IconChevronDown } from 'assets/icons/chevronDown.svg';
import 'components/tokenInputField/TokenInputField.css';
import 'components/inputField/InputField.css';
import { Toggle } from 'elements/swapWidget/SwapWidget';
import { prettifyNumber } from 'utils/helperFunctions';
import BigNumber from 'bignumber.js';
import { Image } from 'components/image/Image';

interface TokenInputFieldProps {
  label: string;
  border?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  input: string;
  setInput?: Function;
  amountUsd: string;
  setAmountUsd: Function;
  onChange?: Function;
  token: TokenListItem | null;
  setToken: Function;
  debounce?: Function;
  startEmpty?: boolean;
  excludedTokens?: string[];
  errorMsg?: string;
  usdSlippage?: number;
  dataCy?: string;
}

export const TokenInputField = ({
  dataCy,
  label,
  border,
  selectable,
  token,
  setToken,
  input,
  setInput,
  amountUsd,
  setAmountUsd,
  onChange,
  disabled,
  debounce,
  startEmpty,
  excludedTokens = [],
  errorMsg,
  usdSlippage,
}: TokenInputFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSelectToken, setSelectToken] = useState(!!startEmpty);

  const balance = token ? token.balance : null;
  const balanceUsd =
    token && balance
      ? new BigNumber(balance).times(token.usdPrice ?? 0).toString()
      : null;

  const toggle = useContext(Toggle);

  const onInputChange = (text: string) => {
    text = sanitizeNumberInput(text);
    if (toggle) {
      const tokenAmount = sanitizeNumberInput(
        new BigNumber(text).div(token?.usdPrice!).toString(),
        token?.decimals
      );
      setAmountUsd(text !== 'NaN' ? text : '');
      if (onChange) onChange(tokenAmount);
      else {
        if (setInput) setInput(tokenAmount);
        if (debounce) debounce(tokenAmount);
      }
    } else {
      const usdAmount = new BigNumber(text).times(token?.usdPrice!).toString();
      setAmountUsd(usdAmount !== '0' && usdAmount !== 'NaN' ? usdAmount : '');
      const val = sanitizeNumberInput(text, token?.decimals);
      if (onChange) onChange(val);
      else {
        if (setInput) setInput(val);
        if (debounce) debounce(val);
      }
    }
  };

  const inputValue = () => {
    if (!toggle && !disabled) return input;
    if (!toggle && disabled) return `${sanitizeNumberInput(input, 6)}`;
    if (!amountUsd) return '';
    return `~$${sanitizeNumberInput(amountUsd, 6)}`;
  };

  const convertedAmount = () => {
    const prefix = toggle ? '' : '~';
    const tokenAmount = prettifyNumber(input);
    const usdAmount = prettifyNumber(amountUsd, true);
    const amount = toggle ? tokenAmount : usdAmount;

    if ((input || amountUsd) && token) return `${prefix}${amount}`;
    else return `${prefix}0`;
  };

  const setMaxAmount = () => {
    balance && balanceUsd && onInputChange(toggle ? balanceUsd : balance);
  };

  const inputFieldStyles = `token-input-field ${classNameGenerator({
    'border-blue-0 dark:border-blue-1': border,
    '!border-error': errorMsg,
  })}`;

  return (
    <div>
      <div className="flex justify-between pr-10 mb-4">
        <span className="font-medium">{label}</span>
        {balance && balanceUsd && token && (
          <button
            onClick={() => setMaxAmount()}
            disabled={disabled}
            className={`text-12 focus:outline-none ${classNameGenerator({
              'cursor-not-allowed': disabled,
            })}`}
          >
            Balance: {prettifyNumber(balance)}
            <span className="text-primary ml-4">
              (~{prettifyNumber(balanceUsd, true)})
            </span>
          </button>
        )}
      </div>
      {!showSelectToken || token ? (
        <div className="flex items-start">
          <div
            className={`flex items-center mt-15 min-w-[135px] ${classNameGenerator(
              {
                'cursor-pointer': selectable,
              }
            )}`}
            onClick={() => (selectable ? setIsOpen(true) : {})}
          >
            {token ? (
              <>
                <Image
                  src={getTokenLogoURI(token)}
                  alt="Token"
                  className="bg-grey-2 rounded-full h-28 w-28"
                />
                <span className="text-20 mx-10">{token.symbol}</span>
              </>
            ) : (
              <>
                <div className="bg-grey-2 rounded-full h-28 w-28 animate-pulse"></div>
                <div className="mx-10 h-16 w-50 bg-grey-2 animate-pulse rounded-full"></div>
              </>
            )}

            {selectable && (
              <div>
                <IconChevronDown className="w-[10px] h-[6px] mr-10 text-grey-4 dark:text-grey-3" />
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="relative w-full">
              <div className="absolute text-12 bottom-0 right-0 mr-[22px] mb-10">
                {convertedAmount()} {toggle && token?.symbol}
                {usdSlippage && (
                  <span className="text-grey-3 ml-4">({usdSlippage}%)</span>
                )}
              </div>
              <input
                data-cy={dataCy}
                type="text"
                value={inputValue()}
                disabled={disabled}
                placeholder={toggle ? '~$0.00' : '0.00'}
                className={inputFieldStyles}
                onChange={(event) => onInputChange(event.target.value)}
              />
            </div>
            {errorMsg && (
              <div className="text-error text-12 px-10 pt-5">{errorMsg}</div>
            )}
          </div>
        </div>
      ) : (
        <button
          data-cy="selectTokenButton"
          onClick={() => (selectable ? setIsOpen(true) : {})}
          className="flex items-center text-primary uppercase font-semibold text-20 mt-10 mb-30 py-5"
        >
          Select a Token
          <IconChevronDown className="w-[10px] h-[6px] ml-10" />
        </button>
      )}

      <SearchableTokenList
        onClick={(token: TokenListItem) => {
          setToken(token);
          setSelectToken(false);
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        excludedTokens={excludedTokens}
      />
    </div>
  );
};
