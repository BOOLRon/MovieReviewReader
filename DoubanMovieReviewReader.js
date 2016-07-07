
function fetchImageContentFromHtmlLink(link,content,callback){

  _fetchSourceBy(link,function(source,error){
    if(error){
     callback(null,error);
    }else {
      var imagelinks = _pickImageUrlsFromSource(source);
      var imageContent = _createImageContent(content,imagelinks);
      callback(imageContent,null);
    }
  });

  return _createImageContent(content,undefined);

}

function _createImageContent(content,links){

  var regex = /\[img=\d+:C\].*?\[\/img\]/g;
  var originImageTag = content.match(regex);
  if (originImageTag === null){
    originImageTag = [];
  }
  var resultContent = content;

  if (links && originImageTag.length == links.length ) {
    originImageTag.forEach(function (tag, index, array) {
      var imageLink = links[index];
      if (imageLink) {
        var newTag = tag.replace(/\].*?\[\/img\]/, function(replacement) {
          return '\<br\>\<div class=\"cc\"\>\<img src=\"' + imageLink +
            '\"\<div style=\"text-align:center;padding-bottom:1em\" class=\"wr pl\"\>\<div class=\"pl\" style=\"text-align:center;\"\>' +
            replacement.substr(1, replacement.length - 7) + '\<\/div\>\<\/div\>\<\/div\>\<br\>';
        });
        var resultLink = newTag.replace(/\[img=\d+:C/, '');
        resultContent = resultContent.replace(tag, resultLink);
      }
    });
  }else {
    //pick error, replace all ImageTags
    originImageTag.forEach(function (tag, index, array) {
      resultContent = resultContent.replace(tag, '');
    });
  }
  return resultContent;
}

function _pickImageUrlsFromSource(source){
  var regex = /<img src=\"https:\/\/img(.)(.doubanio.com\/view\/thing_review)(.*?\")/g;
  var matchWords = source.match(regex);
  if (matchWords === null){
    matchWords = [];
  }
  var links = matchWords.map(function(word){
    return word.substr(10, word.length - 11);
  });
  return links;
}

function _fetchSourceBy(link,callback) {
  if (link){
    fetch(link).then(function(response){response.text();})
      .then(function(responseText){
        callback(responseText,null);
      })
      .catch(function(error){
        callback(null,error);
      });
  }else {
    callback(null,null);
  }
}

module.exports = fetchImageContentFromHtmlLink;
