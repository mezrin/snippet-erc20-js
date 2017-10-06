<?php
require_once('vendor/autoload.php');

// https://github.com/tuupola/base58
use Tuupola\Base58;


// config
$nodejsRepoDir = dirname(__FILE__);
$ethereumNodeURL = 'http://localhost:8545';
$erc20TokenAddress = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d';  // GOLEM token
$userAddress = '0xbdcd1cacdb0a7901ad40289521b3815e429d438b';


function getData($nodejsRepoDir, $scriptParams) {
  $scriptParamsJson = json_encode($scriptParams);
  $base58 = new Base58(array("characters" => Base58::BITCOIN));
  $scriptParamsBase58 = $base58->encode($scriptParamsJson);
  $cmd = sprintf('cd "%s" && node src/erc20shell.js %s', $nodejsRepoDir, $scriptParamsBase58);
  $result = shell_exec($cmd);
  $resultDecoded = $base58->decode(trim($result));
  return $resultDecoded;
}

function getERC20Name($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress) {
  $scriptParams = array("eth_node_url" => $ethereumNodeURL,
                        "erc20_token_address" => $erc20TokenAddress,
                        "func_name" => "getERC20Name");
  return getData($nodejsRepoDir, $scriptParams);
}

function getERC20Symbol($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress) {
  $scriptParams = array("eth_node_url" => $ethereumNodeURL,
                        "erc20_token_address" => $erc20TokenAddress,
                        "func_name" => "getERC20Symbol");
  return getData($nodejsRepoDir, $scriptParams);
}

function getERC20Decimals($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress) {
  $scriptParams = array("eth_node_url" => $ethereumNodeURL,
                        "erc20_token_address" => $erc20TokenAddress,
                        "func_name" => "getERC20Decimals");
  return (int)getData($nodejsRepoDir, $scriptParams);
}

function getERC20TotalSupply($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress) {
  $scriptParams = array("eth_node_url" => $ethereumNodeURL,
                        "erc20_token_address" => $erc20TokenAddress,
                        "func_name" => "getERC20TotalSupply");
  return getData($nodejsRepoDir, $scriptParams);
}

function getERC20UserBalance($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress, $userAddress) {
  $scriptParams = array("eth_node_url" => $ethereumNodeURL,
                        "erc20_token_address" => $erc20TokenAddress,
                        "func_name" => "getERC20UserBalance",
                        'user_address' => $userAddress);
  return getData($nodejsRepoDir, $scriptParams);
}

function convertWeiToTokens($value, $decimals) {
  if (strlen($value) > $decimals) {
    return substr($value, 0, -$decimals) . '.' . substr($value, -$decimals);
  } else {
    return "0." . str_pad($value, $decimals, "0", STR_PAD_LEFT);
  }
}

$name = getERC20Name($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress);
$symbol = getERC20Symbol($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress);
$decimals = getERC20Decimals($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress);
$totalSupply = getERC20TotalSupply($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress);
$userBalance = getERC20UserBalance($nodejsRepoDir, $ethereumNodeURL, $erc20TokenAddress, $userAddress);

$totalSupply = convertWeiToTokens($totalSupply, $decimals);
$userBalance = convertWeiToTokens($userBalance, $decimals);

print("PHP ERC20 test started\n");
print("Token name: $name\n");
print("Token symbol: $symbol\n");
print("Token decimals: $decimals\n");
print("Total supply: $totalSupply\n");
print("Balance of the user '$userAddress': $userBalance\n");
print("PHP ERC20 test finished\n");

?>
