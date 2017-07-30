const Promise     = require('bluebird');
const Web3Class = require('web3');
const erc20abi  = require('./erc20abi.json');


// config
const nodeAddress       = 'http://localhost:8545';
// MKTcoin
const erc20TokenAddress = '0x5ea300d1ccd2297b751ad9599c25fa45626f1a7d';
const userAddress       = '0x3110c4d7a26748cdcb9e2055fa907605118c5b8d';
// GOLEM token
// const erc20TokenAddress = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d';
// const userAddress       = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';


// https://etherscan.io/address/0xa74476443119A942dE498590Fe1f2454d7D4aC0d
// https://etherscan.io/address/0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98


async function callERC20() {
  // connect to the node
  const web3Obj = new Web3Class(new Web3Class.providers.HttpProvider(nodeAddress));

  // prepare to work with the contract
  const erc20Class = web3Obj.eth.contract(erc20abi);
  const erc20Obj   = erc20Class.at(erc20TokenAddress);

  // get parameters of token
  const tokenName = await erc20Obj.name.call();
  global.console.log(`Token name: ${tokenName}`);

  const tokenSymbol = await erc20Obj.symbol.call();
  global.console.log(`Token symbol: ${tokenSymbol}`);

  const tokenDecimals       = await erc20Obj.decimals.call();
  const tokenDecimalsNumber = tokenDecimals.toNumber();
  global.console.log(`Token decimals: ${tokenDecimalsNumber}`);

  // get total supply
  const totalSupply         = await erc20Obj.totalSupply.call();
  const totalSupplyInTokens = totalSupply.toNumber() / (10 ** tokenDecimalsNumber);
  global.console.log(`Total supply: ${totalSupplyInTokens}`);

  // get balance of a user
  const userBalance         = await erc20Obj.balanceOf.call(userAddress);
  const userBalanceInTokens = userBalance.toNumber() / (10 ** tokenDecimalsNumber);
  global.console.log(`Balance of the user '${userAddress}': ${userBalanceInTokens}`);

  // get current block number
  const blockNumber = web3Obj.eth.blockNumber;

  // get incoming transactions
  const transferEventObj = erc20Obj.Transfer({ to: userAddress }, { fromBlock: blockNumber - 250 });
  global.console.log('Print incoming transactions in the last 250 blocks and start to watch for new transactions');
  transferEventObj.watch((error, eventRecord) => {
    global.console.log(
      `\tFrom: ${eventRecord.args.from}, To: ${eventRecord.args.to}, Value: ${eventRecord.args.value.toNumber() /
                                                                              (10 ** tokenDecimalsNumber)}`);
  });

  await new Promise((resolve) => setTimeout(resolve, 300 * 1000));

  transferEventObj.stopWatching();
}

function launchTest() {
  global.console.log('ERC20 test started');
  return callERC20()
    .then(() => {
      global.console.log('ERC20 test finished');
    })
    .catch((err) => {
      global.console.log('ERC20 test failed !!!');
      global.console.log(err);
    });
}
launchTest();
