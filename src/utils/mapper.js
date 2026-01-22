import { parseDate, parseDateTime, parseDimensions } from "./parser"

/**************************************************************************************************/

/**
 * @file        mapper.js
 * @description Utility functions for the application.
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     29/09/2025
 * @license     -- tbd
 */

export function artworkMapper(artwork) {
  return {
    artMedium: artwork.art_medium,
    artistFirstName: artwork.artist_first_name,
    artistLastName: artwork.artist_last_name,
    artistsId: artwork.artists_id,
    id: artwork.artwork_id,
    title: artwork.artwork_name,
    authenticated: artwork.authenticated,
    authorFirstName: artwork.author_first_name,
    authorLastName: artwork.author_last_name,
    dateOfProduction: parseDate(artwork.date_of_production),
    deleted: artwork.deleted,
    description: artwork.description,
    dimensions: parseDimensions(artwork.dimensions),
    dngReference: artwork.dng_reference,
    url: artwork.jpeg_reference,
    ownerFirstName: artwork.owner_first_name,
    ownerId: artwork.owner_id,
    ownerLastName: artwork.owner_last_name,
    price: artwork.price,
    publicRecord: artwork.public_record,
    tags: artwork.tags,
    toggle: artwork.toggle,
    verified: artwork.verified
  }
}

export function offerSentMapper(offer) {
  return {
    offerId: offer.offer_id,
    artworkId: offer.artworkid,
    artworkName: offer.artwork_name,
    artistFirstName: offer.artist_first_name,
    artistLastName: offer.artist_last_name, 
    ownerId: offer.owner_id,
    ownerFirstName: offer.owner_first_name,
    ownerLastName: offer.owner_last_name,
    price: offer.price,
    status: offer.status,
    createdAt: parseDateTime(offer.date),
  }
}

export function artworkWithOffersMapper(offer) {
  return {
    artworkId: offer.artworkid,
    artworkName: offer.artwork_name,
    artistFirstName: offer.artist_first_name,
    artistLastName: offer.artist_last_name,
    offerCount: offer.offer_count,
    latestOfferDate: parseDateTime(offer.latest_offer_date)
  }
}


export function offerReceivedOffersMapper(offer) {
  return {
    buyerFirstName: offer.buyer_first_name,
    buyerLastName: offer.buyer_last_name,
    buyerId: offer.buyer_id,
    date: parseDateTime(offer.date),
    offerId: offer.offerid,
    price: offer.price,
    status: offer.status
  }
}


export function artworkDetailMapper(artwork) {
  return {
    artMedium: artwork.art_medium,
    artistsId: artwork.artists_id,
    artworkId: artwork.artwork_id,
    artworkName: artwork.artwork_name,
    authenticated: artwork.authenticated,
    authorFirstName: artwork.author_first_name,
    authorLastName: artwork.author_last_name,
    createdAt: parseDateTime(artwork.created_at),
    dateOfProduction: parseDate(artwork.date_of_production),
    deleted: artwork.deleted,
    description: artwork.description,
    dimensions: parseDimensions(artwork.dimensions),
    dngReference: artwork.dng_reference,
    jpegReference: artwork.jpeg_reference,
    ownerId: artwork.owner_id,
    publicRecord: artwork.public_record,
    tags: artwork.tags,
    toggle: artwork.toggle,
    verified: artwork.verified,
    price: artwork.market_price
  }
}


export function profileMapper(profile) {
  return {
    userId: profile.user_id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    bio: profile.description,
    image: profile.image,
    count: profile.count
  }
}