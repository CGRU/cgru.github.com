g_path_prefix = 'content/';
g_path = 'home.html';
g_navs = [];

g_elContent = null;
g_elTop = null;
g_goCount = 0;

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
//g_Info('Initializing...');
	var sflogo = '<img src="images/sourceforge.png" border="0" alt="sourceforge"/>';
	if( document.location.host.indexOf('cgru.info') != -1 )
		sflogo = '<img src="http://sflogo.sourceforge.net/sflogo.php?group_id=178692&amp;type=12" width="120" height="30" border="0" alt="SourceForge.net"/>';
	$('sflogo').innerHTML = sflogo;

	document.body.onkeydown = g_OnKeyDown;

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);

	for( var i = 0; i < g_navs.length; i++ )
		g_navs[i].onclick = g_NavClick;

	g_elContent = $('content');
	g_elTop = $('ontop');
	g_elTop.onclick = function(e){ g_DisplayOnTop(false);};

    var barW = $('navig').offsetWidth - $('navig').clientWidth;
	$('navig').style.right = (-barW)+'px';
	$('content').style.right = (-barW)+'px';

	window.onhashchange = g_PathChanged;

	g_PathChanged();
}

function g_OnKeyDown( i_evt)
{
	g_DisplayOnTop(false);
	switch( i_evt.keyCode )
	{
	case 27: // ESC
		g_InfoCloseAll();
	}
}

function g_PathChanged()
{
	var path = document.location.hash;
	if( path.indexOf('#') == 0 )
		path = path.substr(1);
	else
		path = g_path;

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
	g_goCount++;
	document.location.hash = i_path;
}

function g_Navigate( i_path)
{
//g_Info( g_path);
	
	g_path = decodeURI( i_path);

	path = g_path.split('#')[0];
	for( var i = 0; i < g_navs.length; i++ )
		if( path == g_navs[i].getAttribute('file'))
		{
			if( g_goCount == 0 )
				g_navs[i].scrollIntoView( false);
			g_navs[i].classList.add('current');
		}
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
	g_DisplayOnTop( false);
	g_elContent.innerHTML = i_data;

	var paths = [];
	if( g_path.indexOf('#') != -1) paths = g_path.split('#');
	if( g_path.indexOf('?') != -1) paths = g_path.split('?');

	if( paths.length > 1 )
		document.getElementById(paths[1]).scrollIntoView(true);

	g_ProcessContent();
}

function g_ProcessContent()
{
	var anchors = g_elContent.getElementsByClassName('anchor');
	for( var i = 0; i < anchors.length; i++)
		anchors[i].onclick = function(e){
				var hash = g_path.split('#')[0];
				document.location.hash = hash+'#'+e.currentTarget.getAttribute('id');
			};

	var forontops = g_elContent.getElementsByClassName('forontop');
	for( var i = 0; i < forontops.length; i++)
		forontops[i].onclick = function(e){ g_ForOnTopClicked(e.currentTarget);};

	var arrows = g_elContent.getElementsByClassName('arrows');
	for( var i = 0; i < arrows.length; i++)
		g_DrawArrow( arrows[i]);

	var infos = g_elContent.getElementsByClassName('info');
	for( var i = 0; i < infos.length; i++)
		infos[i].onclick = g_InfoClicked;
}

