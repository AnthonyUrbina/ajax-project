/* exported CollectionData */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

const $mainViewTitle = document.querySelector('.card-text > p')!;
const $cardImageDiv = document.querySelector('.card')!;
const $buttonContainer = document.querySelector('.button-container')!;
const $modal = document.querySelector('.modal-box')!;
const $overlay = document.querySelector('.overlay')!;
const $modalText = document.querySelector('.modal-p')!;
const $modalImageDiv = document.querySelector('.modal-image')!;
const $miniMessageIconMatch = document.querySelector('#mini-message-icon-match')!;
const $miniMessageIconSuperlikes = document.querySelector('#mini-message-icon-superlikes')!;
const $mainViewImage = document.createElement('img')!;
const $modalImage = document.createElement('img')!;
const $matchesUl = document.querySelector('.matches-ul')!;
const $superlikesUl = document.querySelector('.superlikes-ul')!;
const $dataViewNodeList = document.querySelectorAll<HTMLElement>('[data-view]')!;
const $cssLoader = document.querySelector('.lds-spinner')!;

interface Container {
  owner: string | null,
  addresses: string | null
}

let newCollection: Container;

interface CollectionData {
  collectionName: string,
  likes: number
  dislikes: number
  superlikes: number
}

interface NftData {
  name: string,
  image: string,
  collectionName: string,
  hasBeenRated?: boolean
}

function showFirstNFT() {
  cssLoaderActivate();
  newCollection = chooseWallet();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + newCollection.owner + newCollection.addresses);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    cssLoaderActivate();
    const randomInt = getRandomNumber(xhr.response.ownedNfts.length);
    const nftData = {
      name: xhr.response.ownedNfts[randomInt].metadata.name,
      image: xhr.response.ownedNfts[randomInt].media[0].gateway,
      collectionName: xhr.response.ownedNfts[randomInt].contractMetadata.name,
      hasBeenRated: false
    };

    const collectionData: CollectionData = {
      collectionName: nftData.collectionName,
      likes: 0,
      dislikes: 0,
      superlikes: 0
    };

    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);
    $mainViewTitle.textContent = nftData.name;

    interface OpenseaData {
      metadata: {name: string},
      media: [{gateway: string}],
      contractMetadata: {name: string},
      title: string,
      contract: {address: string}
    }

    data.nftList = xhr.response.ownedNfts.map((nft: OpenseaData) => {
      // console.log(nft);
      const { metadata, media, contractMetadata, title, contract } = nft;
      const image = media[0].gateway;
      const { address } = contract;
      const { name } = metadata;
      const collectionName = contractMetadata.name;

      const contractNFT = {
        title,
        name,
        collectionName,
        image,
        address
      };

      return contractNFT;
    });

    data.nftVisible = nftData;

    if (!data.ratingsInfo[collectionData.collectionName as keyof CollectionData]) {
      getCollectionPhotoURL(randomInt);
      data.ratingsInfo[collectionData.collectionName] = collectionData;
    }

    data.nftList.splice(randomInt, 1);
  });
  xhr.send();
}

function showNewNFT() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + newCollection.owner);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (data.nftList.length > 0) {
      const randomInt = getRandomNumber(data.nftList.length);

      const nftName = data.nftList[randomInt].title;
      const nftImage = data.nftList[randomInt].image;
      const parentCollectionName = data.nftList[randomInt].name;

      const nftData: NftData = {
        name: nftName,
        image: nftImage,
        collectionName: parentCollectionName,
        hasBeenRated: false
      };

      $mainViewImage.src = nftImage;
      $mainViewTitle.textContent = nftName;

      data.nftVisible = nftData;

      const collectionData: CollectionData = {
        collectionName: nftData.collectionName,
        likes: 0,
        dislikes: 0,
        superlikes: 0
      };

      if (!data.ratingsInfo[collectionData.collectionName]) {
        throttle(getCollectionPhotoURL(randomInt), 3000);
        data.ratingsInfo[collectionData.collectionName] = collectionData;
      }
      data.nftList.splice(randomInt, 1);
    }

  });
  xhr.send();
}

