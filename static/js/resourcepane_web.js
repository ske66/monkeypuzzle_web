function add_web_resource_body(tab_id) {
    var tab_body = $(`
            
            <div id="` + tab_id + `_body" class="resource_pane_tab_content">
            <form>
                <div class="form-group">

                        <button type="button" class="btn btn-default" onclick="remove_tab()" title="Remove this tab from the resource pane">
                            <i class="fa fa-trash fa-fw fa-lg"></i>
                        </button>

                        <button type="button" class="btn btn-default" onclick="history_back()" title="Go to previous website">
                            <i class="fa fa-chevron-left fa-fw fa-lg"></i>
                        </button>

                        <button type="button" class="btn btn-default" title="Go to next website">
                            <i class="fa fa-chevron-right fa-fw fa-lg"></i>
                        </button>

                        <div class="btn-group">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">History
                                <i class="fa fa-chevron-down fa-fw">
                                </i>
                            </button>
                            <div class="dropdown-menu">
<div id="history_list_`+ tab_id + `" class="container-fluid">
                            </div>
                        </div>
                    </div>
                
                    <div class="form-group" style="padding-top: 18px;">
                    <label>Website Address</label>                    
                    <label id="warning_label_` + tab_id + `" class="text-danger"></label>
                    <textarea id="webAddress_` + tab_id + `" type="text" rows="1" style="resize: none;" class="form-control" placeholder="Web address of this resource..." onchange="change_title('` + tab_id + `')"></textarea>   
                    <label>Content</label>
		          <iframe id="test_iframe_` + tab_id + `" class="form-control" src='changethisurl' style="resize: vertical; min-height:50vh;"></iframe>

                </div>
                <div type="button" class="btn btn-default">Refresh</div>
<div type="button" class="btn btn-primary" onclick="web_search()">Search</div>
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

function change_title(tab_id) {
    var title = document.getElementById("webAddress_" + tab_id).value;
    set_text_resource_title(tab_id, title)
}

function change_textarea(tab_id) {
    var text = document.getElementById(tab_id).value;
    set_text_resource_content(tab_id, text)
}

//test