function g_InfoClicked( i_evt)
{
	i_evt.stopPropagation(); 
	var elEvt = i_evt.currentTarget;
	if( elEvt.classList.contains('opened'))
		return;

	elEvt.classList.add('opened');
	var txt = elEvt.getAttribute('info');
	txt = txt.replace(/''/g,'"');

	var elInfo = document.createElement('div');
	elInfo.classList.add('wndinfo');
	elInfo.elEvt = elEvt;
	g_elContent.appendChild( elInfo);

	var elClose = document.createElement('div');
	elClose.classList.add('close');
	elClose.textContent = 'x';
	elClose.onclick = function(e){ g_InfoClose(e.currentTarget.parentNode);};
	elInfo.appendChild( elClose);

	var elText = document.createElement('div');
	elText.classList.add('text');
	elText.innerHTML = txt;
	elInfo.appendChild( elText);

	var x = 0, y = 0;
	var elOffset = elEvt;
	while( elOffset.parentNode != g_elContent )
	{
		x += elOffset.offsetLeft;
		y += elOffset.offsetTop;
		elOffset = elOffset.parentNode;
	}
	var w = elInfo.offsetWidth;
	var h = elInfo.offsetHeight;
	y -= h;

//window.console.log('x='+x+' y='+y+' w='+w+' h='+h+' cw='+g_elContent.offsetWidth+' ch='+g_elContent.innerHeight);
	var pw = g_elContent.clientWidth;
	if( x + w > pw ) x = pw - w;
	x -= 10;
	if( x < 0 ) x = 0;

	elInfo.style.left = x+'px';
	elInfo.style.top  = y+'px';
}
function g_InfoClose( i_elInfo)
{
	i_elInfo.elEvt.classList.remove('opened');
	g_elContent.removeChild( i_elInfo);
}
function g_InfoCloseAll()
{
	var infos = g_elContent.getElementsByClassName('wndinfo');
	var infoslen = infos.length;
//	for( var i = 0; i < infos.length; i++)
	for( var i = 0; i < infoslen; i++)
		g_InfoClose( infos[0]);
}

function g_ForOnTopClicked( i_el)
{
	g_DisplayOnTop( '<img src="'+i_el.getAttribute('src')+'"/>');
}

function g_DisplayOnTop( i_msg)
{
	var display = false;
	if( i_msg == null ) display = false;
	else if( i_msg.length )
	{
		g_elTop.innerHTML = i_msg;
		display = true;
	}
	else display = false;
	
	g_elTop.style.display = display ? 'block':'none';
}

function g_Info( i_msg)
{
	g_elContent.innerHTML = i_msg;
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
	var path = g_path.split('#')[0];

	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('application/json');
	xhr.open('GET', g_path_prefix+path, true);
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

			if( xhr.responseText.length )
				g_SetContent( xhr.responseText);
			else
				g_Error('File '+g_path+' is empty.');
		}
	}
}

function g_DrawArrow( i_el)
{
	var arrows = eval( i_el.getAttribute('arrows'));
	i_el.innerHTML = arrows;

	var path_id = 0;
	var width = i_el.style.width;
	var height = i_el.style.height;
	var svg = '<svg version="1.1"';
	svg += ' height="'+height+'" width="'+width+'">';

	var cap = [[-5,-10],[0,0],[5,-10]];
	for( var a = 0; a < arrows.length; a++)
	{
		svg += '<path id="path'+(path_id++)+'" d="M';
		var x,y,px,py = 0;
		for( var p = 1; p < arrows[a].length; p++)
		{
			px = x; py = y;
			if( p > 1 ) svg += ' L'
			x = arrows[a][p][0];
			y = arrows[a][p][1];
			svg += ' '+x+' '+y;
		}
		svg += ' M';
		px = x-px; py = y-py;
		for( var p = 0; p < cap.length; p++)
		{
			if( p ) svg += ' L'
			cx = cap[p][0];
			cy = cap[p][1];
			if( Math.abs(px) > Math.abs(py))
			{
				var tmp = cx;
				cx = cy;
				cy = tmp;
			}
			if( px < 0 ) cx = -cx;
			if( py < 0 ) cy = -cy;
			cx += x;
			cy += y;
			svg += ' '+cx+' '+cy;
		}
		svg += '" stroke="rgb('+arrows[a][0][0]+','+arrows[a][0][1]+','+arrows[a][0][2]+')"';
		svg += ' stroke-width="'+arrows[a][0][3]+'"';
		svg += ' stroke-linejoin="miter"';
		svg += ' fill="none" />';
	}

	svg += '</svg>';

//	i_el.textContent = svg;
	i_el.innerHTML = svg;
}
