function add_web_resource_body(tab_id) {
    var tab_body = $(`
    <div id="` + tab_id + `_body" class="resource_pane_tab_content">
        <form>
            <div class="form-group">
                <button type="button" class="btn btn-default" onclick="remove_tab()" title="Remove this tab from the resource pane">
                            <i class="fa fa-trash fa-fw fa-lg"></i>
                        </button>
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">History
                                <i class="fa fa-chevron-down fa-fw">
                                </i>
                            </button>
                    <div class="dropdown-menu">
                        <div id="history_list_` + tab_id + `" class="container-fluid">
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-default" title="Add node from text selection" tabIndex="-1" onclick="new_atom_web_resource_button();">
                            <i class="fa fa-puzzle-piece fa-fw fa-lg"></i>
                        </button>
                <div class="form-group" style="padding-top: 18px;">
                    <label>Website Address</label>
                    <input type="text" id="webAddress_` + tab_id + `" name="txtAddress_` + tab_id + `" rows="1" style="resize: none;" class="form-control" onchange="change_address('` + tab_id + `')" placeholder="Address of chosen website...">
                    <label>Content</label>
                    <iframe id="webIframe_` + tab_id + `" class="form-control" style="min-height:70vh;"><div id="loading"></div></iframe>
                    <div class="btn btn-primary" id="btnWeb_` + tab_id + `" onclick="set_web_resource_address">Search</div>
                </div>
            </div>
        </form>
    </div>
    `);

    $(".tab_body").append(tab_body);
    
    
    //BE IDEAL TO TURN THIS INTO MOUSETRAP
$(function() {
    $("#webAddress_" + tab_id).keydown(function (e) {
        if(e.which == 13) {
            change_address(tab_id);
            $("#webAddress_" + tab_id).blur();
            e.preventDefault();
        }
    });
});

}



function set_web_resource_address(tab_id, title) {
    if (title != undefined || null) {
        console.log("Set Web Resource: " + title, tab_id);
        update_resource(tab_id, null, title);
        update_local_storage();
        document.getElementById('webAddress_' + tab_id).value = title;
        web_search(tab_id, title);
    }
}

function set_web_resource_content(tab_id, content) {
    update_resource(tab_id, content, null)
    update_local_storage();
}

function change_address(tab_id) {
    var title = document.getElementById("webAddress_" + tab_id).value;
    set_web_resource_address(tab_id, title)
}


function web_search(tab_id, title) {
console.log("Web Search: " + title, tab_id);
    $.getJSON('/proxy', {
        txtAddress: title
    }, function (data) {
        $("#webIframe_" + tab_id).attr('srcdoc', data.result);
    });
    return false;
}

function new_atom_web_resource_button() {

    set_iframe_focus("webIframe_" + tab_id);

    if (focused != null || focused != undefined) {
        if (focused.id == "webIframe_" + tab_id) {
            selected_text = get_selected_web_text();
            if (selected_text != null) {
                add_new_atom_node(selected_text);
            }
        }
        focused == null
    } else {
        console.log("Not a valid text source")
    }
}
