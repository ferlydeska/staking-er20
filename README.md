# staking
blockchain

install Depedency NPM i

echo "# staking" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ferlydeska/staking.git
git push -u origin main


truffle init
truffle compile
truffle compile --all
truffle migrate
truffle migrate --reset
truffle console (masuk ke syntax truffle)
    -: tether= await Tether.deployed() --untuk melihat hasil smart contract

truffle(development)> acc = await web3.eth.getAccounts()
undefined
truffle(development)> acc[0]
web3.etils.fromWei(nominal)

truffle test
truffle exec scripts/issue-tokens.js

for 'error:03000086:digital envelope routines::initialization error'
just run “npm install” then run “npm audit fix -–force”

to start React server
npm run start

to install package lock only
npm i --package-lock-only


test network
untuk dpat koin buka faucet rinkeby
untuk lihat contract di etherscan rinkeby