var oralHistorySrc = null;

window.onload = function() {
    var data = getData();
    document.getElementById("title").innerHTML = data["title"];

    var content_type = data["content_type"];
    if ( content_type == 0 ) {
        buildPicturePage( data["content_items"] );
    } else if ( content_type == 1 ) {
        buildLinksPage( data["content_items"] ); // Edit later
    } else if ( content_type == 2 ) {
        buildLinksPage( data["content_items"] );
    }
    //document.getElementById("text").innerHTML = decodeURI( vars["description"] );
    //var img = new Image();
    //img.onload = function () {
    //    console.log("IMAGE LOADED");
    //    document.body.style.backgroundImage = "url(" + this.src + ")";
    //}
    //img.onerror = function() {
    //    console.log("ERROR LOADING IMAGE");
    //};
    //img.src = decodeURI ( vars["background_image"] );
}

function buildLinksPage( items ) {
    var content_area = document.getElementById( "content_area" );
    items.forEach( item => content_area.appendChild( createLinksPanel( item ) ) );
}

function createLinksPanel( item ) {
    var url = item["item"];
    var description = item["item_description"];

    var result_div = document.createElement("DIV");
    var img_ele = document.createElement("A");

    //img_ele.href = url;
    img_ele.setAttribute('href', url);
    img_ele.setAttribute('target', '_blank"');
    img_ele.innerHTML = description;

    result_div.appendChild( img_ele );

    return result_div;
}

function buildPicturePage( items ) {
    var content_area = document.getElementById( "content_area" );
    items.forEach( item => content_area.appendChild( createPicturePanel( item ) ) );
}

function createPicturePanel( item ) {
    var url = item["item"];
    var description = item["item_description"];

    var result_div = document.createElement("DIV");
    var img_ele = document.createElement("IMG");
    var img_desc = document.createElement("P");

    var image = new Image;
    image.onload = function() {
        img_ele.src = this.src;
    }
    image.src = url;
    img_desc.innerHTML = description;

    result_div.appendChild( img_ele );
    result_div.appendChild( img_desc );

    return result_div;
}

function getData() {
    var vars = {};
    vars = new URLSearchParams(window.location.search);
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    console.log(vars);
    return JSON.parse( decodeURIComponent( vars["data"] ) );
}

function goBack() {
    window.parent.resetIFrame();
}