const handleRatingClick = throttle(
  function handleRatingClick(event: { target: HTMLInputElement }) {
  // console.log(event);
    const target = event.target as HTMLInputElement;
    if (target.matches('.fa-solid')) {
      cssLoaderActivate();
      const collectionData: CollectionData = {
        collectionName: data.nftVisible.collectionName,
        likes: 0,
        dislikes: 0,
        superlikes: 0
      };

      if (data.nftVisible.hasBeenRated === false && data.nftVisible !== null) {
        showNewNFT();
        if (target.matches('.fa-heart')) {
          appendMatchCardLi(collectionData);
        } else if (target.matches('.fa-star')) {
          appendMatchCardLi(collectionData);
          data.superliked.push(data.nftVisible);
          data.ratingsInfo[collectionData.collectionName].superlikes++;
          appendSuperlikesCardLi();
        } else if (target.matches('.fa-thumbs-down')) {
          data.ratingsInfo[collectionData.collectionName].dislikes++;
        }
        data.nftVisible.hasBeenRated = true;
      }

      if (data.nftList.length === 0) {
        const matchInfo: CollectionData = findMatch(data);
        let src = 'images/unavail.jpeg';
        if (data.collectionPhotos[matchInfo.collectionName]) {
          src = data.collectionPhotos[matchInfo.collectionName];
        }
        $modalText.textContent = 'You and ' + matchInfo.collectionName + ' have liked each other.';
        $modalImage.src = src;
        $modalImageDiv.appendChild($modalImage);
        $modal.className = 'modal-box';
        $overlay.className = 'overlay';
      }

      if (data.ratingsInfo[collectionData.collectionName].likes !== null) {
        $miniMessageIconMatch.className = '';
        $miniMessageIconSuperlikes.className = '';
      }
    }
  }, 2000);

function appendMatchCardLi(collectionData: CollectionData) {
  if (data.ratingsInfo[collectionData.collectionName].likes >= 1) {
    const $liNodeList = document.querySelectorAll('li');
    for (let i = 0; i < $liNodeList.length; i++) {
      const $liTextContent = $liNodeList[i].textContent.replace(/[0-9]/g, '');
      if ($liTextContent === data.nftVisible.collectionName) {
        const $li = createMatchCardLi(data.nftVisible.collectionName);
        data.ratingsInfo[collectionData.collectionName].likes++;
        $matchesUl.replaceChild($li, $liNodeList[i]);
      }
    }
  } else {
    const $li = createMatchCardLi(data.nftVisible.collectionName);
    data.ratingsInfo[collectionData.collectionName].likes++;
    $matchesUl.appendChild($li);
  }
}

function handleSwapClick(event: {target: HTMLInputElement}) {
  for (let i = 0; i < $dataViewNodeList.length; i++) {
    if (event.target.matches('#view-all') || event.target.matches('.message-icon')) {
      if ($dataViewNodeList[i].dataset.view !== 'matches') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'matches') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
    } else if (event.target.matches('.match-back-arrow')) {
      if ($dataViewNodeList[i].dataset.view !== 'swipe') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'swipe') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
    } else if (event.target.matches('#continue-playing')) {
      if ($dataViewNodeList[i].dataset.view !== 'swipe') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'swipe') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
      if (i === $dataViewNodeList.length - 1) {
        const $liNodeList = document.querySelectorAll('li');
        for (let j = 0; j < $liNodeList.length; j++) {
          if (j < ($liNodeList.length - data.superliked.length)) {
            $matchesUl.removeChild($liNodeList[j]);
          } else {
            $superlikesUl.removeChild($liNodeList[j]);
          }
        }
        $miniMessageIconMatch.className = 'hidden';
        $miniMessageIconSuperlikes.className = 'hidden';
        data.ratingsInfo = {};
        showFirstNFT();
      }
    } else if (event.target.matches('.fa-crown')) {
      if ($dataViewNodeList[i].dataset.view !== 'superlikes') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'superlikes') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
    }
  }
}
window.addEventListener('DOMContentLoaded', showFirstNFT);
$buttonContainer.addEventListener('click', handleRatingClick);
document.addEventListener('click', handleSwapClick);

function getRandomNumber(collectionLength: number) {
  const randomNumber = Math.random() * collectionLength;
  const integer = Math.floor(randomNumber);
  return integer;
}

function findMatch(data: Data): CollectionData {
  let container = null;
  for (const key in data.ratingsInfo) {
    for (const keys in data.ratingsInfo) {
      if (data.ratingsInfo[key] !== data.ratingsInfo[keys]) {
        if (data.ratingsInfo[key].likes < data.ratingsInfo[keys].likes || data.ratingsInfo[key].likes === null) {
          break;
        } else if (container === null || data.ratingsInfo[key].likes > container.likes) {
          container = data.ratingsInfo[key];
          break;
        }
      }
    }
  }
  return container;
}

