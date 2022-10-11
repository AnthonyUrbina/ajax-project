var $mainViewTitle = document.querySelector('.card-text > p');
var $cardImageDiv = document.querySelector('.card');
var $buttonContainer = document.querySelector('.button-container');
var $modal = document.querySelector('.modal-box');
var $overlay = document.querySelector('.overlay');
var $modalText = document.querySelector('.modal-p');
var $modalImageDiv = document.querySelector('.modal-image');
var $miniMessageIconMatch = document.querySelector('#mini-message-icon-match');
var $miniMessageIconSuperlikes = document.querySelector('#mini-message-icon-superlikes');
var $mainViewImage = document.createElement('img');
var $modalImage = document.createElement('img');
var $matchesUl = document.querySelector('.matches-ul');
var $superlikesUl = document.querySelector('.superlikes-ul');
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
      collectionName: xhr.response.ownedNfts[randomInt].contractMetadata.name,
      hasBeenRated: false
    };

    var collectionData = {
      collectionName: nftData.collectionName,
      likes: null,
      dislikes: null
    };
    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);
    $mainViewTitle.textContent = nftData.name;

    data.nftList = (xhr.response.ownedNfts);

    data.nftVisible = null;
    data.nftVisible = (nftData);

    if (data.ratingsInfo[collectionData.collectionName] === undefined) {
      getCollectionPhotoURL(randomInt);
      data.ratingsInfo[collectionData.collectionName] = collectionData;
    }

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

      $mainViewImage.src = nftImage;
      $mainViewTitle.textContent = nftName;

      nftData.name = nftName;
      nftData.image = nftImage;
      nftData.collectionName = parentCollectionName;
      nftData.hasBeenRated = false;

      data.nftVisible = null;
      data.nftVisible = (nftData);

      var collectionData = {
        collectionName: nftData.collectionName,
        likes: null,
        dislikes: null
      };
      if (data.ratingsInfo[collectionData.collectionName] === undefined) {
        getCollectionPhotoURL(i);
        data.ratingsInfo[collectionData.collectionName] = collectionData;
      }
      data.nftList.splice(i, 1);
    }

  });
  xhr.send();

}

function handleRatingClick(event) {
  if (event.target.matches('.fa-solid')) {
    var collectionData = {
      collectionName: data.nftVisible.collectionName,
      likes: null,
      dislikes: null
    };

    if (data.nftVisible.hasBeenRated === false && data.nftVisible !== null) {
      showNewNFT();
      if (event.target.matches('.fa-heart')) {
        appendMatchCardLi(collectionData);
      } else if (event.target.matches('.fa-star')) {
        appendMatchCardLi(collectionData);
        data.superliked.push(data.nftVisible);
        data.ratingsInfo[collectionData.collectionName].superlikes++;
        appendSuperlikesCardLi(collectionData);
      } else if (event.target.matches('.fa-thumbs-down')) {
        data.ratingsInfo[collectionData.collectionName].dislikes++;
      }
      data.nftVisible.hasBeenRated = true;
    }

    if (data.nftList.length === 0) {
      var matchInfo = findMatch(data);
      $modalText.textContent = ['You and ' + matchInfo.collectionName + ' have liked each other'];
      $modalImage.src = data.collectionPhotos[matchInfo.collectionName];
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

function handleSwapClick(event) {
  for (var i = 0; i < $dataViewNodeList.length; i++) {
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
        var $liNodeList = document.querySelectorAll('li');
        for (var j = 0; j < $liNodeList.length; j++) {
          $matchesUl.removeChild($liNodeList[j]);
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
            { class: 'card-image', src: data.collectionPhotos[data.nftVisible.collectionName] }),
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
    data.collectionPhotos[data.nftVisible.collectionName] = parentCollectionPhoto;
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
        $matchesUl.replaceChild($li, $liNodeList[i]);
      }
    }

  } else {
    $li = createMatchCardLi(data.nftVisible.collectionName);
    data.ratingsInfo[collectionData.collectionName].likes++;
    $matchesUl.appendChild($li);
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
function appendSuperlikesCardLi(collectionData) {
  var $li = createSuperlikesCardLi(data.nftVisible);
  $superlikesUl.appendChild($li);
}

function createSuperlikesCardLi(key) {
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
            { class: 'card-image', src: data.nftVisible.image }),
          generateDomTree(
            'div',
            { class: 'card-text-wrapper' },
            [generateDomTree('p', { textContent: data.nftVisible.name + 'VeeFriends Series' })])])]
      )])]);
}
