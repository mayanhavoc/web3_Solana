import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { render } from '@testing-library/react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/MUXpDC0CpMKlqe0C4K/giphy.gif',
	'https://media.giphy.com/media/Ter8NaRzBVjGGk6MRS/giphy.gif',
	'https://media.giphy.com/media/hQd8H5OWn09DW/giphy.gif',
	'https://media.giphy.com/media/TVKQuNuPt1Zja/giphy.gif'
]

const App = () => {
  // state
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // actions:

  // check if phantom wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
  
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key: ',
            response.publicKey.toString()
          );
          // Set the user's public key in state
          setWalletAddress(response.publicKey.toString());
        } 
      } else {
        alert ('Solana object not found! Get a Phantom wallet');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Connect the wallet
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Send Gif
  const sendGif = async () => {
    if (inputValue.length > 0){
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  // Check for input
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  // Only render gifs when wallet is connected
  const renderNotConnectedContainer = () => (
    <button
      className='cta-button connect-wallet-button'
      onClick={connectWallet}
      >
        Connect to wallet
      </button> 
  );

  // Render connected wallet's gifs
  const renderConnectedContainer = () => (
    <div className="connected-container">
      {/* Input for and submit button */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
        >
          <input 
            type="text" 
            className="Enter your gif link!" 
            value={inputValue}
            onChange={onInputChange}
            />
          <button type="submit" className='cta-button submit-gif-button'>Submit</button>
        </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );


  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


  useEffect(() => {
    if (walletAddress){
      console.log('Fetching GIF list...');
      // Call Solana code
      
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);
  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container': 'container'}>
        <div className="header-container">
          <p className="header"> 🐈‍⬛ Nebelungs & Boxers 🐶</p>
          <p className="sub-text">
            Post your favorite Nebelung cat 🐈‍⬛ or Boxer dog 🐶 pics
          </p>
          {/* Show button only if wallet is not connected */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* Show container when wallet is connected */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
