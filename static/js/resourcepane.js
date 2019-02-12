var current_tab = 0;
var last_number = 1;
var tabs = [];
var web_history = [];

function add_tab(load_id = null) {
    if (load_id == null) {
        var new_resource = add_resource(' ');
        tab_id = new_resource.id;
        add_resource_metadata(tab_id, 'title', '');
        localStorage.setItem("state", JSON.stringify(get_sd()));
    } else {
        tab_id = load_id;
    }

    add_resource_header();

    var resource_type_idx = document.getElementById("resource_type").options.selectedIndex;
    var resource_type_txt = document.getElementById("resource_type").options[resource_type_idx].text;
    if (resource_type_txt.toLowerCase() === "text") {
        add_text_resource_body(tab_id);
    } else if (resource_type_txt.toLowerCase() === "web") {
        add_web_resource_body(tab_id);
    }

    set_active_tab(tab_id + "_body");
    return tab_id
}

function add_resource_header() {
    tab_number = next_number();
    tabs.push(tab_id);
    var resource_pane_tab_head = $(`
        <button id="` + tab_id + `_btn" class="tablinks" 
            onclick="set_active_tab('` + tab_id + `_body')">` +
        tab_number + `</button>
    `);

    $(".resource_pane_tab_head").append(resource_pane_tab_head);
}

function load_tab(resource) {
    if (resource != null) {
        var tab_id = resource.id;
        add_tab(tab_id);
        set_text_resource_title(tab_id, resource.metadata.title);
        set_text_resource_content(tab_id, resource.content);
        set_web_resource_title(tab_id, resource.metadata.title);
        set_web_resource_content(tab_id, resource.content);
    }
}

function next_number() {
    return last_number++;
}

function remove_tab() {
    $("#" + current_tab + "_btn").remove();
    $("#" + current_tab + "_body").remove();
    var idx = tabs.indexOf(current_tab);
    delete_resource(current_tab);
    sd.nodes.forEach((node) => {
        if (node.type == 'atom') {
            if (current_tab in node.sources) {
                delete_source(node.id, current_tab);
            }
        }
    });

    localStorage.setItem("state", JSON.stringify(get_sd()));
    if (tabs.length >= 1 && idx != -1) {
        tabs.splice(idx, 1);
        current_tab = tabs[tabs.length - 1];
        set_active_tab(current_tab + "_body");
    }
}

function web_search() {
    
    
    /* REMOVE VALIDATION */
    
    
    var web_address = document.getElementById("webAddress_" + tab_id).value;

    var warning_label = document.getElementById("warning_label_" + tab_id).innerHTML;

    //window.alert();

    if (web_address.endsWith(".com") || web_address.endsWith(".co.uk") || web_address.endsWith(".gov") || web_address.endsWith(".de") || web_address.endsWith(".net") || web_address.endsWith(".cn") || web_address.endsWith(".info") || web_address.endsWith(".nl") || web_address.endsWith(".eu") || web_address.endsWith(".ru")) 
    {
        add_to_history(web_address);
        document.getElementById("warning_label_" + tab_id).innerHTML = "";
        
        //RUNS PROXY SCRIPT
        $('a#process_input').bind('click', function() {
            $.getJSON('/background_process', {
                txtAddress: $('input[name="txtAddress"]').val(),
            }, function(data) {
                $("#web_iframe").attr('srcdoc', data.result);
                $("#result").text(data.result);
            });
            return false;
        });

    } else {
        document.getElementById("warning_label_" + tab_id).innerHTML = "This is not a valid web address";
    }
}


function refresh() {
    var newURL = document.getElementById('website_url').value;
    var showSite = document.getElementsByName('proxy_window')[0];
    showSite.src = newURL;

}



function add_to_history(web_address) {
    web_history.unshift(web_address);
    var ul = document.createElement('ul_' + tab_id);

    if (web_history.length > 10) {
        web_history.splice(10, 1);
    }

    var list = document.getElementById("history_list_" + tab_id)

    while (list.firstChild) {
        list.removeChild(list.firstChild)
    }

    list.append(ul);

    web_history.forEach(function (item) {
        var li = document.createElement('li_' + tab_id);
        ul.appendChild(li);

        li.innerHTML += item;
        console.log(item);
    });
}



function remove_all_tabs() {
    var i = 0;
    tabs.forEach((tab) => {
        $("#" + tabs[i] + "_btn").remove();
        $("#" + tabs[i] + "_body").remove();
        ++i;
    });
}

function set_active_tab(tab_id) {
    if (tabs.length > 0) {
        current_tab = tab_id.substring(0, tab_id.indexOf("_body"));
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("resource_pane_tab_content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        if (document.getElementById(tab_id)) {
            document.getElementById(tab_id).style.display = "block";
            document.getElementById(current_tab + "_btn").className += " active";
        }
    }
}

function toggle_resource_pane() {
    if (resource_pane_viewable_state == true) {
        $('#resource-pane').children().hide();
        $('#resource-pane').hide();
        resource_pane_viewable_state = false;
    } else {
        $('#resource-pane').show();
        $('#resource-pane').children().show();
        resource_pane_viewable_state = true;
    }
    cy.center();
    cy.resize();
}
