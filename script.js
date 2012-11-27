g_path_prefix = 'content/';
g_path = 'home.html';
g_navs = [];

g_elContent = null;
g_elTop = null;

function g_Init()
{
//g_Info('Initializing...');
	document.body.onkeydown = function(e){ g_DisplayOnTop(false);};

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ ) g_navs.push( navs[i]);

	for( var i = 0; i < g_navs.length; i++ )
		g_navs[i].onclick = g_NavClick;

	g_elContent = document.getElementById('content');
	g_elTop = document.getElementById('ontop');
	g_elTop.onclick = function(e){ g_DisplayOnTop(false);};

	window.onhashchange = g_PathChanged;

	g_PathChanged();
}

function g_PathChanged()
{
	var path = document.location.hash;
	if( path.indexOf('#') == -1 )
		path = g_path;
	else
		path = path.substr(1);

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
//	g_Navigate( i_path);
}

function g_Navigate( i_path)
{
//g_Info( g_path);
	
	g_path = i_path;

	path = g_path.split('#')[0];
	for( var i = 0; i < g_navs.length; i++ )
		if( path == g_navs[i].getAttribute('file'))
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
	g_DisplayOnTop( false);
	g_elContent.innerHTML = i_data;

	var paths = g_path.split('#');
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

//	svg += '" stroke="black" stroke-width="3" fill="none" /></svg>';
	svg += '</svg>';

//	i_el.textContent = svg;
	i_el.innerHTML = svg;
}
