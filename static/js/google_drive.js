// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = 'AIzaSyA_SsfgvvrXDdjAuFhsYLuig1EullYawrY';
var upload = false;

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = "901403089982-pbko9c7371bvm8njs1i7opug678lojil.apps.googleusercontent.com"

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "artful-oxygen-228914";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive'];

var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker(uploadBool) {
    upload = uploadBool;

    gapi.load('auth', {
        'callback': onAuthApiLoad
    });
    gapi.load('picker', {
        'callback': onPickerApiLoad
    });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize({
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker(upload);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}


// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken && upload == false) {
                console.log(upload);
        var view = new google.picker.View(google.picker.ViewId.FOLDERS);
        view.setMimeTypes("application/vnd.google-apps.script+json");
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.MINE_ONLY)
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            //.addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
    //Script for uploading
    else if (pickerApiLoaded && oauthToken && upload == true) {
        console.log(upload);

        var view = new google.picker.View(google.picker.ViewId.FOLDERS);
        view.setMimeTypes("application/vnd.google-apps.script+json");
        
        var uploadView = new google.picker.DocsUploadView();
        var picker = new google.picker.PickerBuilder().
        addView(view).
        addView(uploadView).
        setAppId(appId).
        setOAuthToken(oauthToken).
        setCallback(pickerCallback).
        build();
        picker.setVisible(true);
        upload = false;

    }
}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;

        //Launch the load operation of the file manager.


        //alert('The user selected: ' + fileId);
    }
}

//<input id="loadJSON" style="display:none;" accept=".json" role="button" tabindex="-1000" type="file" class="upload-button" onchange="filemanager('load','json',null,null,null)">
