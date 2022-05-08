use anchor_lang::prelude::*;
use asd_puppet::cpi::accounts::SetData;
use asd_puppet::{program::AsdPuppet, Data};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod asd {
    use super::*;

    pub fn set(ctx: Context<SetDataCPI>, bump: u8, data: u64) -> Result<()> {
        // given the PDA, do the CPI with the signer
        // msg!("set_data_cpi");
        // let seeds = &[&[b"data", bytemuck::bytes_of(&bump)][..]];
        // let asd_puppet_id = ctx.accounts.asd_puppet.to_account_info();
        // let callee_accounts = asd_puppet::cpi::accounts::SetData {
        //     data_acc: ctx.accounts.data_acc.to_account_info(),
        // };
        // let cpi_ctx = CpiContext::new_with_signer(asd_puppet_id, callee_accounts, seeds);
        // asd_puppet::cpi::set_data(cpi_ctx, data)
        // // Ok(())

        let cpi_program = ctx.accounts.puppet_program.to_account_info();
        let user = &mut ctx.accounts.stored_data;

        let key = *user.to_account_info().key;

        msg!("inside puppet master");

        let cpi_accounts = SetData {
            puppet: ctx.accounts.stored_data.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let seeds = &[&[b"data", key.as_ref(), bytemuck::bytes_of(&bump)][..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);
        asd_puppet::cpi::set_data(cpi_ctx, data);

        Ok(())

    }
}

#[derive(Accounts)]
pub struct SetDataCPI<'info> {
    #[account(mut)]
    pub stored_data: Account<'info, Data>,
    pub puppet_program: Program<'info, AsdPuppet>,
    /// CHECK:
    pub authority: UncheckedAccount<'info>,
}