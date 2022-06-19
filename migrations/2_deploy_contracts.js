const StakingToken = artifacts.require("StakingToken");

module.exports = async function (deployer, network, accounts) {
    const jmlToken = web3.utils.toWei("100000", "ether");
    const owner = accounts[0];
    await deployer.deploy(StakingToken, owner, jmlToken);
};
