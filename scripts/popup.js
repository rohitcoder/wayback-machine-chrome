global_url="";

function remove_port(url){
    if(url.substr(-4)==':80/'){
        url=url.substring(0,url.length-4);
    }
    return url;
}

function remove_wbm(url){
    var pos=url.indexOf('/http');
    if(pos!=-1){
        var new_url=url.substring(pos+1);
    }else{
        var pos=url.indexOf('/www');
        var new_url=url.substring(pos+1);
    }
    return remove_port(new_url);
}

function remove_alexa(url){
    var pos=url.indexOf('/siteinfo/');
    var new_url=url.substring(pos+10);
    return remove_port(new_url);
}

function remove_whois(url){
    var pos=url.indexOf('/whois/');
    var new_url=url.substring(pos+7);
    return remove_port(new_url);
}
/* Common method used everywhere to retrieve cleaned up URL */
function get_clean_url() {
    var search_term = document.getElementById('search_input').value;
    if(search_term == ""){
        var url=global_url;
    }else{
        var url=search_term;
    }
    if (url.includes('web.archive.org')) {
        url=remove_wbm(url);
    } else if (url.includes('www.alexa.com')) {
        url=remove_alexa(url);
    } else if (url.includes('www.whois.com')) {
        url=remove_whois(url);
    }
    return url;
}

function save_now(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/save/",
                                page_url: get_clean_url(),
                                method:'save' }).then(handleResponse, handleError);
}

function recent_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/2/",
                                page_url: get_clean_url(),
                                method:'recent'});
}

function first_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/0/",
                                page_url: get_clean_url(),
                                method:'first'});
}

