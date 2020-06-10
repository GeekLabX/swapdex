# OAX Parachain SWAP DEX REST API

This document describes the REST API implemented by the OAX SWAP DEX.

Currently supported functions:

[Create Order](#create-order)

[Query Order](#query-order)

[Cancel Order](#cancel-order)

[Get Order Book](#get-order-book)

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

## REST API Endpoints

### Create Order <a name="create-order"></a>

`POST /api/v1/order`

| Name          |    Type     | Mandatory |              Description               |
| ------------- | :---------: | :-------: | :------------------------------------: |
| symbol        |   STRING    |    YES    | symbol of currency pair. i.e. "OAXETH" |
| quantity      |   DECIMAL   |    YES    |                Quantity                |
| price         |   DECIMAL   |    YES    |                                        |
| side          |    ENUM     |    YES    |   See [Trade Side](#trade-side-enum)   |
| orderType     |    ENUM     |    YES    |  See [Trade Types](#trade-types-enum)  |
| makerClientId |   STRING    |    YES    |          the makers client ID          |
| makerSig      | JSON-STRING |    YES    |          Signed message hash           |

Example: A BUY side order for OAXETH means they are buying OAX in exchange for ETH

#### Create Order Response ACK

This is the message returned from the above HTTP POST request

```
{
    "orderId": 2,
    "symbol": "ETHUSDT",
    "quantity": 200,
    "price": 300,
    "orderType": "LIMIT",
    "makerSide": "BUY",
    "makerSig": "eth 2.0",
    "status": "OPEN",
    "createTime": 1591070125.238,
    "updatedAt": "2020-06-02T03:55:25.239Z",
    "createdAt": "2020-06-02T03:55:25.239Z"
}
```

### Query Order <a name="query-order"></a>

`GET /api/v1/order/3283654`

| Name    |  Type   | Mandatory | Description |
| ------- | :-----: | :-------: | :---------: |
| orderId | INTEGER |    YES    |             |

#### Query Order Response

```
{
    "orderId": 2,
    "symbol": "ETHUSDT",
    "makerSide": "BUY",
    "takerSide": null,
    "quantity": "250",
    "orderType": "LIMIT",
    "price": "315",
    "status": "OPEN",
    "createTime": 1591070125,
    "transactTime": null,
    "makerSig": "*signed message*",
    "takerSig": null,
    "createdAt": "2020-06-02T03:55:25.000Z",
    "updatedAt": "2020-06-02T03:57:28.000Z"
}
```

### Update Order <a a name="update-order"></a>

`PUT /api/v1/order/:orderId`

| Name      |    Type     | Mandatory |              Description               |
| --------- | :---------: | :-------: | :------------------------------------: |
| symbol    |   STRING    |    YES    | symbol of currency pair. i.e. "OAXETH" |
| quantity  |   DECIMAL   |    YES    |                Quantity                |
| price     |   DECIMAL   |    YES    |                                        |
| side      |    ENUM     |    YES    |   See [Trade Side](#trade-side-enum)   |
| orderType |    ENUM     |    YES    |  See [Trade Types](#trade-types-enum)  |
| makerSig  | JSON-STRING |    YES    |          Signed message hash           |

### Cancel Order <a name="cancel-order"></a>

Only maker orders (status pending) can be canceled. An order fill (which is sent directly
to the blockchain) cannot be canceled.

`DELETE /api/v1/order`

| Name          |    Type     | Mandatory |                            Description                             |
| ------------- | :---------: | :-------: | :----------------------------------------------------------------: |
| symbol        |   STRING    |    YES    |
| orderId       |   INTEGER   |    YES    | Order ID returned in ACK Response of [Create Order](#create-order) |
| signedMessage | JSON-STRING |    NO     |                Signed proof that this is our order                 |

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

#### Order Book Response

```
{
    "symbol": "OAX/ETH",
    "bids": [
        {
            "orderId": 2,
            "price": "330",
            "quantity": "300",
            "makerSig": "*signed message*"
        },
        {
            "orderId": 1,
            "price": "300",
            "quantity": "200",
            "makerSig": "*signed message*"
        },
        {
            "orderId": 3,
            "price": "88",
            "quantity": "50",
            "makerSig": "*signed message*"
        }
    ],
    "asks": [
        {
            "orderId": 5,
            "price": "900",
            "quantity": "275",
            "makerSig": "*signed message*"
        },
        {
            "orderId": 6,
            "price": "900",
            "quantity": "275",
            "makerSig": "*signed message*"
        },
        {
            "orderId": 4,
            "price": "999",
            "quantity": "500",
            "makerSig": "*signed message*"
        }
    ]
}
```
