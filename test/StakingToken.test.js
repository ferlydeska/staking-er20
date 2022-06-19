const StakingToken = artifacts.require("StakingToken");
let BigNumber = require('bignumber.js');


contract('StakingToken', (accounts) => {
    function tokensToWei(number) {
        return web3.utils.toWei(number, 'ether');
    }

    let stakingToken;
    // const manyTokens = tokensToWei('1000');
    const manyTokens = BigNumber(10).pow(18).multipliedBy(1000); // 1000
    const owner = accounts[0];
    const user = accounts[1];


    before(async () => {
        stakingToken = await StakingToken.deployed()
    });
    describe('Staking', async () => {
        beforeEach(async () => {
            stakingToken = await StakingToken.new(
                owner,
                manyTokens.toString(10)
            );
        });
        it("Saldo Nusa 1juta token", async () => {
            let balance = await stakingToken.balanceOf(owner);
            assert.equal(balance, tokensToWei('1000'), "Saldo 1 juta");
        });
        it('createStake creates a stake.', async () => {
            await stakingToken.transfer(user, 3, { from: owner });
            await stakingToken.createStake(1, { from: user });

            assert.equal(await stakingToken.balanceOf(user), 2);
            assert.equal(await stakingToken.stakeOf(user), 1);
            assert.equal(
                await stakingToken.totalSupply(),
                manyTokens.minus(1).toString(10),
            );
            assert.equal(await stakingToken.totalStakes(), 1);
        });

        it('rewards are distributed.', async () => {
            await stakingToken.transfer(user, 100, { from: owner });
            await stakingToken.createStake(100, { from: user });
            await stakingToken.distributeRewards({ from: owner });

            assert.equal(await stakingToken.rewardOf(user), 1);
            assert.equal(await stakingToken.totalRewards(), 1);
        });

        it('rewards can be withdrawn.', async () => {
            await stakingToken.transfer(user, 100, { from: owner });
            await stakingToken.createStake(100, { from: user });
            await stakingToken.distributeRewards({ from: owner });
            await stakingToken.withdrawReward({ from: user });

            const initialSupply = manyTokens;
            const existingStakes = 100;
            const mintedAndWithdrawn = 1;

            assert.equal(await stakingToken.balanceOf(user), 1);
            assert.equal(await stakingToken.stakeOf(user), 100);
            assert.equal(await stakingToken.rewardOf(user), 0);
            assert.equal(
                await stakingToken.totalSupply(),
                initialSupply
                    .minus(existingStakes)
                    .plus(mintedAndWithdrawn)
                    .toString(10)
            );
            assert.equal(await stakingToken.totalStakes(), 100);
            assert.equal(await stakingToken.totalRewards(), 0);
        });


        // it("transfer ke nasabah", async () => {
        //     const amount = 10000;
        //     await stakingToken.transfer(user, amount, {
        //         from: owner
        //     });
        //     // let bb = web3.utils.toWei('100','ether');
        //     // console.log(bb);
        //     let balance = await stakingToken.balanceOf(user);
        //     assert.equal(balance, amount, "Saldo 10000");
        // });

        // it('nasabah deposit 1000', async () => {
        //     let balanceBefore = await stakingToken.balanceOf(user);
        //     const amount = 1000;
        //     await stakingToken.createStake(amount, { from: user });

        //     let balanceAfter = await stakingToken.balanceOf(user);
        //     assert.equal(balanceAfter, balanceBefore - amount, "Saldo Setelah deposit");

        //     let saldoDepo = await stakingToken.stakeOf(user);
        //     assert.equal(saldoDepo, amount);
        //     assert.equal(
        //         await stakingToken.totalSupply(),
        //         totSupply - amount,
        //     );
        //     assert.equal(await stakingToken.totalStakes(), amount);
        // });

        // it('unstake 100', async () => {
        //     await stakingToken.removeStake('100', { from: user });

        //     let saldoDepo = await stakingToken.stakeOf(user);
        //     assert.equal(saldoDepo, 900);
        //     assert.equal(await stakingToken.balanceOf(user), 9100);
        // });

        // it('rewards are distributed.1 % dri saldo', async () => {
        //     await stakingToken.distributeRewards({ from: owner });

        //     assert.equal(await stakingToken.rewardOf(user), 9);
        //     assert.equal(await stakingToken.totalRewards(), 9);
        // });

        // it('rewards can be withdrawn.', async () => {
        //     await stakingToken.withdrawReward({ from: user });

        //     // let balanceAfter = await stakingToken.balanceOf(user);
        //     // console.log(balanceAfter);

        //     assert.equal(await stakingToken.stakeOf(user), 909);
        //     assert.equal(await stakingToken.rewardOf(user), 0);
        //     assert.equal(
        //         await stakingToken.totalSupply(),
        //         totSupply - 1000 + 100 - 9
        //     );
        //     assert.equal(await stakingToken.totalStakes(), 909);
        //     assert.equal(await stakingToken.totalRewards(), 0);
        //     assert.equal(await stakingToken.balanceOf(user), 9091);
        //     // console.log(await stakingToken.balanceOf(user));
        // });
    });

});