interface Attributes {
  textContent?: string,
  class?: string,
  src?: string
}

function generateDomTree(tagName: string, attributes: Attributes | Record<string, never>, children?) {
  if (!children) {
    children = [];
  }
  const element = document.createElement(tagName);
  for (const key in attributes) {
    if (key === 'textContent') {
      element.textContent = attributes.textContent ?? 'Error Loading Text';
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  for (let i = 0; i < children.length; i++) {
    element.append(children[i]);
  }
  return element;
}

function createMatchCardLi(key: string) {
  let src = 'images/unavail.jpeg';
  if (data.collectionPhotos[data.nftVisible.collectionName]) {
    src = data.collectionPhotos[data.nftVisible.collectionName];
  }
  return generateDomTree(
    'li', {}, [
      generateDomTree(
        'div', { class: 'row' }, [
          generateDomTree(
            'div', { class: 'column-full column-full-media-wrapper card-wrapper-padding' }, [
              generateDomTree(
                'div', { class: 'card-wrapper' }, [
                  generateDomTree('img', { class: 'card-image', src }), generateDomTree('div', { class: 'card-text-wrapper' }, [
                    generateDomTree(
                      'div', { class: 'likes-box' }, [
                        generateDomTree(
                          'p', { textContent: [data.ratingsInfo[key].likes + 1].toString() }), generateDomTree('i', { class: 'fa-solid fa-heart' })]),
                    generateDomTree('p', { textContent: data.ratingsInfo[key].collectionName })])])]
          )])]);

}

function getCollectionPhotoURL(randomInt: number): void {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opensea.io/api/v1/asset_contract/' + data.nftList[randomInt].address);
  xhr.setRequestHeader('X-API-KEY', '31e0cc50c1284711abc9837ebf5a5ecd');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    let parentCollectionPhoto: string;

    if (xhr.status === 429 || xhr.status === 401) {
      parentCollectionPhoto = 'images/unavail.jpeg';
    } else {
      parentCollectionPhoto = xhr.response.image_url;
    }
    data.collectionPhotos[data.nftVisible.collectionName] = parentCollectionPhoto;
  });
  xhr.send();
}

interface Callback { (event: { target: HTMLInputElement }): void}
interface Callback2 { (randomInt: number): void }

function throttle(callback : Callback | Callback2, limit: number) {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this);
      waiting = true;
      setTimeout(function () {
        cssLoaderActivate();
        waiting = false;
      }, limit);
    }
  };
}

function chooseWallet() {
  const container: Container = {
    owner: null,
    addresses: null
  };
  let addresses = '';
  const randomInt = getRandomNumber(data.owner.length);
  container.owner = data.owner[randomInt].wallet;
  for (let i = 0; i < data.owner[randomInt].projectContract.length; i++) {
    addresses = addresses.concat('&contractAddresses[]=' + data.owner[randomInt].projectContract[i]);
  }
  container.addresses = addresses;
  data.owner.splice(randomInt, 1);
  return container;
}

function appendSuperlikesCardLi() {
  if ($superlikesUl === null) return;

  const $li = createSuperlikesCardLi();
  $superlikesUl.appendChild($li);
}

function createSuperlikesCardLi() {
  let src = 'images/unavail.jpeg';
  if (data.nftVisible.image) {
    src = data.nftVisible.image;
  }
  return generateDomTree(
    'li',
    {},
    [generateDomTree(
      'div',
      { class: 'row' },
      [generateDomTree(
        'div',
        { class: 'column-full column-full-media-wrapper card-wrapper-padding' },
        [generateDomTree(
          'div',
          { class: 'card-wrapper' },
          [generateDomTree('img',
            { class: 'card-image', src }),
          generateDomTree(
            'div',
            { class: 'card-text-wrapper' },
            [generateDomTree('p', { textContent: data.nftVisible.name })])])]
      )])]);
}

function cssLoaderActivate() {
  if ($cssLoader === null) return;
  if ($cssLoader.className === 'lds-spinner') {
    $cssLoader.className = 'lds-spinner hidden';
  } else if ($cssLoader.className === 'lds-spinner hidden') {
    if ($cssLoader === null) return;
    $cssLoader.className = 'lds-spinner';
  }
}
