require('babel-register');
require('babel-polyfill');

const BigNumber = require('bignumber.js');

const erc20 = require('./src/erc20');


async function callERC20() {
  const ethereumNodeURL = 'http://localhost:8545';
  const erc20TokenAddress = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d';  // GOLEM token
  const userAddress = '0xbdcd1cacdb0a7901ad40289521b3815e429d438b';

  const connectionData = erc20.getERC20Instance(ethereumNodeURL, erc20TokenAddress);

  // get parameters of token
  const tokenName = await erc20.getERC20Name(connectionData);
  global.console.log(`Token name: ${tokenName}`);

  const tokenSymbol = await erc20.getERC20Symbol(connectionData);
  global.console.log(`Token symbol: ${tokenSymbol}`);

  const tokenDecimals = await erc20.getERC20Decimals(connectionData);
  global.console.log(`Token decimals: ${tokenDecimals}`);

  const zeros = new BigNumber(10).toPower(tokenDecimals);

  // get total supply
  const totalSupply = await erc20.getERC20TotalSupply(connectionData);
  const totalSupplyInTokens = totalSupply / zeros;
  global.console.log(`Total supply: ${totalSupplyInTokens}`);

  // get balance of a user
  const userBalance = await erc20.getERC20UserBalance(connectionData, userAddress);
  const userBalanceInTokens = userBalance.toNumber() / zeros;
  global.console.log(`Balance of the user '${userAddress}': ${userBalanceInTokens}`);

  // get incoming transactions
  global.console.log('Get past transactions');
  const txList = await erc20.getERC20UserTransactions(connectionData, userAddress, 250);
  txList.forEach((txRecord) =>
                   global.console.log(`\tFrom: ${txRecord.from}, To: ${txRecord.to}, Value: ${txRecord.value / zeros}`));

  global.console.log('Watch for the new transactions');
  const printCallback = (txRecord) => {
    global.console.log(`\tFrom: ${txRecord.from}, To: ${txRecord.to}, Value: ${txRecord.value / zeros}`);
  };
  await erc20.watchERC20UserTransactions(connectionData, userAddress, printCallback, 10 * 1000);
}

function launchTest() {
  global.console.log('JavaScript ERC20 test started');
  return callERC20()
    .then(() => {
      global.console.log('JavaScript ERC20 test finished');
    })
    .catch((err) => {
      global.console.log('JavaScript ERC20 test failed !!!');
      global.console.log(err);
    });
}

launchTest();
