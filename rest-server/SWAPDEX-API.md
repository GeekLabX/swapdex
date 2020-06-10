# OAX Parachain SWAP DEX REST API

This document describes the REST API implemented by the OAX SWAP DEX.

Currently supported functions:

[Create Order](#create-order)

[Query Order](#query-order)

[Cancel Order](#cancel-order)

[Get Order Book](#get-order-book)


## REST API Endpoints

### Create Order <a name="create-order"></a>

`POST /api/v1/order`

| Name          |    Type     | Mandatory |              Description               |
| ------------- | :---------: | :-------: | :------------------------------------: |
| symbol        |   STRING    |    YES    | symbol of currency pair. i.e. "OAX/ETH" |
| quantity      |   DECIMAL   |    YES    |                Quantity                |
| price         |   DECIMAL   |    YES    |                                        |
| makerSide     |    STRING     |    YES    |   BUY / SELL 
| orderType     |    STRING     |    YES    |    LIMIT |
| address       |    STRING     |    YES    |    Client Blockchain Address |
| signedOffer   | JSON-STRING |    YES    |          Signed offer Json             |

Example: A BUY side order for OAXETH means they are buying OAX in exchange for ETH

#### Create Order Request
`POST /api/v1/order`
```
body = {
	"symbol": "ETH/USDT",
	"quantity": 200,
	"price": 300.00,
	"makerSide": "BUY",
	"orderType": "LIMIT",
    "address": "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
	"signedOffer": {
		"offer": {
			"offer_token": 1,
			"offer_amount": 100,
			"requested_token": 0,
			"requested_amount": 200,
			"nonce": 1
		},
		"signature": "0x0138ddec49feb8dcbd7e899fca64bce5ddb15681aded6c8916ddb157838672c94e63f5a648bcc868554b888e541f7cc753c63bdbf3c5f517518206a65e67b34881",
		"signer": "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"
	}
}
```

#### Create Order Response

This is the message returned from the above HTTP POST request

```
{
    "orderId": 1,
    "symbol": "ETH/USDT",
    "quantity": 200,
    "price": 300,
    "orderType": "LIMIT",
    "makerSide": "BUY",
    "address": "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
    "signedOffer": {
        "offer": {
            "offer_token": 1,
            "offer_amount": 100,
            "requested_token": 0,
            "requested_amount": 200,
            "nonce": 1
        },
        "signature": "0x0138ddec49feb8dcbd7e899fca64bce5ddb15681aded6c8916ddb157838672c94e63f5a648bcc868554b888e541f7cc753c63bdbf3c5f517518206a65e67b34881",
        "signer": "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"
    },
    "status": "OPEN",
    "createTime": 1591754196.788,
    "updatedAt": "2020-06-10T01:56:36.792Z",
    "createdAt": "2020-06-10T01:56:36.792Z"
}
```

### Query Order <a name="query-order"></a>

`GET /api/v1/order/:orderId`

| Name    |  Type   | Mandatory | Description |
| ------- | :-----: | :-------: | :---------: |
| orderId | INTEGER |    YES    |             |

#### Query Order Request 

`GET /api/v1/order/1` 


#### Query Order Response

```
{
    "orderId": 1,
    "symbol": "ETH/USDT",
    "makerSide": "BUY",
    "quantity": "200.000000000000000000",
    "orderType": "LIMIT",
    "price": "300.000000000000000000",
    "status": "OPEN",
    "createTime": 1591754197,
    "transactTime": null,
    "signedOffer": "{\"offer\":{\"offer_token\":1,\"offer_amount\":100,\"requested_token\":0,\"requested_amount\":200,\"nonce\":1},\"signature\":\"0x0138ddec49feb8dcbd7e899fca64bce5ddb15681aded6c8916ddb157838672c94e63f5a648bcc868554b888e541f7cc753c63bdbf3c5f517518206a65e67b34881\",\"signer\":\"0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48\"}",
    "createdAt": "2020-06-10T01:56:36.000Z",
    "updatedAt": "2020-06-10T01:56:36.000Z"
}
```


### Cancel Order <a name="cancel-order"></a>

Only maker orders (status pending) can be canceled. An order fill (which is sent directly
to the blockchain) cannot be canceled. In order to build the signed message the client follows the steps below to generate a signature.

```
function cancelOrder(oid, keyringPair){
  cancel_message = {"cancel": oid}.toString()
  encoded_message = Util.stringToU8a(cancel_message);
  const signature = keyringPair.sign(encoded_message);
  return signature
}
```

`DELETE /api/v1/delete/:orderId`

| Name          |    Type     | Mandatory |                            Description                             |
| ------------- | :---------: | :-------: | :----------------------------------------------------------------: |
| address       |   STRING    |    YES    |
| orderId       |   INTEGER   |    YES    | Order ID returned in ACK Response of [Create Order](#create-order) |
| signedMessage | JSON-STRING |    NO     |                Signed proof that this is our order                 |


#### Cancel Order Request 

`/api/v1/delete/2`

```
body = {
    "orderId": 2,
    "address": "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
    "signature": "0xb2ab4c44ddcfeff4f7e104750d4bc6a28cd152876c0c54e2058867f1c73e0f0394f8df14c5e935c2e88bd0212169c1a42f0220db07881a8485bc719909925a8d"
}
```

#### Cancel Order Response

```
{
	"orderId": "d9s3h3kd07",
	"symbol": "OAXBTC",
	"quantity": 0.05,
	"price": 1000,
	"side": "BUY",
	"type": "LIMIT",
	"status": "CANCELED",
}
```

### Order Book <a name="get-order-book"></a>

`GET /api/v1/depth`

| Name   |  Type  | Mandatory |     Description     |
| ------ | :----: | :-------: | :-----------------: |
| symbol | STRING |    YES    |      CCY1/CCY2      |
| limit  |  INT   |    NO     | TODO not needed yet |


#### Order Book Request
```
/api/v1/depth/ETH%2fUSDT
```

#### Order Book Response

```
{
    "symbol": "OAX/ETH",
    "bids": [
        {
            "orderId": 2,
            "price": "330",
            "quantity": "300",
            "signedOffer": {..}
        },
        {
            "orderId": 1,
            "price": "300",
            "quantity": "200",
            "signedOffer": {..}
        },
        {
            "orderId": 3,
            "price": "88",
            "quantity": "50",
            "signedOffer": {..}
        }
    ],
    "asks": [
        {
            "orderId": 5,
            "price": "900",
            "quantity": "275",
            "signedOffer": {..}
        },
        {
            "orderId": 6,
            "price": "900",
            "quantity": "275",
            "signedOffer": {..}
        },
        {
            "orderId": 4,
            "price": "999",
            "quantity": "500",
            "signedOffer": {..}
        }
    ]
}
```

# UNUSED! 

### Update Order <a a name="update-order"></a>

`PUT /api/v1/order/:orderId`

| Name      |    Type     | Mandatory |              Description               |
| --------- | :---------: | :-------: | :------------------------------------: |
| symbol    |   STRING    |    YES    | symbol of currency pair. i.e. "OAXETH" |
| quantity  |   DECIMAL   |    YES    |                Quantity                |
| price     |   DECIMAL   |    YES    |                                        |
| side      |    ENUM     |    YES    |   See [Trade Side](#trade-side-enum)   |
| orderType |    ENUM     |    YES    |  See [Trade Types](#trade-types-enum)  |
| signedOffer  | JSON-STRING |    YES    |           Signed offer Json          |


## ENUM Definitions

_TODO_ - Note the Value column is not implemented yet but can be done so in future for optimizing DB storage
to not store strings and store integers instead.

### Trade Types <a name="trade-types-enum"></a>

_Only LIMIT is supported at the moment_

Other types are documented for possible future implementation

| Type            | Value |
| --------------- | ----- |
| LIMIT           | 1     |
| MARKET          | 2     |
| STOP_LOSS       | 3     |
| STOP_LOSS_LIMIT | 4     |

### Trade Side <a name="trade-side-enum"></a>

| Side | Value |
| ---- | ----- |
| BUY  | 1     |
| SELL | 2     |

### Trade Status <a name="trade-status-enum"></a>

| Status   | Value |
| -------- | ----- |
| OPEN     | 1     |
| FILLED   | 2     |
| CANCELED | 3     |