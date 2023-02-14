'use strict';
/* exported CollectionData */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const $mainViewTitle = document.querySelector('.card-text > p');
const $cardImageDiv = document.querySelector('.card');
const $buttonContainer = document.querySelector('.button-container');
const $modal = document.querySelector('.modal-box');
const $overlay = document.querySelector('.overlay');
const $modalText = document.querySelector('.modal-p');
const $modalImageDiv = document.querySelector('.modal-image');
const $modalImage = document.createElement('img');
const $miniMessageIconMatch = document.querySelector('#mini-message-icon-match');
const $miniMessageIconSuperlikes = document.querySelector('#mini-message-icon-superlikes');
const $mainViewImage = document.createElement('img');
const $matchesUl = document.querySelector('.matches-ul');
const $superlikesUl = document.querySelector('.superlikes-ul');
const $cssLoader = document.querySelector('.lds-spinner');
const $errorMessageNodeList = document.querySelectorAll('.no-results');
const $dataViewNodeList = document.querySelectorAll('[data-view]');
const $liNodeList = document.querySelectorAll('li');
let wallet;
function showFirstNFT() {
  cssLoaderActivate();
  wallet = chooseWallet();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + wallet.owner + wallet.addresses);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const { ownedNfts } = xhr.response;
    cssLoaderActivate();
    const randomInt = getRandomInt(ownedNfts.length);
    const nftData = {
      name: ownedNfts[randomInt].metadata.name,
      image: ownedNfts[randomInt].media[0].gateway,
      collectionName: ownedNfts[randomInt].contractMetadata.name,
      hasBeenRated: false
    };
    const collectionData = {
      collectionName: nftData.collectionName,
      likes: 0,
      dislikes: 0,
      superlikes: 0
    };
    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);
    $mainViewTitle.textContent = nftData.name;
    data.nftList = ownedNfts.map(nft => {
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
    if (!data.ratingsInfo[collectionData.collectionName]) {
      if ($mainViewImage.complete) { getCollectionPhotoURL(randomInt); }
      data.ratingsInfo[collectionData.collectionName] = collectionData;
    }
    data.nftList.splice(randomInt, 1);
  });
  xhr.send();
}
function showNewNFT() {
  cssLoaderActivate();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + wallet.owner);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    cssLoaderActivate();
    const { nftList } = data;
    if (nftList.length > 0) {
      const randomInt = getRandomInt(nftList.length);
      const nftName = nftList[randomInt].title;
      const nftImage = nftList[randomInt].image;
      const parentCollectionName = nftList[randomInt].name;
      const nftData = {
        name: nftName,
        image: nftImage,
        collectionName: parentCollectionName,
        hasBeenRated: false
      };
      $mainViewImage.src = nftImage;
      $mainViewTitle.textContent = nftName;
      data.nftVisible = nftData;
      const collectionData = {
        collectionName: nftData.collectionName,
        likes: 0,
        dislikes: 0,
        superlikes: 0
      };
      if (!data.ratingsInfo[collectionData.collectionName]) {
        if ($mainViewImage.complete) { getCollectionPhotoURL(randomInt); }
        data.ratingsInfo[collectionData.collectionName] = collectionData;
      }
      nftList.splice(randomInt, 1);
    }
  });
  xhr.send();
}
function handleRatingClick(event) {
  const target = event.target;
  if (target.matches('.fa-solid')) {
    const collectionData = {
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
      const matchInfo = findMatch(data);
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
}
function appendMatchCardLi(collectionData) {
  displayErrorMessages('matches');
  if (data.ratingsInfo[collectionData.collectionName].likes >= 1) {
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
function handleSwapClick(event) {
  const target = event.target;
  for (let i = 0; i < $dataViewNodeList.length; i++) {
    if (target.matches('#view-all') || target.matches('.message-icon')) {
      if ($dataViewNodeList[i].dataset.view !== 'matches') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'matches') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
    } else if (target.matches('.match-back-arrow')) {
      if ($dataViewNodeList[i].dataset.view !== 'swipe') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'swipe') {
        $dataViewNodeList[i].classList.remove('hidden');
      }
    } else if (target.matches('#continue-playing')) {
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
    } else if (target.matches('.fa-crown')) {
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
function getRandomInt(collectionLength) {
  const randomNumber = Math.random() * collectionLength;
  const integer = Math.floor(randomNumber);
  return integer;
}
function findMatch(data) {
  const { ratingsInfo } = data;
  let collectionData = {
    collectionName: '',
    likes: 0,
    dislikes: 0,
    superlikes: 0
  };
  for (const key in ratingsInfo) {
    for (const keys in ratingsInfo) {
      if (ratingsInfo[key] !== ratingsInfo[keys]) {
        if (ratingsInfo[key].likes < ratingsInfo[keys].likes || ratingsInfo[key].likes === null) {
          break;
        } else if (collectionData.collectionName === '' || ratingsInfo[key].likes > collectionData.likes) {
          collectionData = ratingsInfo[key];
          break;
        }
      }
    }
  }
  return collectionData;
}
function generateDomTree(tagName, attributes, children = []) {
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
function createMatchCardLi(key) {
  const { ratingsInfo, nftVisible, collectionPhotos } = data;
  let src = 'images/unavail.jpeg';
  if (collectionPhotos[nftVisible.collectionName]) {
    src = collectionPhotos[nftVisible.collectionName];
  }
  return generateDomTree('li', {}, [
    generateDomTree('div', { class: 'row' }, [
      generateDomTree('div', { class: 'column-full column-full-media-wrapper card-wrapper-padding' }, [
        generateDomTree('div', { class: 'card-wrapper' }, [
          generateDomTree('img', { class: 'card-image', src }), generateDomTree('div', { class: 'card-text-wrapper' }, [
            generateDomTree('div', { class: 'likes-box' }, [
              generateDomTree('p', { textContent: [ratingsInfo[key].likes + 1].toString() }), generateDomTree('i', { class: 'fa-solid fa-heart' })
            ]),
            generateDomTree('p', { textContent: ratingsInfo[key].collectionName })
          ])
        ])
      ])
    ])
  ]);
}
function getCollectionPhotoURL(randomInt) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opensea.io/api/v1/asset_contract/' + data.nftList[randomInt].address);
  xhr.setRequestHeader('X-API-KEY', '31e0cc50c1284711abc9837ebf5a5ecd');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const { status, response } = xhr;
    let parentCollectionPhoto;
    if (status === 429 || status === 401) {
      parentCollectionPhoto = 'images/unavail.jpeg';
    } else {
      parentCollectionPhoto = response.image_url;
    }
    data.collectionPhotos[data.nftVisible.collectionName] = parentCollectionPhoto;
  });
  xhr.send();
}
function chooseWallet() {
  const wallet = {
    owner: null,
    addresses: null
  };
  let addresses = '';
  const randomInt = getRandomInt(data.owner.length);
  wallet.owner = data.owner[randomInt].wallet;
  for (let i = 0; i < data.owner[randomInt].projectContract.length; i++) {
    addresses = addresses.concat('&contractAddresses[]=' + data.owner[randomInt].projectContract[i]);
  }
  wallet.addresses = addresses;
  data.owner.splice(randomInt, 1);
  return wallet;
}
function appendSuperlikesCardLi() {
  displayErrorMessages('superlikes');
  const $li = createSuperlikesCardLi();
  $superlikesUl.appendChild($li);
}
function createSuperlikesCardLi() {
  const { nftVisible } = data;
  let src = 'images/unavail.jpeg';
  if (nftVisible.image) {
    src = nftVisible.image;
  }
  return generateDomTree('li', {}, [generateDomTree('div', { class: 'row' }, [generateDomTree('div', { class: 'column-full column-full-media-wrapper card-wrapper-padding' }, [generateDomTree('div', { class: 'card-wrapper' }, [generateDomTree('img', { class: 'card-image', src }),
    generateDomTree('div', { class: 'card-text-wrapper' }, [generateDomTree('p', { textContent: nftVisible.name })])])])])]);
}
function cssLoaderActivate() {
  if ($cssLoader.className === 'lds-spinner') {
    $cssLoader.className = 'lds-spinner hidden';
  } else if ($cssLoader.className === 'lds-spinner hidden') {
    $cssLoader.className = 'lds-spinner';
  }
}
function displayErrorMessages(view) {
  for (let i = 0; i < $errorMessageNodeList.length; i++) {
    if ($errorMessageNodeList[i].classList.contains(view)) {
      $errorMessageNodeList[i].className = 'hidden';
    }
  }
}
// # sourceMappingURL=main.js.map
