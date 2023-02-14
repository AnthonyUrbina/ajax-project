/* exported Attributes Data OpenseaData Wallet */

interface Attributes {
  [key: string]: string
}

interface CollectionData {
  collectionName: string,
  likes: number
  dislikes: number
  superlikes: number
}

interface RatingsInfo {
  [key: string]: CollectionData
}

interface CollectionPhotos {
  [key: string]: string
}

interface NftList {
  title: string,
  name: string,
  collectionName: string,
  image: string,
  address: number
}

interface NftData {
  name: string,
  image: string,
  collectionName: string,
  hasBeenRated?: boolean
}

interface Data {
  nftVisible: NftData
  ratingsInfo: RatingsInfo | Record<string, never>
  superliked: NftData[],
  nftList: NftList[],
  collectionPhotos: CollectionPhotos | Record<string, never>,
  owner: { wallet: string, projectContract: string[] }[]
}

interface OpenseaData {
  metadata: { name: string },
  media: [{ gateway: string }],
  contractMetadata: { name: string },
  title: string,
  contract: { address: string }
}

interface Wallet {
  owner: string | null,
  addresses: string | null
}
