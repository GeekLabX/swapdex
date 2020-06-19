export default {
    types: {
        Address: 'AccountId',
        TokenBalance: 'u128',
        TokenId: 'u128',
        Public: 'AccountId',
        Signature: 'MultiSignature',
        Offer: {
            offer_token: 'TokenId',
            offer_amount: 'TokenBalance',
            requested_token: 'TokenId',
            requested_amount: 'TokenBalance',
            nonce: 'u128'
        },
        SignedOffer: {
            offer: "Offer",
            signature: "Signature",
            signer: "AccountId"
        },
        TransferDetails: {
            amount: 'Balance',
            to: 'AccountId'
        },
        TokenTransferDetails: {
            amount: 'TokenBalance',
            to: 'AccountId'
        },
        TransferStatus: {
            amount: 'TokenBalance',
            to: 'AccountId',
            status: 'bool'
        },
        DelegatedTransferDetails: {
            amount: 'Balance',
            to: 'AccountId',
            nonce: 'u128'
        },
        SignedDelegatedTransferDetails: {
            transfer: 'DelegatedTransferDetails',
            signature: 'Signature',
            signer: 'AccountId'
        }
    }
}