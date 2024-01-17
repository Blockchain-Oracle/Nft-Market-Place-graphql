

import { Address,BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanclled as ItemCanclledEvent,
  itemList as itemListEvent,
  withdraw as withdrawEvent
} from "../generated/NftMarket/NftMarket"
import {
  ItemBought,
  ItemCanclled,
  itemList,
  withdraw,ActiveItem
} from "../generated/schema"
import { store, log } from "@graphprotocol/graph-ts"
export function handleItemBought(event: ItemBoughtEvent): void {

  let entity = new ItemBought(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.buyer = event.params.buyer
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  const activeItemId = id(event.params.nftAddress, event.params.tokenId)
  let activeItem = new ActiveItem(activeItemId)

  activeItem.buyer= event.params.buyer
  activeItem.save()

  log.info("store.remove ActiveItem: {}", [activeItemId])
  store.remove("ActiveItem", activeItemId)
}

export function handleItemCanclled(event: ItemCanclledEvent): void {
  let entity = new ItemCanclled(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.sender = event.params.sender
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  const activeItemId = id(event.params.nftAddress, event.params.tokenId)
  log.info("store.remove ActiveItem: {}", [activeItemId])
  store.remove("ActiveItem", activeItemId)
}

export function handleitemList(event: itemListEvent): void {
  let entity = new itemList(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.seller = event.params.seller
    entity.nftAddress = event.params.nftAddress
    entity.tokenId = event.params.tokenId
    entity.price = event.params.price
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()

    const activeItemId = id(event.params.nftAddress, event.params.tokenId)
    let activeItem = new ActiveItem(activeItemId)
    activeItem.seller = event.params.seller
    activeItem.nftAddress = event.params.nftAddress
    activeItem.tokenId = event.params.tokenId
    activeItem.price = event.params.price
    activeItem.blockNumber = event.block.number
    activeItem.blockTimestamp = event.block.timestamp
    activeItem.transactionHash = event.transaction.hash
    activeItem.save()
    log.info("ActiveItem.save(): {}", [activeItemId])
}

export function handlewithdraw(event: withdrawEvent): void {
  let entity = new withdraw(event.transaction.hash.concatI32(event.logIndex.toI32()))

  
  entity.sellerWithdraw = event.params.sellerWithdraw
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()

  const activeItemId = id(event.params.sellerWithdraw, event.params.amount)

  let activeItem = new ActiveItem(activeItemId)
  activeItem.amount= event.params.amount
  activeItem.sellerWithdraw=event.params.sellerWithdraw
  activeItem.blockNumber=event.block.number
  activeItem.transactionHash=event.transaction.hash
  activeItem.blockTimestamp=event.block.timestamp

  activeItem.save()

}


function id(nftAddress: Address, tokenId: BigInt): string {
  return nftAddress.toHexString() + "-" + tokenId.toHexString()
}