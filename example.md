##交易查询返回用例
###eth_getTransactionByHash
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0xa2efbdf6087c65916e3fbe3fc847e1a12c680ae0bd8e4f6777fe29796f49c00e",
    "blockNumber": "0x3063d7",
    "from": "0x3e32fe42434a039ad630c4cf67e5378a9aae6e36",
    "gas": "0x33450",
    "gasPrice": "0x3b9aca00",
    "hash": "0x4746f9a13b15faa8004e34283b905332839170b086871017c698519e10cf3026",
    "input": "0xa9059cbb000000000000000000000000037c75d2b9856e2a47df0c8c9e8a065ad94b912a0000000000000000000000000000000000000000000000000000000000000f8c",
    "nonce": "0x6e1",
    "to": "0xcc79cb5023a4896547f4b00a2289d1ed4098ce13",
    "transactionIndex": "0x31",
    "value": "0x0",
    "v": "0x1b",
    "r": "0x5fd36fd06c6e938453d98c54c3909f5a460033af2beb264e26b29cdbe13d0c7f",
    "s": "0x52b69fd9d2a071b2c47791b9994c2282ffebb4e2ee642b6ff64b057d22ef483d"
  }
}
```

##eth_getTransactionReceipt
```json
{
 "jsonrpc": "2.0",
 "id": 1,
 "result": {
  "blockHash": "0x16533f5d8faa779a088ae47d1c9db9dbc4186e96b5118bca5acefe04b9931e26",
  "blockNumber": "0x31db92",
  "contractAddress": null,
  "cumulativeGasUsed": "0x1bcb99",
  "from": "0x3e32fe42434a039ad630c4cf67e5378a9aae6e36",
  "gasUsed": "0x8de5",
  "logs": [
   {
    "address": "0xcc79cb5023a4896547f4b00a2289d1ed4098ce13",
    "topics": [
     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
     "0x0000000000000000000000003e32fe42434a039ad630c4cf67e5378a9aae6e36",
     "0x000000000000000000000000f58610cc21b6568aee8b2c1af667dfdc94219057"
    ],
    "data": "0x00000000000000000000000000000000000000000000000000000000000186a0",
    "blockNumber": "0x31db92",
    "transactionHash": "0x4eb8df0dee158e659e31d6fafb88da36e0b905065f86fd4eb1475608832bedd1",
    "transactionIndex": "0xa",
    "blockHash": "0x16533f5d8faa779a088ae47d1c9db9dbc4186e96b5118bca5acefe04b9931e26",
    "logIndex": "0xa",
    "removed": false
   }
  ],
  "logsBloom": "0x00002000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000400000000000000000000000000000000020001000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000100000000",
  "status": "0x1",
  "to": "0xcc79cb5023a4896547f4b00a2289d1ed4098ce13",
  "transactionHash": "0x4eb8df0dee158e659e31d6fafb88da36e0b905065f86fd4eb1475608832bedd1",
  "transactionIndex": "0xa"
 }
}
```
