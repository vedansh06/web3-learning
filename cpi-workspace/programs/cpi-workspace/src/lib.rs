use anchor_lang::prelude::*;

declare_id!("Gsj5BUka2nQRiJscjMbRQftCyCegtm57BrgLxigLs1GA");

#[program]
pub mod cpi_workspace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
