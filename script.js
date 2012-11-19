g_content = 'content/';
g_path = 'home.html';
g_navs = [];

function g_Init()
{
	g_Info('g_Init()');

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);
	navs = document.getElementById('navig').getElementsByTagName('div');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);

	for( var i = 0; i < g_navs.length; i++ )
		g_navs[i].onclick = g_NavClick;

	window.onhashchange = g_PathChanged;

	g_PathChanged();

	g_Analytics();
}

function g_PathChanged()
{
	var path = document.location.hash;
	if( path.indexOf('#') == -1 )
		path = g_path;
	else
		path = path.replace('#','');

	GO( path);
}

function g_NavClick( i_evt)
{
	var nav = i_evt.currentTarget;
	var path = nav.getAttribute('file');
	document.location.hash = path;
	GO( path);
}

function GO( i_path)
{
//	g_Info( g_path);
	g_path = i_path;

	for( var i = 0; i < g_navs.length; i++ )
		if( i_path == g_navs[i].getAttribute('file'))
			g_navs[i].classList.add('current');
		else
			g_navs[i].classList.remove('current');

	document.getElementById('loading').style.display = 'block';
	GET();
}

function g_SetContent( i_data)
{
	document.getElementById('content').innerHTML = i_data;
	document.getElementById('loading').style.display = 'none';
}

function g_Info( i_msg)
{
	document.getElementById('content').innerHTML = i_msg;
}
function g_Error( i_msg)
{
	g_Info('Error: '+i_msg);
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
			g_Info( xhr.status + ':' + xhr.statusText);
			if( xhr.responseText.length )
				g_SetContent( xhr.responseText);
			else
				g_Error('File '+g_path+' is empty.');
		}
		else
			g_Info('Can`t get file '+g_path);
	}
}

function g_Analytics()
{
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36436411-1']);
_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
}
