require('babel-register');
require('babel-polyfill');

const Promise = require('bluebird');
const Web3Class = require('web3');
const BigNumber = require('bignumber.js');
const erc20abi = require('./erc20abi.json');


export function getERC20Instance(ethereumNodeURL, erc20TokenAddress) {
  // connect to the node
  const web3Obj = new Web3Class(new Web3Class.providers.HttpProvider(ethereumNodeURL));

  // prepare to work with the contract
  const erc20Class = web3Obj.eth.contract(erc20abi);
  const erc20Obj = erc20Class.at(erc20TokenAddress);

  return {web3Obj, erc20Obj};
}


export function getERC20Name(connectionData) {
  const {erc20Obj} = connectionData;
  return erc20Obj.name.call();
}

export function getERC20Symbol(connectionData) {
  const {erc20Obj} = connectionData;
  return erc20Obj.symbol.call();
}

export function getERC20Decimals(connectionData) {
  const {erc20Obj} = connectionData;
  return new BigNumber(erc20Obj.decimals.call());
}


export function getERC20TotalSupply(connectionData) {
  const {erc20Obj} = connectionData;
  return new BigNumber(erc20Obj.totalSupply.call());
}

export function getERC20UserBalance(connectionData, userAddress) {
  const {erc20Obj} = connectionData;
  return new BigNumber(erc20Obj.balanceOf.call(userAddress));
}

export async function getERC20UserTransactions(connectionData, userAddress, blocksScanningNumber) {
  const {web3Obj, erc20Obj} = connectionData;

  const blockNumber = web3Obj.eth.blockNumber;

  const transferEventObj = erc20Obj.Transfer({to: userAddress}, {fromBlock: blockNumber - blocksScanningNumber});
  const getTransferEvents = Promise.promisify(transferEventObj.get).bind(transferEventObj);
  const pastEvents = await getTransferEvents();

  return pastEvents.map((eventRecord) => (
    {
      from: eventRecord.args.from,
      to: eventRecord.args.to,
      value: new BigNumber(eventRecord.args.value),
    }));
}

export async function watchERC20UserTransactions(connectionData, userAddress, txCallback, watchTimeMSec) {
  const {web3Obj, erc20Obj} = connectionData;

  const blockNumber = web3Obj.eth.blockNumber;

  const transferEventObj = erc20Obj.Transfer({to: userAddress}, {fromBlock: blockNumber});
  transferEventObj.watch((error, eventRecord) => {
    const txRecord = {
      from: eventRecord.args.from,
      to: eventRecord.args.to,
      value: new BigNumber(eventRecord.args.value),
    };
    txCallback(txRecord);
  });

  await new Promise((resolve) => setTimeout(resolve, watchTimeMSec));

  transferEventObj.stopWatching();
}
