# TrophyMint

![_b033e4b3-8ecc-4a49-ac30-e07070c8a90b.jpg](https://cdn.dorahacks.io/static/files/191e2251fb2e2a4043420844c38ae456.jpg)

## Introduction

The project aims to revolutionize social media by allowing users to mint rare NFTs as rewards for achieving specific milestones. Each NFT has a limited supply, ensuring exclusivity and value. This approach provides genuine digital ownership, enabling users to trade their achievements as unique assets. By incorporating leaderboards and exclusive rewards, the project drives active participation and engagement within the community. It enhances the dscvr community while seamlessly integrating NFTs with social media, creating a unified and innovative experience.

We utilize the **Metaplex Core Standard** for minting NFTs, which offers significant advantages such as streamlined NFT creation, efficient metadata management, and robust support for decentralized applications. This standard ensures that our NFTs are created with consistency and reliability, enhancing the overall user experience.


### Demo Video

[Click here to watch the demo video](https://link-to-your-demo-video.com)

### Canvas Link

[Explore the Canvas here](https://dscvr.one/post/1201336802623881354)

### Github Link

[Explore the Github Repo here](https://github.com/preyanshu/TrophyMint)

## Working

The following steps outline how TrophyMint functions :

1. **Connect Wallet:**
   - Users begin by connecting their Solana-compatible wallet (e.g., Phantom) to the platform. This allows for secure interactions and NFT minting.

![step2.png](https://cdn.dorahacks.io/static/files/191e22f83b007c98500899b40c19285d.png)

1. **Dashboard Access:**
   - Once connected, users are taken to their personalized dashboard. This dashboard displays:
     - **Profile Information:** Details about the user's social media achievements.
     - **Achievement NFTs:** A collection of NFTs representing the achievements completed by the user.
     - **Top Minter Leaderboard:** A leaderboard showcasing the top minters for each NFT, including the first achiever to mint the NFT.
     - **NFT Supply Details:** For each NFT, users can also see:
       - **Total Supply:** The maximum number of NFTs that can be minted for each achievement.
       - **Minted NFTs:** The number of NFTs that have been minted so far.

![step2.png](https://cdn.dorahacks.io/static/files/191e22f83b007c98500899b40c19285d.png)

1. **Mint Achievement NFTs:**
   - If a user has completed a specific achievement, they can click the **Mint NFT** button corresponding to that achievement. The platform verifies the completion and mints a rare NFT, which is added to the user’s profile.

![step2.png](https://cdn.dorahacks.io/static/files/191e22f83b007c98500899b40c19285d.png)

## Behind the Scenes

### Tech Stack

TrophyMint leverages modern technologies to provide a seamless experience for users:

- **Frontend:** React with Vite for building a fast and responsive user interface.
- **Blockchain:** Solana blockchain to handle the minting and transfer of NFTs.
- **NFT Standard:** Metaplex Core Standard is used to create and manage NFTs efficiently.
- **Frontend Integration:** DSCVR SDK and DSCVR API are used on the frontend to fetch user profiles, achievements, and integrate social media data.
- **Smart Contracts:** Written in Rust for handling the logic around NFT minting, ensuring limited supply, and validating achievements.

### How It Works

![working.png](https://cdn.dorahacks.io/static/files/191e2526a6bd1ef7c72870e4030b9aa9.png)

1. **User Authentication:**
   - When a user connects their wallet (e.g., Phantom), a session is established on the Solana blockchain. This allows the platform to interact with the user’s wallet for transactions such as NFT minting.

1. **Data Fetching (Frontend Logic):**
   - The DSCVR SDK and API, integrated on the frontend, fetch user data such as achievements and profile information from the social media platform. The API also tracks user activities and milestones to determine which achievements have been completed.

1. **Achievements and NFT Minting Logic:**
   - For each achievement, there’s a corresponding NFT created using the Metaplex Core Standard. The smart contracts on Solana ensure that:
     - The user has completed the required achievement before allowing the minting.
     - The NFT has a limited supply, and no more than the defined number of NFTs can be minted for a specific achievement.
     - The smart contract keeps track of how many NFTs have been minted and prevents further minting once the limit is reached.

1. **Displaying Minted NFTs and Supply:**
   - The frontend communicates with the blockchain to show real-time data about:
     - The number of NFTs already minted.
     - The total available supply.
     - The leaderboard, which highlights the top users who minted first.

1. **Updating the Dashboard:**
   - Once an NFT is minted, the dashboard updates with the newly minted NFT and adjusts the number of available NFTs. The user’s profile now includes the newly acquired NFT, and the leaderboard reflects any changes in minting order.

1. **Blockchain Transactions:**
   - All actions, from wallet connections to NFT minting, are securely handled by smart contracts on the Solana blockchain. These transactions are gas-efficient and ensure decentralized verification of ownership and achievements.

## Setup Guide

Follow these instructions to set up the project locally. The setup includes both the frontend and backend components.

### Frontend Setup (React + Vite)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/preyanshu/TrophyMint

2. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend

3. **Install Dependencies:**
   ```bash

   npm install

4. **Run the Development Server:**
   ```bash
   npm run dev

### Backend Setup (Anchor on Devnet) 

1. **Install Anchor CLI**

2. **Navigate to the Backend Directory:**
   ```bash
   cd backend

3. **Configure Anchor for Devnet:**
   ```bash
   anchor config set --provider.cluster devnet

4. **Install Dependencies:**
   ```bash
   npm i

5. **Build the smart contracts using Anchor:**
   ```bash
   anchor build

6. **Deploy the contracts to Devnet:**
   ```bash
   anchor deploy

7. **Test the contract:**
   ```bash
   anchor test --skip-build --skip-deploy
