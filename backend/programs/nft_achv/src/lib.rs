use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_PROGRAM_ID,
    instructions::{CreateV2CpiBuilder},
};

declare_id!("4NWCR5Ga4WJdBkZH9h3oSbhDwt4if2dXt87xH25jRnQn");

// Define a struct to store achievement requirements
#[derive(Debug, Clone)]
pub enum Achievement {
    FollowerCount(i64),
    StreakDays(i64),
    DscvrPoints(i64),
}

// Define a hardcoded map of achievements to NFT metadata URIs
const ACHIEVEMENTS: [(&str, Achievement, &str, u64); 3] = [
    ("follower_count_1", Achievement::FollowerCount(1), "https://raw.githubusercontent.com/preyanshu/metaplex-core-nft-blink/main/anchor-example/assets/followerfrenzy.json", 500),
    ("streak_days_3", Achievement::StreakDays(3), "https://raw.githubusercontent.com/preyanshu/metaplex-core-nft-blink/main/anchor-example/assets/streakseeker.json", 200),
    ("dscvr_points_1000000000", Achievement::DscvrPoints(1000), "https://raw.githubusercontent.com/preyanshu/metaplex-core-nft-blink/main/anchor-example/assets/discoverydynamo.json", 10),
];

#[program]
pub mod anchor_example {
    use super::*;

    pub fn initialize_database(ctx: Context<InitializeDatabase>) -> Result<()> {
        let database = &mut ctx.accounts.database;

        // Initialize achievements using the hardcoded ACHIEVEMENTS data
        database.achievements = ACHIEVEMENTS.iter().map(|(name, _, _, max_nft_cap)| {
            AchievementData {
                name: name.to_string(),
                wallets: vec![],
                current_count: 0,
                max_nft_cap: *max_nft_cap,
            }
        }).collect();

        database.achievements_count = database.achievements.len() as u64;

        msg!("Database initialized with {:?} achievements!", database.achievements);
        Ok(())
    }

    pub fn create_asset(
        ctx: Context<CreateAsset>,
        name: String,
        follower_count: i64,
        dscvr_points: i64,
        streak_day_count: i64,
        user_id: String, // New parameter to accept user ID
    ) -> Result<()> {
        msg!("Checking for achievements...");
        msg!("follower_count: {}", follower_count);
        msg!("dscvr_points: {}", dscvr_points);
        msg!("streak_day_count: {}", streak_day_count);
    
        // Find the matching achievement based on the provided name
        let achievement = ACHIEVEMENTS.iter().find(|(ach_name, ach_requirement, _, _)| {
            match ach_requirement {
                Achievement::FollowerCount(req) => name == *ach_name && follower_count >= *req,
                Achievement::StreakDays(req) => name == *ach_name && streak_day_count >= *req,
                Achievement::DscvrPoints(req) => name == *ach_name && dscvr_points >= *req,
            }
        }).ok_or(ErrorCode::AchievementNotMet)?;
    
        let achievement_name = achievement.0;
        let uri = achievement.2;
    
        msg!("Achievement Name: {}", achievement_name);
        msg!("URI: {}", uri);
    
        let database = &mut ctx.accounts.database;
        let wallet_address = ctx.accounts.signer.key.to_string();
    
        let achievement_data = database.achievements.iter_mut().find(|data| {
            data.name == achievement_name
        }).ok_or(ErrorCode::AchievementNotFound)?;
    
        // Check if the wallet address is already associated with the achievement
        if achievement_data.wallets.iter().any(|info| info.wallet_address == wallet_address) {
            return Err(ErrorCode::AlreadyMinted.into());
        }
    
        // Check if the user_id is already associated with the achievement
        if achievement_data.wallets.iter().any(|info| info.user_id == user_id) {
            return Err(ErrorCode::UserIdAlreadyExists.into());
        }
    
        // Check the NFT cap
        if achievement_data.current_count >= achievement_data.max_nft_cap {
            return Err(ErrorCode::NftCapExceeded.into());
        }
    
        // Create the asset with the dynamic asset name based on the achievement code
        CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .payer(&ctx.accounts.payer.to_account_info()) // Use the payer's wallet to cover fees
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name(achievement_name.to_string()) // Use the achievement code as the asset name
            .uri(uri.to_string())
            .invoke()?;
    
        // Store the wallet address and user ID that minted this achievement and update count
        achievement_data.wallets.push(WalletInfo {
            wallet_address,
            user_id,
        });
        achievement_data.current_count += 1;
    
        msg!("Achievement minted successfully! {:?}", database.achievements);
    
        Ok(())
    }
    
}

// Define the context for initializing the database
#[derive(Accounts)]
pub struct InitializeDatabase<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, payer = payer, space = 8000)]  // Adjust space as needed
    pub database: Account<'info, Database>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateAsset<'info> {
    pub signer: Signer<'info>, // Any wallet can be the signer to mint the asset
    #[account(mut)]
    pub payer: Signer<'info>, // The wallet paying for transaction fees
    #[account(mut)]
    pub asset: Signer<'info>, // The asset being created
    #[account(address = MPL_CORE_PROGRAM_ID)]
    /// CHECK: This is checked only by address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub database: Account<'info, Database>, // Database of achievements and related data
}

// Define the database structure
#[account]
#[derive(Debug)]
pub struct Database {
    pub achievements_count: u64, // Number of achievements stored
    pub achievements: Vec<AchievementData>, // Dynamic size for achievement data
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct AchievementData {
    pub name: String,
    pub wallets: Vec<WalletInfo>, // Use WalletInfo struct for wallet addresses and user IDs
    pub current_count: u64, // Current number of NFTs minted for this achievement
    pub max_nft_cap: u64,   // Maximum number of NFTs that can be minted for this achievement
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct WalletInfo {
    pub wallet_address: String, // Wallet address
    pub user_id: String,        // User ID
}

#[error_code]
pub enum ErrorCode {
    #[msg("The user has not met the criteria for the achievement.")]
    AchievementNotMet,
    #[msg("The user has already minted this achievement.")]
    AlreadyMinted,
    #[msg("The maximum NFT cap for this achievement has been reached.")]
    NftCapExceeded,
    #[msg("Achievement not found.")]
    AchievementNotFound,
    #[msg("The user ID has already been used for this achievement.")]
    UserIdAlreadyExists,
}
