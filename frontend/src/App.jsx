import WalletComponent from './WalletComponent'
import { CanvasWalletProvider } from './CanvasWalletProvider';
import { MintedTokens } from './MintedTokens';
import { useEffect, useState } from 'react';
import NFTDisplay from './NftTokens';
import { MintData1 } from './MintData';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [MintData, setMintData] = useState(null);

  return (
    <CanvasWalletProvider>
      <div className="container h-full">
        <div className="flex justify-center gap-5 w-full mt-5 max-h-[280px]">
          <div className={`${walletAddress && "border-slate-700 bg-gray-800 border"} rounded-lg  p-4`}>
            <WalletComponent setWalletAddress={setWalletAddress} />
          </div>

          {walletAddress && (
            <div className='border border-slate-700 rounded-lg p-4'>
              {MintData ? (
                <MintedTokens MintData={MintData} />
              ) : (
                <div className='flex justify-center w-full h-full items-center'>
                  <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'></div>
                  <span className='ml-2 text-lg'>Loading...</span>
                </div>
              )}
            </div>
          )}
        </div>
        {walletAddress && <div className='w-full flex flex-col justify-center mt-5'>
          {MintData && <NFTDisplay mintData={MintData} />}
          <MintData1 setMintData={setMintData} />
        </div>}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
    </CanvasWalletProvider>
  )
}

export default App