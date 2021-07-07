import { useEffect, useState } from 'react';
import { SUPPORTED_WALLETS, WalletInfo } from 'services/web3/wallet/utils';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Modal } from 'components/modal/Modal';
import { setAutoLogin } from 'utils/pureFunctions';
import { web3 } from 'services/web3/contracts';

interface WalletModalProps {
  isOpen: boolean;
  setIsOpen: Function;
}

export const WalletModal = ({ isOpen, setIsOpen }: WalletModalProps) => {
  const { activate, account } = useWeb3React();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);

  const tryConnecting = async (wallet: WalletInfo) => {
    setPending(true);
    setSelectedWallet(wallet);
    const { connector } = wallet;

    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    )
      connector.walletConnectProvider = undefined;

    connector &&
      activate(connector, undefined, true)
        .then(async () => {
          setIsOpen(false);
          setAutoLogin(true);
          web3.setProvider(await connector.getProvider());
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector);
            setAutoLogin(true);
          } else setError(true);
        });
  };

  useEffect(() => {
    if (account) setIsOpen(false);
  }, [account, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setError(false);
      setPending(false);
      setSelectedWallet(null);
    }
  }, [isOpen]);

  const title = error
    ? 'Wallet Error'
    : pending
    ? 'Connecting to ...'
    : 'Connect Wallet';

  return (
    <Modal title={title} setIsOpen={setIsOpen} isOpen={isOpen}>
      <div>
        {selectedWallet ? (
          <>
            <div
              className={`flex justify-center items-center mt-20 mb-40 ${
                !error && pending ? 'animate-pulse' : ''
              }`}
            >
              <img
                src={selectedWallet.icon}
                alt=""
                className="w-64 h-64 mr-30"
              />
              <h2 className="font-bold text-20">{selectedWallet.name}</h2>
            </div>
            {error && (
              <div className="bg-error text-white mb-20 p-20 rounded-30 text-center">
                <p className="font-semibold mb-5">
                  Failed to connect to wallet.
                </p>
                <p className="text-12">Please try again or contact support.</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col mb-20 mt-10 space-y-15">
            {SUPPORTED_WALLETS.map((wallet, index) => {
              return (
                <button
                  key={index}
                  onClick={() => tryConnecting(wallet)}
                  className="flex items-center w-full px-16 py-10 border-2 border-grey-2 rounded-20 hover:border-primary focus:outline-none focus:border-primary"
                >
                  <img src={wallet.icon} alt="" className="w-32 h-32 mr-20" />
                  {wallet.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
