// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingToken is ERC20, Ownable {
    using SafeMath for uint256;

    address[] internal stakeholders; //nasabh
    mapping(address => uint256) internal stakes; //saldo nasabah
    mapping(address => uint256) internal rewards; // bonus nasabah

    constructor(address _owner, uint256 _supply)
        Ownable()
        ERC20("Nusa Tokens", "NUSA")
    {
        _mint(_owner, _supply);
        transferOwnership(_owner);
    }

    function isStakeholder(address _address)
        public
        view
        returns (bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }

    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    // lihat saldo stakeholder yg di depo
    function stakeOf(address _stakeholder) public view returns (uint256) {
        return stakes[_stakeholder];
    }

    // lihat depo keseluruhan
    function totalStakes() public view returns (uint256) {
        uint256 _totalStakes = 0;
        for (uint256 i = 0; i < stakeholders.length; i++) {
            _totalStakes = _totalStakes.add(stakes[stakeholders[i]]); //+=
        }
        return _totalStakes;
    }

    // depo ke smart contract
    function createStake(uint256 _amount) public {
        require(_amount > 0, "Jumlah harus lebih dari 0");
        _burn(msg.sender, _amount);
        if (stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakes[msg.sender] = stakes[msg.sender].add(_amount); // +=
    }

    // witdrawl dari smart  contract
    function removeStake(uint256 _amount) public {
        uint256 balance = stakes[msg.sender];
        require(balance >= _amount, "Saldo yg ditarik terlalu banyak");

        stakes[msg.sender] = stakes[msg.sender].sub(_amount); // -=
        if (stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _amount);
    }

    //Perhitungan Bonus Nasabah
    //jml bonus yg di dapat per nasabah
    function rewardOf(address _stakeholder) public view returns (uint256) {
        return rewards[_stakeholder];
    }

    //total bonus keseluruhan nasabah
    function totalRewards() public view returns (uint256) {
        uint256 _totalRewards = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            _totalRewards = _totalRewards.add(rewards[stakeholders[s]]);
        }
        return _totalRewards;
    }

    // perhitungan bonus 1% dri depo
    function calculateReward(address _stakeholder)
        public
        view
        returns (uint256)
    {
        return stakes[_stakeholder] / 100;
    }

    function distributeRewards() public onlyOwner {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            address stakeholder = stakeholders[s];
            uint256 reward = calculateReward(stakeholder);
            rewards[stakeholder] = rewards[stakeholder].add(reward);
        }
    }

    //ambil bonus
    function withdrawReward() public {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        // removeStake(reward);
        _mint(msg.sender, reward);
    }
}
