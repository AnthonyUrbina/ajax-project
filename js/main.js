var $mainViewTitle = document.querySelector('.card-text > p');
var $cardImageDiv = document.querySelector('.card');
var $buttonContainer = document.querySelector('.button-container');
var $modal = document.querySelector('.modal-box');
var $overlay = document.querySelector('.overlay');
var $modalText = document.querySelector('.modal-p');
var $modalImageDiv = document.querySelector('.modal-image');
var $miniMessageIcon = document.querySelector('#mini-message-icon');
var $mainViewImage = document.createElement('img');
var $modalImage = document.createElement('img');
var $ul = document.querySelector('ul');
var $dataViewNodeList = document.querySelectorAll('[data-view]');

var newCollection;
function showFirstNFT() {
  newCollection = chooseWallet();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + newCollection.owner + newCollection.addresses);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var randomInt = getRandomNumber(xhr.response.ownedNfts.length);
    var nftData = {
      name: xhr.response.ownedNfts[randomInt].metadata.name,
      image: xhr.response.ownedNfts[randomInt].media[0].gateway,
      collectionName: xhr.response.ownedNfts[randomInt].contractMetadata.name
    };
    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);
    $mainViewTitle.textContent = nftData.name;

    data.nftList = (xhr.response.ownedNfts);

    data.nftVisible = null;
    data.nftVisible = (nftData);

    nftData.collectionImage = getCollectionPhotoURL(randomInt);

    data.nftList.splice(randomInt, 1);
  });
  xhr.send();
}

function showNewNFT() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=' + newCollection.owner);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    if (data.nftList.length > 0) {
      var nftData = {};
      var i = getRandomNumber(data.nftList.length);

      var nftName = data.nftList[i].title;
      var nftImage = data.nftList[i].media[0].gateway;
      var parentCollectionName = data.nftList[i].contractMetadata.name;
      getCollectionPhotoURL(i);

      $mainViewImage.src = nftImage;
      $mainViewTitle.textContent = nftName;

      nftData.name = nftName;
      nftData.image = nftImage;
      nftData.collectionName = parentCollectionName;

      data.nftVisible = null;
      data.nftVisible = (nftData);
      data.nftList.splice(i, 1);
    }
  });
  xhr.send();

}

function handleRatingClick(event) {
  if (event.target.matches('.fa-solid')) {
    var collectionData = {
      collectionName: data.nftVisible.collectionName,
      collectionPhoto: data.nftVisible.collectionImage,
      likes: null,
      dislikes: null
    };

    if (data.ratingsInfo[collectionData.collectionName] === undefined) {
      data.ratingsInfo[collectionData.collectionName] = collectionData;
    }
    if (data.nftList.length >= 0) {
      if (event.target.matches('.fa-heart')) {
        appendMatchCardLi(collectionData);
      } else if (event.target.matches('.fa-star')) {
        appendMatchCardLi(collectionData);
        data.superliked.push(data.nftVisible);
      } else if (event.target.matches('.fa-thumbs-down')) {
        data.ratingsInfo[collectionData.collectionName].dislikes++;
      }
    }

    if (data.ratingsInfo[collectionData.collectionName].likes !== null) {
      $miniMessageIcon.className = '';
    }
    if (data.nftList.length === 0) {
      var matchInfo = findMatch(data);
      $modalText.textContent = ['You and ' + matchInfo.collectionName + ' have liked each other'];
      $modalImage.src = matchInfo.collectionPhoto;
      $modalImageDiv.appendChild($modalImage);
      $modal.className = 'modal-box';
      $overlay.className = 'overlay';
    } else {
      showNewNFT();
    }
  }
}

