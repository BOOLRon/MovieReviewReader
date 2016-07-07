/**
 * Created by Ron on 25/6/2016.
 */
"use strict";

function fetchImageContentFromHtmlLink(link,content,callback){

  _fetchSourceBy(link,(source,error)=>{
    if(error){
     callback(null,error)
    }else {
      let imagelinks = _pickImageUrlsFromSource(source)
      let imageContent = _createImageContent(content,imagelinks)
      callback(imageContent,null)
    }
  })

  return _createImageContent(content,undefined);

}

function _createImageContent(content,links){

  let regex = /\[img=\d+:C\].*?\[\/img\]/g;
  let originImageTag = content.match(regex)
  if (originImageTag === null){
    originImageTag = []
  }
  var resultContent = content;

  //console.log(originImageTag.length)
  //console.log(links.length)
  //console.log(resultContent)

  if (links && originImageTag.length == links.length ) {
    originImageTag.forEach(function (tag, index, array) {
      let imageLink = links[index]
      if (imageLink) {
        let newTag = tag.replace(/\].*?\[\/img\]/, (replacement)=> {
          return '\<br\>\<div class=\"cc\"\>\<img src=\"' + imageLink +
            '\"\<div style=\"text-align:center;padding-bottom:1em\" class=\"wr pl\"\>\<div class=\"pl\" style=\"text-align:center;\"\>' +
            replacement.substr(1, replacement.length - 7) + '\<\/div\>\<\/div\>\<\/div\>\<br\>'
        })
        let resultLink = newTag.replace(/\[img=\d+:C/, '')
        resultContent = resultContent.replace(tag, resultLink)
      }
    })
  }else {
    //pick error, replace all ImageTags
    originImageTag.forEach(function (tag, index, array) {
      resultContent = resultContent.replace(tag, '')
    });
  }
  return resultContent;
}

function _pickImageUrlsFromSource(source){
  let regex = /<img src=\"https:\/\/img(.)(.doubanio.com\/view\/thing_review)(.*?\")/g;
  let matchWords = source.match(regex)
  if (matchWords === null){
    matchWords = []
  }
  let links = matchWords.map((word)=> {
    return word.substr(10, word.length - 11)
  })
  return links
}

function _fetchSourceBy(link,callback) {
  if (link){
    fetch(link).then((response)=>response.text())
      .then((responseText)=>{
        callback(responseText,null)
      })
      .catch((error)=>{
        callback(null,error)
      });
  }else {
    callback(null,null)
  }
}

module.exports = {
  fetchImageContentFromHtmlLink
}