function view_all(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/*/",
                                page_url: get_clean_url(),
                                method:'viewall'});
}

function get_url(){
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        global_url=tabs[0].url;
    });
}

function social_share(eventObj){
    var parent=eventObj.target.parentNode;
    var id=parent.getAttribute('id');
    var url = get_clean_url();
    var open_url="";
    if(id.includes('fb')){
        open_url="https://www.facebook.com/sharer/sharer.php?u="+url;
    }else if(id.includes('twit')){
        open_url="https://twitter.com/home?status="+url;
    }else if(id.includes('gplus')){
        open_url="https://plus.google.com/share?url="+url;
    }else if(id.includes('linkedin')){
        open_url="https://www.linkedin.com/shareArticle?url="+url;
    }
    window.open(open_url, 'newwindow', 'width=800, height=280,left=0');
}

function alexa_statistics(eventObj){
    var open_url="http://www.alexa.com/siteinfo/" + get_clean_url();
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}
function extractHostname(url) {
    var hostname; 
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    } 
    hostname = hostname.split(':')[0]; 
    hostname = hostname.split('?')[0]; 
    return hostname;
}
function AppendInLocalData(key,mode){
if(mode=='alexa'){
       console.log('Appending data for key-'+key);
       chrome.storage.local.get(key, function(result) { 
	   var output = JSON.parse(result[key] || null);    
	   if(output!=null && JSON.parse(result[key]).val.length>10){
	   console.warn("Appending data for key-"+key);
	   $('#alexa_html_data').append(JSON.parse(result[key]).val); 
	   }
	   }); 
}else if(mode=='whois'){
 console.log('Appending data for key-'+key); 
 $('#main_page').hide();
 chrome.storage.local.get(key, function(result) { 
	   var output = JSON.parse(result[key] || null);    
	   if(output!=null && JSON.parse(result[key]).val.length>10){
	   console.warn("Appending data for key-"+key); 
	   $('#whois_html_data').append(JSON.parse(result[key]).val); 
       $('#whois_html_data').show(); 
	   }
	   });
}
}
function catchAlexaCachedData(site_key){
var alexa_header = site_key+'_alexa_header'; 
AppendInLocalData(alexa_header,'alexa');
var global_rank = site_key+'_global_rank';
AppendInLocalData(global_rank,'alexa');
var global_data = site_key+'_global_data';
AppendInLocalData(global_data,'alexa');
var country_rank = site_key+'_country_rank';
AppendInLocalData(country_rank,'alexa');
var search_graph = search_graph+'_search_graph';
AppendInLocalData(search_graph,'alexa');
var top_keywords = site_key+'_top_keywords';
AppendInLocalData(top_keywords,'alexa');
var demographics_country_table = site_key+'_demographics_country_table';
AppendInLocalData(demographics_country_table,'alexa');
var engage_data = site_key+'_engage_data';
AppendInLocalData(engage_data,'alexa');
var upstream_sites = site_key+'_upstream_sites';
AppendInLocalData(upstream_sites,'alexa');
var count_linkin_sites = site_key+'_count_linkin_sites';
AppendInLocalData(count_linkin_sites,'alexa');
var linkin_sites = site_key+'_linkin_sites';
AppendInLocalData(linkin_sites,'alexa');
var similar_sites = site_key+'_similar_sites';
AppendInLocalData(similar_sites,'alexa');
var sub_domains = site_key+'_sub_domains';
AppendInLocalData(sub_domains,'alexa');
var load_speed = site_key+'_load_speed';
AppendInLocalData(load_speed,'alexa');
var copyright_to = site_key+'_copyright_to';
AppendInLocalData(copyright_to,'alexa');  
$('#alexa_html_data').show(); 
document.getElementById('gomain').onclick =gomain;
}

function catchWhoisCachedData(site_key){  
AppendInLocalData(site_key+"_whois_header",'whois'); 
AppendInLocalData(site_key+"_domain_info",'whois'); 
AppendInLocalData(site_key+"_registrant_contact",'whois'); 
AppendInLocalData(site_key+"_admin_contact",'whois'); 
AppendInLocalData(site_key+"_technical_contact",'whois');  
document.getElementById('gomain').onclick =gomain;
}
function alexa_data(eventObj){
       var host = extractHostname(get_clean_url());
	   var key = host+'_search_graph';
       chrome.storage.local.get(key, function(result) {   
	   var output = JSON.parse(result[key] || null);    
	   if(output!=null && JSON.parse(result[key]).val.length>10){
	   console.info("Am having cache");
	    catchAlexaCachedData(host);
		$('#main_page').hide(); 
		$('#gomain').show();
	   }else{   
	   console.info("I don't have cache");
		$('#progress_gif').show();
		$('#main_page_under').hide();
		var open_url="https://rohitcoder.cf/research/whois_api/alexa.php";
		$.get(open_url,
		{
			site: get_clean_url()
		},
		function(data, status){  
		   $('#progress_gif').hide();
		   $('#gomain').show();
		   host = host+'_';
		   var alexa_header = "<br><h2>Metrics</h2>";
		   setLocalSettings(host+"alexa_header",alexa_header); 
		   $('#main_page').hide();
		   var global_rank = '<font color=blue><b>Global Rank: </b></font><br><img src="https://www.alexa.com/images/icons/globe-sm.jpg"></img>'+data.global_rank+"<br>";
		   setLocalSettings(host+"global_rank",global_rank); 
		   var global_graph = '<font color=blue><b>Global Graph: </b></font><br><img src="'+data.global_graph+'" width="100%"></img>';
		   var global_data = global_graph+global_rank;
		   setLocalSettings(host+"global_data",global_data); 
		   var country_rank = "<font color=blue><b>Rank In "+data.country.name+": </b></font><br><img src="+data.country.flag+"> "+data.country.rank;
		   setLocalSettings(host+"country_rank",country_rank); 
		   var search_graph = '<font color=blue><b>Search Graph:</b></font></font><Br><img src="'+data.search_graph+'" width="100%"></img><Br>'+data.search_data;
		   setLocalSettings(host+"search_graph",search_graph); 
		   var top_keywords = '<br><font color=blue><b>Best keywords:</b></font></font><Br>'+data.top_search_keywords;
		   setLocalSettings(host+"top_keywords",top_keywords); 
		   var demographics_country_table = "<br><font color=blue><b>Top 5 traffic origin countries: </b></font><br>"+data.demographics_country_table;
		   setLocalSettings(host+"demographics_country_table",demographics_country_table); 
		   var engage_data = data.engage_content;
		   setLocalSettings(host+"engage_data",engage_data); 
		   var upstream_sites = "<br>Which sites did people visit immediately before this site?<br>"+data.upstream_sites;
		   setLocalSettings(host+"upstream_sites",upstream_sites); 
		   var count_linkin_sites = "<br>"+data.count_linkin_sites;
		   setLocalSettings(host+"count_linkin_sites",count_linkin_sites); 
		   var linkin_sites = "<br>"+data.linkin_sites;
		   setLocalSettings(host+"linkin_sites",linkin_sites); 
		   var similar_sites = "<Br>"+data.similar_sites;
		   setLocalSettings(host+"similar_sites",similar_sites); 
		   var sub_domains = "<font color=blue><b>Subdomains</b></font><br>"+data.subdomains;
		   setLocalSettings(host+"subdomains",sub_domains); 
		   var load_speed = data.load_speed;
		   setLocalSettings(host+"load_speed",load_speed); 
		   var copyright_to = "<center>Data by <b>Alexa</b></center>";
		   setLocalSettings(host+"copyright_to",copyright_to); 
		   var final_data = alexa_header+global_data+country_rank+demographics_country_table+search_graph+top_keywords+engage_data+upstream_sites+count_linkin_sites+linkin_sites+similar_sites+sub_domains+load_speed+copyright_to;  
		   $('#alexa_html_data').html(final_data);
		   $('#alexa_html_data').show();
		   document.getElementById('gomain').onclick =gomain;
		});
	}
}); 
}
function whois_statistics(eventObj){
    var open_url="https://www.whois.com/whois/" + get_clean_url();
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}
function whois_data(eventObj){
       var host = extractHostname(get_clean_url());
	   var key = host+'_domain_info';
       chrome.storage.local.get(key, function(result) {   
	   var output = JSON.parse(result[key] || null);    
	   if(output!=null && JSON.parse(result[key]).val.length>10){
	   console.info("Am having Whois cache");
	   catchWhoisCachedData(host); //dimple
	   $('#main_page').hide(); 
		$('#gomain').show();
	   }else{   
	    console.info("I don't have cache");
		$('#progress_gif').show();
		$('#main_page_under').hide();
		var open_url="https://rohitcoder.cf/research/whois_api/";
		$.get(open_url,
		{
			site: get_clean_url()
		},
		function(data, status){
		   $('#progress_gif').hide();
		   $('#gomain').show();
		   var whois_header = "<br><h2>Whois info</h2>";
		   var host = extractHostname(get_clean_url());
		   setLocalSettings(host+"_whois_header",whois_header); 
		   setLocalSettings(host+"_domain_info",data.domain_info); 
		   setLocalSettings(host+"_registrant_contact",data.registrant_contact); 
		   setLocalSettings(host+"_admin_contact",data.admin_contact); 
		   setLocalSettings(host+"_technical_contact",data.technical_contact);  
		   $('#main_page').hide();$('#whois_html_data').html(whois_header+data.domain_info+data.registrant_contact+data.admin_contact+data.technical_contact);
		   $('#whois_html_data').show(); 
		   document.getElementById('gomain').onclick =gomain;
		});
	}
}); 
}

function local_settings_btn(){ 
$('#main_page').hide();
$('#gomain').show();
$('#local_settings_html_data').show();
}
function gomain(){ 
$('#gomain').hide();
$('#main_page_under').show();
$('#main_page').show();
$('#whois_html_data').hide();
$('#local_settings_html_data').hide();
$('#alexa_html_data').hide();
}
function search_tweet(eventObj){
    var url = get_clean_url();
    if(url.includes('http://')){
        url=url.substring(7);
    }else if(url.includes('https://')){
        url=url.substring(8);
    }
    if(url.slice(-1)=='/') url=url.substring(0,url.length-1);
    var open_url="https://twitter.com/search?q="+url;
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}

function display_list(key_word){ 
    $sbox = document.getElementById('suggestion-box');
    $sbox.style.display='none';
    $sbox.innerHTML="";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://web.archive.org/__wb/search/host?q="+key_word, true);
    xhr.onload=function(){
        $sbox.style.display='none';
        $sbox.innerHTML="";
        var data=JSON.parse(xhr.response);
        var n=data.hosts.length;
        if(n>0 && document.getElementById('search_input').value!=''){
            $sbox.style.display='block';
            for(var i=0;i<n;i++){
                var a=document.createElement('a');
                    a.onclick=function(event){
                    document.getElementById('search_input').value=event.target.innerHTML;
                    $sbox.style.display='none';
                    $sbox.innerHTML="";
                };
                a.setAttribute('role','button');
                a.innerHTML=data.hosts[i].display_name;
                var li=document.createElement('li');
                li.appendChild(a);
                $sbox.appendChild(li);
            }
        }
    };
    xhr.send(null);
}

function display_suggestions(e){
    document.getElementById('suggestion-box').style.display='none';
    document.getElementById('suggestion-box').innerHTML="";
    //setTimeout is used to get the text in the text field after key has been pressed
    window.setTimeout(function(){
        var len=document.getElementById('search_input').value.length;
        if((len)>=3){ 
            display_list(document.getElementById('search_input').value);
        }else{
            document.getElementById('suggestion-box').style.display='none';
            document.getElementById('suggestion-box').innerHTML="";
        }
    },0.1);
}

function about_support(){
    window.open("about.html", "", "width=1000, height=1000").focus();
}
function resetCustomizations(){
chrome.storage.sync.remove(["btn_bg","btn_text_input","btn_hvr_bg","btn_hvr_txt"],function(){
 var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
});
window.close();
}
function saveLocalSettings(){
var btn_bg = document.getElementById('btn_bg_input').value;
syncLocalSettings('btn_bg',btn_bg);
var btn_bg = document.getElementById('btn_text_input').value;
syncLocalSettings('btn_text_input',btn_bg);
var btn_bg = document.getElementById('btn_hvr_bg').value;
syncLocalSettings('btn_hvr_bg',btn_bg);
var btn_bg = document.getElementById('btn_hvr_txt').value;
syncLocalSettings('btn_hvr_txt',btn_bg);
window.close();
}   
/* Launch save configs */
chrome.storage.sync.get('btn_bg', function(result) {var output = JSON.parse(result['btn_bg'] || null);$('#btn_bg_input').val(output.val);$(".button-simple").css("background",output.val);});
chrome.storage.sync.get('btn_text_input', function(result) {var output = JSON.parse(result['btn_text_input'] || null);$('#btn_text_input').val(output.val);$(".button-simple").css("color",output.val);});
chrome.storage.sync.get('btn_hvr_bg', function(result) {
var output = JSON.parse(result['btn_hvr_bg'] || null); 
if(output.val!=null){
$('#btn_hvr_bg').val(output.val);
var css = '.button-simple:hover{ background-color: '+output.val+' !important }';
var style = document.createElement('style');
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);
}
});
chrome.storage.sync.get('btn_hvr_txt', function(result) {
var output = JSON.parse(result['btn_hvr_txt'] || null); 
if(output.val!=null){
$('#btn_hvr_txt').val(output.val);
var css = '.button-simple:hover{ color: '+output.val+' !important }';
var style = document.createElement('style');
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);
}
});
/* Customized Configuration settings end here */
function syncLocalSettings(akey,value){ 
      var key = akey,
        testPrefs = JSON.stringify({
            'val': value
        });
      var jsonfile = {};
      jsonfile[key] = testPrefs;
	  chrome.storage.sync.set(jsonfile, function() { 
	   console.info("Data synced With key -"+key+" and now ready to rock on.");
	   });
}
function resetChromeData(){
chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    } 
});
chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
}); 
window.close();
}
function setLocalSettings(akey,value){ 
      var key = akey,
        testPrefs = JSON.stringify({
            'val': value
        });
      var jsonfile = {};
      jsonfile[key] = testPrefs;
	  chrome.storage.local.set(jsonfile, function() {  
	   console.info("Data synced With key -"+key+" and now ready to rock on.");
	   });
}
function makeModal(){
    var url = get_clean_url();
    console.log("Making RT for "+url);
    chrome.runtime.sendMessage({message: "makemodal",rturl:url});
}

