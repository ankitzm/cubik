'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  BaseSignerWalletAdapter,
  WalletAdapterNetwork,
  WalletName,
} from '@/utils/wallet';
import * as AllWalletAdapters from '@solana/wallet-adapter-wallets';

import {
  HARDCODED_WALLET_STANDARDS,
  WalletAdapterWithMutableSupportedTransactionVersions,
} from '@cubik/wallet-connect';

const UnifiedWalletProvider = dynamic(
  () => import('@cubik/wallet-connect').then((e) => e.UnifiedWalletProvider),
  {
    ssr: false,
  },
);

export const MWA_NOT_FOUND_ERROR = 'MWA_NOT_FOUND_ERROR';

export const metadata = {
  name: 'UnifiedWallet',
  description: 'UnifiedWallet',
  url: 'https://jup.ag',
  iconUrls: ['https://jup.ag/favicon.ico'],
  additionalInfo: '',
  walletConnectProjectId: '4a4e231c4004ef7b77076a87094fba61',
};

export const WalletProvider = ({ children }: { children: any }) => {
  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const {
      UnsafeBurnerWalletAdapter: _,
      WalletConnectWalletAdapter,
      ...allwalletAdapters
    } = AllWalletAdapters;

    const walletAdapters = Object.keys(allwalletAdapters)
      .filter((key) => key.includes('Adapter'))
      .map((key) => (allwalletAdapters as any)[key])
      .map((WalletAdapter: any) => new WalletAdapter()); // Intentional any, TS were being annoying

    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null =
      (() => {
        const adapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> =
          new WalletConnectWalletAdapter({
            network: WalletAdapterNetwork.Mainnet,
            options: {
              relayUrl: 'wss://relay.walletconnect.com',
              projectId: metadata.walletConnectProjectId,
              metadata: {
                name: metadata.name,
                description: metadata.description,
                url: metadata.url,
                icons: metadata.iconUrls,
              },
            },
          });

        return adapter;
      })();

    return [...walletAdapters, walletConnectWalletAdapter].filter(
      (item) => item && item.name && item.icon,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const params: any = useMemo(
    () => ({
      wallets: wallets,
      config: {
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: undefined,
        walletPrecedence: [
          'OKX Wallet' as WalletName,
          'WalletConnect' as WalletName,
        ],
        hardcodedWallets: HARDCODED_WALLET_STANDARDS,
        walletlistExplanation: {
          href: '',
        },
      },
    }),
    [wallets],
  );

  return <UnifiedWalletProvider {...params}>{children}</UnifiedWalletProvider>;
};
