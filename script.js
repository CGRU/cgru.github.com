g_content = 'content/';
g_path = 'home.html';
g_navs = [];

function g_Init()
{
//g_Info('Initializing...');

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);
	navs = document.getElementById('navig').getElementsByTagName('div');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);

	for( var i = 0; i < g_navs.length; i++ )
		g_navs[i].onclick = g_NavClick;

	window.onhashchange = g_PathChanged;

	g_PathChanged();

//	g_Analytics();
}

function g_PathChanged()
{
	var path = document.location.hash;
	if( path.indexOf('#') == -1 )
		path = g_path;
	else
		path = path.replace('#','');

	g_Navigate( path);
}

function g_NavClick( i_evt)
{
	var nav = i_evt.currentTarget;
	var path = nav.getAttribute('file');
	GO( path);
}

function GO( i_path)
{
	document.location.hash = i_path;
	g_Navigate( i_path);
}

function g_Navigate( i_path)
{
//g_Info( g_path);
	g_path = i_path;

	for( var i = 0; i < g_navs.length; i++ )
		if( i_path == g_navs[i].getAttribute('file'))
			g_navs[i].classList.add('current');
		else
			g_navs[i].classList.remove('current');

	g_DisplayLoading();
	GET();
}

function g_DisplayLoading( i_display)
{
	if( i_display == null ) i_display = true;
	document.getElementById('loading').style.display = i_display ? 'block':'none';
}

function g_SetContent( i_data)
{
	g_DisplayLoading( false);
	g_DisplayNotFound( false);
	document.getElementById('content').innerHTML = i_data;
}

function g_Info( i_msg)
{
	document.getElementById('content').innerHTML = i_msg;
}
function g_Error( i_msg)
{
	g_Info('Error: '+i_msg);
}

function g_DisplayNotFound( i_display)
{
	if( i_display == null ) i_display = true;
	if( i_display ) g_SetContent('');
	document.getElementById('notfound').style.display = i_display ? 'block':'none';
	document.getElementById('notfound_file').innerHTML = '<b>'+g_path+'</b>';
}

function GET()
{
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('application/json');
	xhr.open('GET', g_content+g_path, true);
	xhr.send(null);

	xhr.onreadystatechange = function()
	{
		if( xhr.readyState == 4 )
		{
			if(( window.location.protocol == 'http:' ) && ( xhr.status != 200 ))
			{
				g_DisplayNotFound();
				return;
			}

//g_Info( xhr.status + ':' + xhr.statusText);
			if( xhr.responseText.length )
				g_SetContent( xhr.responseText);
			else
				g_Error('File '+g_path+' is empty.');
		}
//		else
//			g_Info('Can`t get file '+g_path);
	}
}

function g_Analytics()
{
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36528898-1']);
_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
}
