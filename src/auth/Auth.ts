import React from 'react';
import { useEffect, useState } from 'react';
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import RPC from './web3RPC'; // for using web3.js

const clientId =
  'BN5nHoXm2EmFmdb_uYwjo1AUZ79RGeY2QLna291y67haycmu_fPd2aXdA4Lxe0-aTq7y_aYZqxanEctcJ-vbrFI'; // get from https://dashboard.web3auth.io

export default class XXWeb3Auth {
  private _web3auth: Web3AuthNoModal;
  private _provider?: IProvider | null;

  constructor() {
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x1',
      rpcTarget: 'https://rpc.ankr.com/eth',
      displayName: 'Ethereum Mainnet',
      blockExplorer: 'https://etherscan.io',
      ticker: 'ETH',
      tickerName: 'Ethereum',
    };

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });

    this._web3auth = new Web3AuthNoModal({
      clientId,
      chainConfig,
      web3AuthNetwork: 'sapphire_devnet',
    });

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        uxMode: 'popup', // redirect or popup
        loginConfig: {
          jwt: {
            verifier: 'user-verifier', // name of the verifier created on Web3Auth Dashboard
            typeOfLogin: 'jwt',
            clientId: clientId,
          },
        },
      },
      privateKeyProvider,
    });
    this._web3auth.configureAdapter(openloginAdapter);
  }

  async init() {
    await this._web3auth.init();
    return this;
  }

  isLoggedIn(): boolean {
    return this._web3auth.connected;
  }

  async login() {
    if (!this._web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    console.log('web3auth login!');

    const t = await fetch('https://test-xfans-api.d.buidlerdao.xyz/api/wallet/token', {
      method: 'GET',
    });
    const token = await t.json();
    try {
      this._provider = await this._web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: token.data.token, //  1 min avaliable
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  // async getPrivateKey(): Promise<any> {
  //   try {
  //     const privateKey = await this.provider.request({
  //       method: "eth_private_key",
  //     });

  //     return privateKey;
  //   } catch (error) {
  //     return error as string;
  //   }
  // }
}
