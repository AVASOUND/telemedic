'use client'

import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { Chain ,goerli,filecoinHyperspace} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider ,GetSiweMessageOptions} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import {
  getDefaultWallets,
  RainbowKitProvider,darkTheme 
} from '@rainbow-me/rainbowkit';

const inter = Inter({ subsets: ["latin"] });

/*export const metadata = {
  title: "Telemedic App",
  description: "Created by Replicator Labs",
};
*/
// Configure chains & providers
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const fileCoinTestnet :Chain = {
  id:314159,
  name:"Filecoin  - testnet",
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin Testnet',
    symbol: 'tFil',
  },
  rpcUrls: {
    default: {
      http: ['https://filecoin-calibration.chainup.net/rpc/v1']
    },
    public: {
      http: ['https://filecoin-calibration.chainup.net/rpc/v1']
    },
  },
  blockExplorers: {
    default: { name: 'filscan', url: 'https://calibration.filscan.io' },
  },
  testnet: true,
};
const { chains, provider } = configureChains(
  [fileCoinTestnet,goerli],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'Telemedic App',
  chains
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Telemedic App',
});

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
  
})




export default function RootLayout({
  children,...props
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
      <WagmiConfig client={client}>
        <SessionProvider refetchInterval={0} >
  
    <RainbowKitSiweNextAuthProvider
  getSiweMessageOptions={getSiweMessageOptions}
>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
        </RainbowKitProvider></RainbowKitSiweNextAuthProvider>
  </SessionProvider></WagmiConfig>
        </body>
    </html>
  );
}
