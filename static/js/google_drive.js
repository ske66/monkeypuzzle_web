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
var type;
var folderID;
var filename;
var filecontent;


// Use the Google API Loader script to load the google.picker script.
function loadPicker(Pickertype, name, content) {
    
    type = Pickertype;
    filename = name;
    filecontent = content;

    gapi.load('auth', {
        'callback': onAuthApiLoad
        
        
    });
    gapi.load('picker', {
        'callback': onPickerApiLoad
    });
    
}

function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
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
        
        if (type == "upload")
            {
                createUploadPicker();
            }
        if (type == "download")
            {
                createDownloadPicker();  
            }
    }
}


// Create and render a Picker object for searching images.
function createDownloadPicker() {
        
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
            .setCallback(downloadPickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function createUploadPicker() {
        
    if (pickerApiLoaded && oauthToken) {
        var docsView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true);
        
        var picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.MINE_ONLY)
        .enableFeature(google.picker.Feature.MULTISELECT_DISABLED)
        .setAppId(appId)
        .setOAuthToken(oauthToken)
        .addView(docsView)
        .setDeveloperKey(developerKey)
        .setCallback(uploadPickerCallback)
        .build();
    picker.setVisible(true);
    }
    
} 

function uploadPickerCallback(data){
        
    if (data.action == google.picker.Action.PICKED) {
        folderID = data.docs[0].id;
		
		
		var file = new Blob([filecontent], {type: 'application/json'});
		var metadata = {
			'name': filename,
			'mimeType': 'application/json',
			'parents': [folderID],
		};
		
		var form =  new FormData();
		form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
		form.append('file', file);
		
		fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
			method: 'POST',
			headers: new Headers({ 'Authorization': 'Bearer ' + oauthToken }),
			body: form,
		}).then((res) => {
			return res.json();
		}).then(function(val) {
			console.log(val);
		}); 
    }
        
}


// A simple callback implementation.
function downloadPickerCallback(data) {

    if (data.action == google.picker.Action.PICKED) {

        var fileId = data.docs[0].id;		
		
		$.ajax({
			type: "GET",
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", "Bearer " + oauthToken);
			},
			url: "https://www.googleapis.com/drive/v3/files/"+ fileId +"?alt=media",
			mimeType: 'application/json',
			processData: true,
			success: function(data) {
				data = JSON.stringify(data);
				loadJSON(data)
				var json = JSON.parse(data);
				remove_all_tabs();
				loadTabs(json.resources);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: ' + errorThrown + ' / ' + textStatus) + console.log(jqXHR);
			}
		});
    }
}
