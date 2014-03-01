g_path_prefix = '/content';

g_navs = [];
g_path = null;

g_elContent = null;
g_elTop = null;
g_goCount = -1;

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
//g_Info('Initializing...');
	if( document.location.host.indexOf('cgru.info') != -1 )
		$('sflogo').innerHTML = '<img src="http://sflogo.sourceforge.net/sflogo.php?group_id=178692&amp;type=12" width="120" height="30" border="0" alt="SourceForge.net"/>';

	document.body.onkeydown = g_OnKeyDown;

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ )
	{
		if( navs[i].id == 'rules') continue;
		navs[i].onclick = g_NavClicked;
		g_navs.push( navs[i]);
	}

	g_elContent = $('content');
	g_elTop = $('ontop');
	g_elTop.onclick = function(e){ g_DisplayOnTop(false);};

    var barW = $('navig').offsetWidth - $('navig').clientWidth;
	$('navig').style.right = (-barW)+'px';
	$('content').style.right = (-barW)+'px';

	window.onpopstate = g_Navigate;

	g_Navigate();
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

function g_NavClicked( i_evt)
{
	i_evt.preventDefault();
	var path = i_evt.currentTarget.href;
	window.history.pushState('object','CGRU', path);
console.log('g_NavClicked:' + path);
	g_Navigate();
}

function g_Navigate()
{
//g_Info( g_path);
//	g_path = decodeURI( i_path);
	var path = document.location.pathname;
	if( path == '/' ) path = '/home';
	path = path.split('#')[0];
	if( g_path == path )
	{
		g_GotoHash();
		return;
	}

	g_path = path;

console.log('g_Navigate:' + path);

//console.log( path);
	for( var i = 0; i < g_navs.length; i++ )
	{
//console.log( g_navs[i].getAttribute('href').split('#')[0]);
		if( path == g_navs[i].getAttribute('href').split('#')[0])
		{
			if( g_goCount == 0 )
				g_navs[i].scrollIntoView( false);
			g_navs[i].classList.add('current');
		}
		else
			g_navs[i].classList.remove('current');
	}

	g_DisplayLoading();
	GET( path);
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

	g_GotoHash();

	g_ProcessContent();
}

function g_GotoHash()
{
	var hash = document.location.hash;
	if( hash && hash.length )
	{
		if( hash.indexOf('#') == 0 )
			hash = hash.substr(1);
		var el = document.getElementById( hash);
		if( el )
		{
			el.scrollIntoView(true);
			g_anchor_el = el;
			var imgs = g_elContent.getElementsByTagName('img');
			for( var i = 0; i < imgs.length; i++)
				imgs[i].onload = function(){ g_anchor_el.scrollIntoView(true)};
		}
	}
}

function g_ProcessContent()
{
console.log('g_ProcessContent:');
	var anchors = g_elContent.getElementsByClassName('anchor');
	for( var i = 0; i < anchors.length; i++)
		anchors[i].onclick = function(e){
				document.location.hash = e.currentTarget.getAttribute('id');
			};

	var links = g_elContent.getElementsByClassName('local_link');
	for( var i = 0; i < links.length; i++ )
	{
console.log( links[i].href);
		links[i].onclick = g_NavClicked;
	}

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
	document.getElementById('notfound_file').innerHTML = '<b>'+document.location.pathname+'</b>';
}

function GET( i_path)
{
	var path = i_path;

	if( path.indexOf('.html') == -1 )
		path += '.html';
	path = g_path_prefix + path;
console.log('GET:' + path);

	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('text/html');
	xhr.open('GET', path, true);
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
			{
				if( xhr.responseText.indexOf('INDEX_MARKER') != -1 )
				{
					g_DisplayNotFound();
					return;
				}
				g_SetContent( xhr.responseText);
			}
			else
				g_Error('File '+i_path+' is empty.');
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
