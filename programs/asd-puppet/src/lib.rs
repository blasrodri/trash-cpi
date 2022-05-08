use anchor_lang::prelude::*;

declare_id!("3VZ9nXkeykcoKteZKCoUAi2r5kP9zXRSua35TffNfEpk");

#[program]
pub mod asd_puppet {
    use super::*;

    pub fn init(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        ctx.accounts.puppet.authority = authority;
        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, num: u64) -> Result<()> {
        // here we shuold also check for authority...
        ctx.accounts.puppet.num = num;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub puppet: Account<'info, Data>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut, has_one = authority)]
    pub puppet: Account<'info, Data>,
    pub authority: Signer<'info>
}

#[account]
pub struct Data {
    pub num: u64,
    pub authority: Pubkey
}
