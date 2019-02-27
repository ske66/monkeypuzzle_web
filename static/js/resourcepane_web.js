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
                    <input type="text" id="webAddress_` + tab_id + `" name="txtAddress" rows="1" style="resize: none;" class="form-control" placeholder="Address of chosen website...">
                    <label>Content</label>
                    <iframe id="web_iframe" class="form-control" src="" style="min-height:70vh;"><div id="loading"></div>
</iframe>
                </div>
                <a href="#" id="btnProxy">
                    <div type="button" class="btn btn-primary" onclick="web_search()">Search</div>
                </a>
            </div>

        </form>


    </div>
    `);

    $(".tab_body").append(tab_body);
}

function set_web_resource_title(tab_id, title) {
    update_resource(tab_id, null, title);
    update_local_storage();
}

function set_web_resource_content(tab_id, text) {
    update_resource(tab_id, text, null);
    update_local_storage();
}

function new_atom_web_resource_button() {

    set_iframe_focus("web_iframe");

    if (focused != null || focused != undefined) {
        if (focused.id == "web_iframe") {
            selected_text = get_selected_web_text();
            if (selected_text != null) {
                add_new_atom_node(selected_text);
            }
        }
        focused == null
    } 
    else { console.log("Not a valid text source") }
}
