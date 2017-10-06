Snippet with the JavaScript snippet for Ethereum ERC20 token


# Requirements

Node 8.5.0+


# JavaScript example

Clone repo and install packages

```
git clone https://github.com/mezrin/snippet-erc20-js
cd snippet-erc20-js
npm install
```

Configure example script, set variable `ethereumNodeURL`

```
nano example.js
```

Launch example

```
node example.js
```

You will see results like this:

```
JavaScript ERC20 test started
Token name: Golem Network Token
Token symbol: GNT
Token decimals: 18
Total supply: 1000000000
Balance of the user '0xbdcd1cacdb0a7901ad40289521b3815e429d438b': 8729.989350924343
Get past transactions
	From: 0x23da1bc5feb8b96b1cdb52cc5a18d2a37cc21a33, To: 0xbdcd1cacdb0a7901ad40289521b3815e429d438b, Value: 2888
	From: 0x8d8236e491898a58fc840b39c96b8dff6d38d932, To: 0xbdcd1cacdb0a7901ad40289521b3815e429d438b, Value: 2100
	From: 0x082526e6dca96ee707d9669f88a196b50d373163, To: 0xbdcd1cacdb0a7901ad40289521b3815e429d438b, Value: 228
	From: 0x8cdad5ecbc3e83fb7cc4c34873d4a344d954ce25, To: 0xbdcd1cacdb0a7901ad40289521b3815e429d438b, Value: 2775.58464208
	From: 0xc8d739af809e4f00ed2aec19f94b37d4e865538d, To: 0xbdcd1cacdb0a7901ad40289521b3815e429d438b, Value: 1579
Watch for the new transactions
JavaScript ERC20 test finished
```


# PHP example

Perform all steps related to JS example, make sure it works.

Configure example script, set variable `ethereumNodeURL`

```
nano example.php
```

Launch example

```
php -f example.php
```


```
PHP ERC20 test started
Token name: Golem Network Token
Token symbol: GNT
Token decimals: 18
Total supply: 1000000000.000000000000000000
Balance of the user '0xbdcd1cacdb0a7901ad40289521b3815e429d438b': 7146.489350919935504196
PHP ERC20 test finished
```
