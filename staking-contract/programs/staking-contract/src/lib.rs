use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111");

const POINTS_PER_SOL_PER_DAY: u64 = 1_000_000;
const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
const SECONDS_PER_DAY: u64 = 86_400;

#[program]
pub mod your_program {
    use super::*;

    pub fn create_pda_account(ctx: Context<CreatePdaAccount>) -> Result<()> {
        let clock = Clock::get()?;

        ctx.accounts.stake_account.owner = ctx.accounts.payer.key();
        ctx.accounts.stake_account.staked_amount = 0;
        ctx.accounts.stake_account.total_points = 0;
        ctx.accounts.stake_account.last_update_time = clock.unix_timestamp;
        ctx.accounts.stake_account.bump = ctx.bumps.stake_account;

        ctx.accounts.vault.bump = ctx.bumps.vault;

        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        let clock = Clock::get()?;
        let stake_account = &mut ctx.accounts.stake_account;

        update_points(stake_account, clock.unix_timestamp)?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, amount)?;

        stake_account.staked_amount = stake_account
            .staked_amount
            .checked_add(amount)
            .ok_or(StakeError::Overflow)?;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        let clock = Clock::get()?;
        let stake_account = &mut ctx.accounts.stake_account;

        require!(
            stake_account.staked_amount >= amount,
            StakeError::InsufficientStake
        );

        update_points(stake_account, clock.unix_timestamp)?;

        let user_key = ctx.accounts.user.key();
        let seeds = &[b"vault", user_key.as_ref(), &[ctx.accounts.vault.bump]];

        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );
        system_program::transfer(cpi_ctx, amount)?;

        stake_account.staked_amount = stake_account
            .staked_amount
            .checked_sub(amount)
            .ok_or(StakeError::Underflow)?;

        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimPoints>) -> Result<()> {
        let clock = Clock::get()?;
        let stake_account = &mut ctx.accounts.stake_account;

        update_points(stake_account, clock.unix_timestamp)?;

        let claimable = stake_account.total_points / 1_000_000;
        msg!("Claimable points: {}", claimable);

        stake_account.total_points = 0;
        Ok(())
    }

    pub fn get_points(ctx: Context<GetPoints>) -> Result<()> {
        let clock = Clock::get()?;
        let stake_account = &ctx.accounts.stake_account;

        let elapsed = clock
            .unix_timestamp
            .checked_sub(stake_account.last_update_time)
            .ok_or(StakeError::InvalidTimestamp)? as u64;

        let new_points = calculate_points_earned(stake_account.staked_amount, elapsed)?;

        let total = stake_account
            .total_points
            .checked_add(new_points)
            .ok_or(StakeError::Overflow)?;

        msg!("Current points: {}", total / 1_000_000);
        Ok(())
    }
}

fn update_points(stake: &mut StakeAccount, now: i64) -> Result<()> {
    let elapsed = now
        .checked_sub(stake.last_update_time)
        .ok_or(StakeError::InvalidTimestamp)? as u64;

    if elapsed > 0 && stake.staked_amount > 0 {
        let points = calculate_points_earned(stake.staked_amount, elapsed)?;
        stake.total_points = stake
            .total_points
            .checked_add(points)
            .ok_or(StakeError::Overflow)?;
    }

    stake.last_update_time = now;
    Ok(())
}

fn calculate_points_earned(staked: u64, seconds: u64) -> Result<u64> {
    let points = (staked as u128)
        .checked_mul(seconds as u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(POINTS_PER_SOL_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(LAMPORTS_PER_SOL as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(SECONDS_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?;

    Ok(points as u64)
}

#[derive(Accounts)]
pub struct CreatePdaAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<StakeAccount>(),
        seeds = [b"client1", payer.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        init,
        payer = payer,
        space = 8 + 1,
        seeds = [b"vault", payer.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"client1", user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"client1", user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, VaultAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimPoints<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"client1", user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub stake_account: Account<'info, StakeAccount>,
}

#[derive(Accounts)]
pub struct GetPoints<'info> {
    pub user: SystemAccount<'info>,

    #[account(
        seeds = [b"client1", user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub stake_account: Account<'info, StakeAccount>,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub total_points: u64,
    pub last_update_time: i64,
    pub bump: u8,
}

#[account]
pub struct VaultAccount {
    pub bump: u8,
}

#[error_code]
pub enum StakeError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Insufficient stake")]
    InsufficientStake,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Overflow")]
    Overflow,
    #[msg("Underflow")]
    Underflow,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}
