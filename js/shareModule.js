(function(window, $){

	window.fbAsyncInit = function() {
    FB.init({
      appId      : '1389422801344145',
      xfbml      : true,
      version    : 'v2.0'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

	// Saves the most recent message/url combination
	var meme = {
		message: undefined,
		url: undefined
	}

	function messageIsNewer(message) {
		return (meme.message === undefined) || (meme.message !== message);
	}

	window.memeUploadAndShare = function memeUploadAndShare (dest, canvasEl, message) {
		if (messageIsNewer(message)) {
			var fd = getFormDataFromCanvas( canvasEl );
			postToBackend(fd)
				.done(function(data, textStatus) {
					console.log('yay, the image was saved to s3', JSON.parse(data).filename);
					meme.message = message;
					meme.url = JSON.parse(data).filename;
					share(dest, JSON.parse(data).filename, message);
				})
				.fail(function() {
					console.log('Sorry there was an error saving to the server');
				});
		} else {
			share(dest, meme.url, meme.message);
		}
	}

	window.uploadAndShare = function uploadAndShare (dest, canvasEl, message) {
		var fd;
		fd = getFormDataFromCanvas( canvasEl );
		postToBackend(fd)
			.done(function(data, textStatus){
				console.log('yay, the image was saved to s3', JSON.parse(data).filename);
				share(dest, JSON.parse(data).filename, message );
			})
			.fail(function () {
				console.log('Sorry there was an error saving to the server');
			});
	}

	function share(dest, url, message) {
		switch (dest) {
			case 'facebook':
				shareWithFacebook(url, message);
				break;
			case 'twitter':
				shareWithTwitter(url, message);
				break;
			case 'email':
				shareByEmail(url, message);
				break;
		}
	}


	// http://thrivemomsday-petri.dotcloud.com
	function postToBackend(formData){
		return $.ajax({
			type: 'POST',
			data: formData,
			url: 'http://thrivemomsday-petri.dotcloud.com/img',
			contentType: false,
      processData: false,
		})
	}

	function getFormDataFromCanvas (canvasEl) {
		var formData;
		var dataURI;
		var blob;

		// get canvas data
		dataURI = canvasEl.toDataURL('image/png');

		// convert data to  blob
		blob = dataURItoBlob(dataURI);

		console.log('blob', blob);

		// using FormData will force the ajax content-type to be multipart/form
    var formData = new FormData();
    formData.append('blob', blob);

    return formData;
	}

	function dataURItoBlob(dataURI) {
		var tokens = dataURI.split(',');
		var contentType = tokens[0].split(';')[0].split(':')[1];
    var binary = atob(tokens[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: contentType});
	}

	function shareWithTwitter (imageUrl, description) {
		description == description || "Happy Mother's Day!";
		var tweetText = description + " " + imageUrl + " via @HuffPostLabs";
		var twitterURL = "https://twitter.com/share?via=HuffPostLabs&text=" + description + "&url=" + imageUrl;

		window.open(twitterURL, 'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=300,height=500');
	}

	function shareWithFacebook (imageUrl, description) {
		FB.ui({
		  method: 'feed',
		  picture: imageUrl,
		  description: description,
		  caption: 'Send your mom a card.',
		  link: "http://www.huffingtonpost.com"
		}, function(response){
			console.log(response);
		});
	}

	function shareByEmail (url, message) {
		var emailIframe = $('#card-email-helper')[0];

		var entryUrl = "http://m.huffpost.com/us/entry/12345";
		var subject = encodeURIComponent("Happy Mother's Day");
		var body = encodeURIComponent(message + "\n\nSomebody who loves you made a card for you here:\n\n" + url + "\n\nMake your own at " + entryUrl);
		var mailtoURL = 'mailto:?' + 'subject=' + subject + '&body=' + body;
		emailIframe.contentWindow.location = 'about:blank';
		emailIframe.contentWindow.location = mailtoURL;
	}

})(window, $);