/** Disabled code for the autosave feature **/
//function restoreSettings() {
//  chrome.storage.sync.get({
//    as:false
//  }, function(items) {
//    document.getElementById('as').checked = items.as;  
//      if(items.as){
//          chrome.runtime.sendMessage({message: "start_as"}, function(response) {});
//      }
//     });
//}
//
//function saveSettings(){
//    var as = document.getElementById('as').checked;
//      chrome.storage.sync.set({
//      as: as
//  });
//}
//function showSettings(eventObj){
//    var target=eventObj.target;
//    if(target.getAttribute('toggle')=='off'){
//        document.getElementById('settings_btn').setAttribute('toggle','on');
//    document.getElementById('settings_div').style.display="block";
//    }else{
//        document.getElementById('settings_btn').setAttribute('toggle','off');
//        document.getElementById('settings_div').style.display="none";
//    }
//}
//restoreSettings();
//document.getElementById('settings_div').style.display="none";

window.onload=get_url;

document.getElementById('save_now').onclick = save_now;
document.getElementById('recent_capture').onclick = recent_capture;
document.getElementById('first_capture').onclick = first_capture;
document.getElementById('fb_share').onclick =social_share;
document.getElementById('twit_share').onclick =social_share;
document.getElementById('gplus_share').onclick =social_share;
document.getElementById('linkedin_share').onclick =social_share;
document.getElementById('alexa_data').onclick =alexa_data;
document.getElementById('whois_data').onclick =whois_data;
document.getElementById('search_tweet').onclick =search_tweet;
document.getElementById('gomain').onclick = gomain;
document.getElementById('about_support_button').onclick = about_support;
document.getElementById('settings_btn').onclick = local_settings_btn;
document.getElementById('save_settings').onclick = saveLocalSettings;
document.getElementById('reset_data').onclick = resetChromeData;
document.getElementById('reset_customizations').onclick = resetCustomizations;

document.getElementById('overview').onclick = view_all;
//document.getElementById('settings_btn').onclick=showSettings;
//document.getElementById('settings_save_btn').onclick=saveSettings;
document.getElementById('make_modal').onclick=makeModal;
document.getElementById('search_input').addEventListener('keydown',display_suggestions);
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='urlnotfound'){
  	alert("URL not found in wayback archives!");
  }
});
