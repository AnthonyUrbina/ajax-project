var $mainViewTitle = document.querySelector('.card-text > p');
var $cardImageDiv = document.querySelector('.card');
var $buttonContainer = document.querySelector('.button-container');

function populateMainView() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://eth-mainnet.g.alchemy.com/nft/v2/7VSl7jqnLgnd8IhZOmdPbY1nyoFggmIx/getNFTs?owner=0x1d00ff1416cF4eD1CEAAe24Bfddf8e4997bC3507&contractAddresses[]=0x60E4d786628Fea6478F785A6d7e704777c86a7c6&contractAddresses[]=0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b&contractAddresses[]=0xc1caf0c19a8ac28c41fe59ba6c754e4b9bd54de9&contractAddresses[]=0x73DA73EF3a6982109c4d5BDb0dB9dd3E3783f313&contractAddresses[]=0x79FCDEF22feeD20eDDacbB2587640e45491b757f&contractAddresses[]=0xED5AF388653567Af2F388E6224dC7C4b3241C544&contractAddresses[]=0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e&contractAddresses[]=0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83&contractAddresses[]=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&contractAddresses[]=0xe785E82358879F061BC3dcAC6f0444462D4b5330&contractAddresses[]=0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB&withMetadata=true');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $mainViewImage = document.createElement('img');
    var randomInt = getRandomNumber(xhr.response.ownedNfts.length);

    var nftData = {
      name: xhr.response.ownedNfts[randomInt].metadata.name,
      image: xhr.response.ownedNfts[randomInt].media[0].gateway,
      collectionName: xhr.response.ownedNfts[randomInt].contractMetadata.name
    };

    $mainViewImage.src = nftData.image;
    $cardImageDiv.appendChild($mainViewImage);

    if (nftData.name === undefined) {
      nftData.name = xhr.response.ownedNfts[randomInt].contractMetadata.symbol;
      $mainViewTitle.textContent = nftData.name;
    } else {
      $mainViewTitle.textContent = nftData.name;
    }
    data.NFTvisible.push(nftData);
  });
  xhr.send();
}

function getRandomNumber(collectionLength) {
  var randomNumber = Math.random() * (collectionLength - 0) + 0;
  var integer = Math.floor(randomNumber);
  return integer;
}

function handleClick(event) {
  if (event.target.matches('.fa-solid')) {
    var collectionData = {
      collectionName: data.NFTvisible[0].collectionName,
      collectionPhoto: null,
      likes: null,
      dislikes: null
    };

    var singleNFTData = {
      name: data.NFTvisible[0].name,
      data: data.NFTvisible[0].image
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
    } else if (event.target.matches('.fa-thumbs-down')) {
      data.ratingsInfo[collectionData.collectionName].dislikes++;
    }
  }

}

window.addEventListener('DOMContentLoaded', populateMainView);
$buttonContainer.addEventListener('click', handleClick);
