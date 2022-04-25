use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod asd_puppet {
    use super::*;

    pub fn set_data(ctx: Context<SetData>, num: u64) -> Result<()> {
        // here we shuold also check for authority...
        ctx.accounts.data_acc.num = num;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub data_acc: Account<'info, Data>,
}

#[account]
pub struct Data {
    pub num: u64,
}
