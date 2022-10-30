function youtubeLikeToSlack() {
  var results = YouTube.Channels.list('contentDetails', {mine: true});
  var videoIdList = [];
  for(var i in results.items) {
    var item = results.items[i];
    // Get the playlist ID, which is nested in contentDetails, as described in the
    // Channel resource: https://developers.google.com/youtube/v3/docs/channels
    var playlistId = item.contentDetails.relatedPlaylists.likes;

    var nextPageToken = '';

    // This loop retrieves a set of playlist items and checks the nextPageToken in the
    // response to determine whether the list contains additional items. It repeats that process
    // until it has retrieved all of the items in the list.
    while (nextPageToken != null) {
      var playlistResponse = YouTube.PlaylistItems.list('snippet', {
        playlistId: playlistId,
        maxResults: 25,
        pageToken: nextPageToken
      });

      for (var j = 0; j < playlistResponse.items.length; j++) {
        videoIdList.push(playlistResponse.items[j].snippet.resourceId.videoId);

        nextPageToken = playlistResponse.nextPageToken;
      }
    }
  }

  // randomなリストの中身を一つとる
    var videoId = videoIdList[Math.floor(Math.random()*videoIdList.length)];

    // youtubeのurl
    var url = `https://www.youtube.com/watch?v=${videoId}`
    console.log(url);

  // postの挙動
  var jsonData =
  {"text" : `高評価リストの中から取ってきたよ\n${url}`};
  var payload = JSON.stringify(jsonData);

  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch("<ここにwebhookのURL>", options);
}
