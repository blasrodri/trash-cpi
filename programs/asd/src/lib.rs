use anchor_lang::prelude::*;
use asd_puppet::{program::AsdPuppet, Data};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod asd {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // craete the PDA
        msg!("initialize");
        Ok(())
    }

    pub fn set_data_cpi(ctx: Context<SetDataCPI>, bump: u8, data: u64) -> Result<()> {
        // given the PDA, do the CPI with the signer
        msg!("set_data_cpi");
        let seeds = &[&[b"data", bytemuck::bytes_of(&bump)][..]];
        let asd_puppet_id = ctx.accounts.asd_puppet.to_account_info();
        let callee_accounts = asd_puppet::cpi::accounts::SetData {
            data_acc: ctx.accounts.data_acc.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(asd_puppet_id, callee_accounts, seeds.as_ref());
        asd_puppet::cpi::set_data(cpi_ctx, data)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,  
        seeds = [b"data".as_ref()],
        bump,
        space = 8 + 8,
        payer = signer
    )]
    pub stored_data: Account<'info, Data>,
    
    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bump: u8, _data: u64)]
pub struct SetDataCPI<'info> {
    #[account(
        mut,
        seeds = [b"data".as_ref()],
        bump,
    )]
    pub data_acc: Account<'info, Data>,
    pub asd_puppet: Program<'info, AsdPuppet>,
}
