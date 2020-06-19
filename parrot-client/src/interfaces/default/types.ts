// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { Struct } from '@polkadot/types/codec';
import { bool, u128 } from '@polkadot/types/primitive';
import { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import { AccountId, Balance } from '@polkadot/types/interfaces/runtime';

/** @name Address */
export interface Address extends AccountId {}

/** @name DelegatedTransferDetails */
export interface DelegatedTransferDetails extends Struct {
  readonly amount: Balance;
  readonly to: AccountId;
  readonly nonce: u128;
}

/** @name Offer */
export interface Offer extends Struct {
  readonly offer_token: TokenId;
  readonly offer_amount: TokenBalance;
  readonly requested_token: TokenId;
  readonly requested_amount: TokenBalance;
  readonly nonce: u128;
}

/** @name Public */
export interface Public extends AccountId {}

/** @name Signature */
export interface Signature extends MultiSignature {}

/** @name SignedDelegatedTransferDetails */
export interface SignedDelegatedTransferDetails extends Struct {
  readonly transfer: DelegatedTransferDetails;
  readonly signature: Signature;
  readonly signer: AccountId;
}

/** @name SignedOffer */
export interface SignedOffer extends Struct {
  readonly offer: Offer;
  readonly signature: Signature;
  readonly signer: AccountId;
}

/** @name TokenBalance */
export interface TokenBalance extends u128 {}

/** @name TokenId */
export interface TokenId extends u128 {}

/** @name TokenTransferDetails */
export interface TokenTransferDetails extends Struct {
  readonly amount: TokenBalance;
  readonly to: AccountId;
}

/** @name TransferDetails */
export interface TransferDetails extends Struct {
  readonly amount: Balance;
  readonly to: AccountId;
}

/** @name TransferStatus */
export interface TransferStatus extends Struct {
  readonly amount: TokenBalance;
  readonly to: AccountId;
  readonly status: bool;
}

export type PHANTOM_DEFAULT = 'default';