function handleSwapClick(event) {
  for (var i = 0; i < $dataViewNodeList.length; i++) {
    if (event.target.matches('#view-all') || event.target.matches('.message-icon')) {
      if ($dataViewNodeList[i].dataset.view !== 'matches') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'matches') {
        var className = $dataViewNodeList[i].className;
        $dataViewNodeList[i].className = className.replace(/ hidden/g, '');
      }
    } else if (event.target.matches('.match-back-arrow')) {
      if ($dataViewNodeList[i].dataset.view !== 'swipe') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'swipe') {
        className = $dataViewNodeList[i].className;
        $dataViewNodeList[i].className = className.replace(/ hidden/g, '');
      }
    } else if (event.target.matches('#continue-playing')) {
      if ($dataViewNodeList[i].dataset.view !== 'swipe') {
        $dataViewNodeList[i].className += ' hidden';
      } else if ($dataViewNodeList[i].dataset.view === 'swipe') {
        className = $dataViewNodeList[i].className;
        $dataViewNodeList[i].className = className.replace(/ hidden/g, '');
      }
      if (i === $dataViewNodeList.length - 1) {
        var $liNodeList = document.querySelectorAll('li');
        for (var j = 0; j < $liNodeList.length; j++) {
          $ul.removeChild($liNodeList[j]);
        }
        $miniMessageIcon.className = 'hidden';
        data.ratingsInfo = {};
        showFirstNFT();
      }
    }
  }
}
window.addEventListener('DOMContentLoaded', showFirstNFT);
$buttonContainer.addEventListener('click', handleRatingClick);
window.addEventListener('click', handleSwapClick);

function getRandomNumber(collectionLength) {
  var randomNumber = Math.random() * collectionLength;
  var integer = Math.floor(randomNumber);
  return integer;
}

function findMatch(data) {
  var container = null;
  for (var key in data.ratingsInfo) {
    for (var keys in data.ratingsInfo) {
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

function generateDomTree(tagName, attributes, children) {
  if (!children) {
    children = [];
  }
  var element = document.createElement(tagName);
  for (var key in attributes) {
    if (key === 'textContent') {
      element.textContent = attributes.textContent;
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  for (var i = 0; i < children.length; i++) {
    element.append(children[i]);
  }
  return element;
}

function createMatchCardLi(key) {
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
            { class: 'card-image', src: data.nftVisible.collectionImage }),
          generateDomTree(
            'div',
            { class: 'card-text-wrapper' },
            [generateDomTree('div',
              { class: 'likes-box' },
              [generateDomTree(
                'p',
                { textContent: data.ratingsInfo[key].likes + 1 }),
              generateDomTree('i', { class: 'fa-solid fa-heart' })]), generateDomTree('p', { textContent: data.ratingsInfo[key].collectionName })])])]
      )])]);
}

function getCollectionPhotoURL(i) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opensea.io/api/v1/asset_contract/' + data.nftList[i].contract.address);
  xhr.setRequestHeader('X-API-KEY', '31e0cc50c1284711abc9837ebf5a5ecd');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var parentCollectionPhoto = xhr.response.collection.image_url;
    data.nftVisible.collectionImage = parentCollectionPhoto;
  });
  xhr.send();
}

function appendMatchCardLi(collectionData) {
  if (parseInt(data.ratingsInfo[collectionData.collectionName].likes) >= 1) {
    var $liNodeList = document.querySelectorAll('li');
    for (var i = 0; i < $liNodeList.length; i++) {
      var $liTextContent = $liNodeList[i].textContent.replace(/[0-9]/g, '');
      if ($liTextContent === data.nftVisible.collectionName) {
        var $li = createMatchCardLi(data.nftVisible.collectionName);
        data.ratingsInfo[collectionData.collectionName].likes++;
        $ul.replaceChild($li, $liNodeList[i]);
      }
    }

  } else {
    $li = createMatchCardLi(data.nftVisible.collectionName);
    data.ratingsInfo[collectionData.collectionName].likes++;
    $ul.appendChild($li);
  }
}

function chooseWallet() {
  var container = {};
  var addresses = '';
  var randomInt = getRandomNumber(data.owner.length);
  container.owner = data.owner[randomInt].wallet;

  for (var i = 0; i < data.owner[randomInt].projectContract.length; i++) {
    addresses = addresses.concat('&contractAddresses[]=' + data.owner[randomInt].projectContract[i]);
  }
  container.addresses = addresses;
  data.owner.splice(randomInt, 1);
  return container;
}
