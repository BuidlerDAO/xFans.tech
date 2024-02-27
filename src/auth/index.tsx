import React from 'react';
import { useEffect, useState } from 'react';
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import RPC from './web3RPC'; // for using web3.js

import './App.css';

const clientId =
  'BN5nHoXm2EmFmdb_uYwjo1AUZ79RGeY2QLna291y67haycmu_fPd2aXdA4Lxe0-aTq7y_aYZqxanEctcJ-vbrFI'; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [isFullPage, setIsFullPage] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
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

        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: 'sapphire_devnet',
        });

        setWeb3auth(web3auth);

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
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    if (window.innerWidth > 400) setIsFullPage(true);
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }

    const t = await fetch('https://test-xfans-api.d.buidlerdao.xyz/api/wallet/token', {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjc3MDg1OTgyMzUsIm9yaWdfaWF0IjoxNzA4NTk4Mjk1LCJzdWIiOjN9.nXmTIcTMsgev_8xUWRX6M2AkMsDgDBDvO-WLBUkmSTg',
      },
    });
    const token = await t.json();
    console.log('token');
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          id_token: token.data.token, //  1 min avaliable
          verifierIdField: 'sub', // sub, email, or custom
        },
      });
      setProvider(web3authProvider);
      console.log(web3authProvider);
      console.log(web3auth.provider);
      setLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  // const getPrivateKey = async () => {
  // 	if (!provider) {
  // 		uiConsole('provider not initialized yet');
  // 		return;
  // 	}
  // 	const rpc = new RPC(provider);
  // 	const privateKey = await rpc.getPrivateKey();
  // 	uiConsole(privateKey);
  // };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        {/* <div>
					<button onClick={getPrivateKey} className='card'>
						Get Private Key
					</button>
				</div> */}
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}>Login Successful</p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      {!isFullPage ? (
        <button onClick={() => chrome.tabs.create({ url: 'index.html' })} className="card login">
          Login
        </button>
      ) : (
        <button onClick={login} className="card login">
          Login
        </button>
      )}
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{' '}
        </a>
        Chrome Extension
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/chrome-extension-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
