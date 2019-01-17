
    var developerKey = "AIzaSyAVJdEON-ZKdI3NFvNg98B9HcFf8SCVdW8";
    var clientId = "901403089982-stdnflked3taoujvol9ti9svsok14er4.apps.googleusercontent.com";
    var scope = "https://www.googleapis.com/auth/photos";  //change this
    var pickerApiLoaded = false;
    var oauthToken;

function onApiLoad() {
 
    gapi.load('auth2', onAuthApiLoad);
    gapi.load('picker', onPickerApiLoad);
}

function onAuthApiLoad()
{
    var authBtn = document.getElementById('auth');
    authBtn.disable = false;
    authBtn.addEventListener('click', function() {
        gapi.auth2.authorize({
            client_id: clientId,
            scope: scope
        }, handleAuthResult);
    });
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        var picker = new google.picker.PickerBuilder().addView(google.picker.ViewId.PHOTOS).setOAuthToken(oauthToken).setDeveloperKey(developerKey).setCallback(pickerCallback).build();
        picker.setVisible(true);
    }
}

//A simple callback implementation
function pickerCallback(data) {
    var url = "nothing";
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc[google.picker.Document.URL];
    }
    var message = "You picked: " + url;
    document.getElementById('result').innerHTML = message;
}