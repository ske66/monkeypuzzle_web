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

                        <button type="button" class="btn btn-default" onclick="history_forward()" title="Go to next website">
                            <i class="fa fa-chevron-right fa-fw fa-lg"></i>
                        </button>

                        <button type="button" class="btn btn-default"
                        onclick="history_list()" title="View previous website searches">
                            <i class="fa fa-history fa-fw fa-lg"></i>
                        </button>

                </div>
                <div class="form-group">
                    <label>Website Address</label>

                    <textarea id="title_` + tab_id + `" type="text" rows="1" style="resize: none;" class="form-control" placeholder="Paste content web address..." onchange="change_title('` + tab_id + `')"></textarea> 
                    <label>Content</label>


		<iframe id='test_iframe' class="form-control" src='https://crossorigin.me' style="resize: vertical; min-height:50vh;"></iframe>

                </div>
                <div type="button" class="btn btn-default">Refresh</div>
<div type="button" class="btn btn-primary">Search</div>
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
    var title = document.getElementById("title_" + tab_id).value;
    set_text_resource_title(tab_id, title)
}

function change_textarea(tab_id) {
    var text = document.getElementById(tab_id).value;
    set_text_resource_content(tab_id, text)
}
