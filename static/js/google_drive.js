// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = 'AIzaSyA_SsfgvvrXDdjAuFhsYLuig1EullYawrY';

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
function loadPicker() {        

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
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
                createPicker();  
    }
}


// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("application/json");
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.MINE_ONLY)
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_DISABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function uploadToGoogle() {

    var filename = document.getElementById("export_filename").value;
    if (filename.length == 0) {
        filename = "default"
    }
    
    
    //Can i save the file to memory then upload it to google drive through the python function drive_upload
    
}

// A simple callback implementation.
function pickerCallback(data) {

    var googleSelectedFiles = new Array();

    if (data.action == google.picker.Action.PICKED) {

        var fileId = data.docs[0].id;

        $.getJSON({
            url: '/drive_download',
            data: {
                fileID: fileId
            },
            success: function (data) {

                loadJSON(data);
                var json = JSON.parse(data);
                remove_all_tabs();
                loadTabs(json.resources);


            }
        });
    }
}
