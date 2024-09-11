import useCanvasWallet from "./CanvasWalletProvider";
import UserProfile from "./UserProfile"; // Ensure the correct path to UserProfile

const WalletComponent = ({setWalletAddress}) => {
  const { connectWallet, walletAddress, walletIcon, userInfo, content, signTransaction } =
    useCanvasWallet();

  console.log(userInfo)

  function truncateAddress(address) {
    setWalletAddress(address);
    if (address.length <= 6) {
      return address;
    }
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  }

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : '';
  };

  return (
    <div className={`dark ${walletAddress ? "mt-3" : "mt-[-90px]"} flex justify-center flex-col`}>
      {!walletAddress &&
      <div className="w-full text-center">
       <dotlottie-player src="https://lottie.host/62fbdc98-c33a-428f-bef1-2933c285b572/W18T6i5o8T.json" background="transparent" speed="3" style={{width: "250px", height: "250px"}} direction="1" playMode="normal" loop autoplay></dotlottie-player>

       <button className="text-sm text-center h-[50px] bg-indigo-400" onClick={connectWallet}>Connect Solana Wallet</button>
       </div>
       }

      {userInfo && walletAddress && (
        <div>
          <div className="flex items-center mb-2">
            {userInfo.avatar ? (
              <img
                className="h-[55px] w-[55px] rounded-full border-cyan-300 border-4"
                src={userInfo.avatar}
                alt="User Avatar"
              />
            ) : (
              <div className="h-[50px] w-[55px] flex items-center justify-center bg-gray-900 text-white rounded-full border-cyan-300 border-2 text-2xl">
                {getInitials(userInfo.username)}
              </div>
            )}
            <p className="mx-4 w-[60%] text-xl">{userInfo.username}</p>
          </div>
          {userInfo.username && <UserProfile username={userInfo.username} />}
        </div>
      )}

      {walletAddress && (
        <div className="wallet-container">
          <p className="wallet-address" title={walletAddress}>
            Wallet Address: {truncateAddress(walletAddress)}
          </p>
        </div>
      )}

    </div>
  );
};

export default WalletComponent;
