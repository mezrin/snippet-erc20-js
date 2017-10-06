require('babel-register');
require('babel-polyfill');

// https://stackoverflow.com/questions/29043712/how-to-convert-text-to-base58-on-node-js
const Base58 = require('base-58');

const erc20 = require('./erc20');


// parse command line arguments
const cmdArgs = global.process.argv;

const commandBase58 = cmdArgs[2];
if (typeof commandBase58 === 'undefined') {
  throw new Error('Command data not defined');
}

const commandDecoded = Base58.decode(commandBase58);
const commandBuffer = new Buffer(commandDecoded);
const commandStr = commandBuffer.toString('utf8');
const commandObj = JSON.parse(commandStr);


// validate command line arguments
if (!('eth_node_url' in commandObj)) {
  throw new Error('Ethereum node is not specified');
}
if (!('erc20_token_address' in commandObj)) {
  throw new Error('ERC20 token address is not specified');
}
if (!('func_name' in commandObj)) {
  throw new Error('Name of the function is not specified');
}
const supportedFuncs = ['getERC20Name', 'getERC20Symbol', 'getERC20Decimals', 'getERC20TotalSupply', 'getERC20UserBalance'];
if (supportedFuncs.indexOf(commandObj.func_name) === -1) {
  throw new Error(`ERC20 function is not supported "${commandObj.func_name}"`);
}
if (commandObj.func_name === 'getERC20UserBalance' && !('user_address' in commandObj)) {
  throw new Error('User address is not specified');
}

// execute command
const connectionObj = erc20.getERC20Instance(commandObj.eth_node_url, commandObj.erc20_token_address);
let result;
if (['getERC20Name', 'getERC20Symbol'].indexOf(commandObj.func_name) !== -1) {
  result = erc20[commandObj.func_name](connectionObj, commandObj.user_address);
} else if (['getERC20Decimals', 'getERC20TotalSupply'].indexOf(commandObj.func_name) !== -1) {
  result = erc20[commandObj.func_name](connectionObj);
  result = result.toPrecision();
} else {
  result = erc20[commandObj.func_name](connectionObj, commandObj.user_address);
  result = result.toPrecision();
}

// print output
const resultBase58 = Base58.encode(new Buffer(result));
global.console.log(resultBase58);
