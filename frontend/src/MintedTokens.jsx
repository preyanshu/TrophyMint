import React, { useState } from 'react';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';

export const MintedTokens = ({ MintData }) => {
    
    const [activeTab, setActiveTab] = useState(0);
    const canvasClient = new CanvasClient();
    
        const openUserUrl1 = (username) =>{
            if(!canvasClient) return;
           const url = `https://dscvr.one/u/${username}`;
            canvasClient.openLink(url);
        }

    const renderTabContent = () => {
        const achievement = MintData?.achievements[activeTab];
        return (
            <div>
                <h3 className='my-2 font-bold'>Top minters</h3>
                <ul className='overflow-y-scroll max-h-[80px]'>
                    {achievement?.wallets.length > 0 ? (
                        achievement?.wallets.map((wallet, index) => (
                            <li className='border border-gray-500 rounded-lg my-2 p-2' key={index}>
                                <span className='font-bold cursor-pointer pr-2 text-indigo-400' onClick={() => openUserUrl1(wallet.userId)}>
                                 <span className='text-white'>#{index+1}</span>   {wallet.userId}</span>
                                <span className="text-xs">
                                    {wallet.walletAddress}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className='text-lg text-center mt-3 text-gray-500'>No wallets associated</li>
                    )}
                </ul>
            </div>
        );
    };

    return (
        <div className='text-sm'>
            <div className="tabs flex gap-2">
                <button onClick={() => setActiveTab(0)} className={`${activeTab == 0 && "text-indigo-400"}`}>Follower Frenzy </button>
                <button onClick={() => setActiveTab(1)} className={`${activeTab == 1 && "text-indigo-400"}`}>Streak Seeker </button>
                <button onClick={() => setActiveTab(2)} className={`${activeTab == 2 && "text-indigo-400"}`}>Discovery Dynamo </button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};
