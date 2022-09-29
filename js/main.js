var $mainViewTitle = document.querySelector('.card-text > p');
var $cardImageDiv = document.querySelector('.card');
var $buttonContainer = document.querySelector('.button-container');
var $mainViewImage = document.createElement('img');

function showFirstNFT() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=0x1d00ff1416cF4eD1CEAAe24Bfddf8e4997bC3507&contractAddresses[]=0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b&contractAddresses[]=0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9&contractAddresses[]=0x79FCDEF22feeD20eDDacbB2587640e45491b757f&contractAddresses[]=0xED5AF388653567Af2F388E6224dC7C4b3241C544&contractAddresses[]=0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e&contractAddresses[]=0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83&contractAddresses[]=0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB&withMetadata=true');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var randomInt = getRandomNumber(xhr.response.ownedNfts.length);

    var nftData = {
      name: xhr.response.ownedNfts[randomInt].metadata.name,
      image: xhr.response.ownedNfts[randomInt].media[0].gateway,
      collectionName: xhr.response.ownedNfts[randomInt].contractMetadata.name
    };

    var locationData = {
      index: randomInt,
      collectionLength: xhr.response.ownedNfts.length
    };

    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);
    $mainViewTitle.textContent = nftData.name;

    data.nftList = (xhr.response.ownedNfts);
    data.nftList.splice(randomInt, 1);

    data.nftVisible = null;
    data.nftVisible = (nftData);

    data.starting.nftInfo = nftData;
    data.starting.location = locationData;
  });
  xhr.send();
}

function showNewNFT() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=0x1d00ff1416cF4eD1CEAAe24Bfddf8e4997bC3507&contractAddresses[]=0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b&contractAddresses[]=0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9&contractAddresses[]=0x79FCDEF22feeD20eDDacbB2587640e45491b757f&contractAddresses[]=0xED5AF388653567Af2F388E6224dC7C4b3241C544&contractAddresses[]=0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e&contractAddresses[]=0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83&contractAddresses[]=0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB&withMetadata=true');
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

      data.nftVisible = null;
      data.nftVisible = (nftData);
      data.nftList.splice(i, 1);
    }
  });
  xhr.send();
}

function handleClick(event) {
  if (event.target.matches('.fa-solid')) {
    var collectionData = {
      collectionName: data.nftVisible.collectionName,
      collectionPhoto: null,
      likes: null,
      dislikes: null
    };

    var singleNFTData = {
      name: data.nftVisible.name,
      data: data.nftVisible.image
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.opensea.io/api/v1/collection/' + collectionData.collectionName.toLowerCase());
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      collectionData.collectionPhoto = xhr.response.collection.image_url;
    });
    xhr.send();

    if (data.ratingsInfo[collectionData.collectionName] === undefined) {
      data.ratingsInfo[collectionData.collectionName] = collectionData;
    }
    if (event.target.matches('.fa-heart')) {
      data.ratingsInfo[collectionData.collectionName].likes++;
    } else if (event.target.matches('.fa-star')) {
      data.superliked.push(singleNFTData);
      data.ratingsInfo[collectionData.collectionName].likes++;
    } else if (event.target.matches('.fa-thumbs-down')) {
      data.ratingsInfo[collectionData.collectionName].dislikes++;
    }
    showNewNFT();
  }

}

window.addEventListener('DOMContentLoaded', showFirstNFT);
$buttonContainer.addEventListener('click', handleClick);

function getRandomNumber(collectionLength) {
  var randomNumber = Math.random() * ((collectionLength - 1) - 0) + 0;
  var integer = Math.floor(randomNumber);
  return integer;
}
