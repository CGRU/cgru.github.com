g_site = 'cgru.info';
g_path_prefix = '/content';

g_navs = [];
g_path = null;

g_elContent = null;
g_elTop = null;
g_goCount = -1;
g_get_cache = {};

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
//g_Info('Initializing...');
	if( document.location.host.indexOf( g_site) != -1 )
		$('sflogo').innerHTML = '<img src="https://sflogo.sourceforge.net/sflogo.php?group_id=178692&amp;type=12" width="120" height="30" border="0" alt="SourceForge.net"/>';

	document.body.onkeydown = g_OnKeyDown;

	var navs = document.body.getElementsByClassName('navig');
	for( var i = 0; i < navs.length; i++ )
	{
		if( navs[i].id == 'rules') continue;

		// Replace cgru.info to local site, if needed:
		if( document.location.host.indexOf( g_site) == -1 )
		{
			var href = navs[i].getAttribute('href');
			href = href.replace( g_site, document.location.host);
			navs[i].setAttribute('href', href);
		}

		navs[i].onclick = g_NavClicked;
		g_navs.push( navs[i]);
	}

	g_elContent = $('content');
	g_elTop = $('ontop');
	g_elTop.onclick = function(e){ g_DisplayOnTop(false);};

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
//console.log('g_NavClicked:' + i_evt.currentTarget.href);
	GO( i_evt.currentTarget.href);
}

function GO( i_path)
{
	window.history.pushState('object','CGRU', i_path);
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

//console.log('g_Navigate:' + path);
	for( var i = 0; i < g_navs.length; i++ )
	{
		var href = g_navs[i].href.split('#')[0];

		// Remove protocol and host from href:
		if( href.indexOf('http') == 0 )
		{
			href = href.replace(/https?:\/\//,'');
			href = href.replace( document.location.host,'');
		}
//console.log( href);

		if( path == href )
		{
			if( g_goCount == 0 )
				g_navs[i].scrollIntoView( false);
			g_navs[i].classList.add('current');
		}
		else
			g_navs[i].classList.remove('current');
	}
//console.log( path);

	g_DisplayLoading();

	if( path.indexOf('.html') == -1 )
		path += '.html';
	path = g_path_prefix + path;

	GET({'path':path,'func':g_SetContent});
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
//console.log('g_ProcessContent:');
	var anchors = g_elContent.getElementsByClassName('anchor');
	for( var i = 0; i < anchors.length; i++)
		anchors[i].onclick = function(e){
				document.location.hash = e.currentTarget.getAttribute('id');
			};

	var links = g_elContent.getElementsByClassName('local_link');
	for( var i = 0; i < links.length; i++ )
	{
//console.log( links[i].href);
		links[i].onclick = g_NavClicked;
	}


	// Process sources:
	var sources = g_elContent.getElementsByClassName('source');
	for( var i = 0; i < sources.length; i++)
	{
		var el = sources[i];
		var src = g_path_prefix + '/' + el.getAttribute('source');
		GET({'path':src,'func':g_SetSource,'el':el,'section':el.getAttribute('section'),'display_not_found':false});
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

function g_SetSource( i_data, i_args)
{
//console.log('i_data=' + i_data);
	var text = i_data;

	if( i_args.section && i_args.section.length )
	{
		var text = '';
		for(;;)
		{
			var i = i_data.indexOf( i_args.section);
			if( i < 0 ) break;

			i_data = i_data.substring( i);
			i_data = i_data.substring( i_data.indexOf('\n'));

			text += i_data.substring( 0, i_data.indexOf('"":""'));

			i_data = i_data.substring( i_data.indexOf('"":""'));
		}
	}

	text = text.replace(/\n\t/g,'\n');
	i_args.el.innerHTML = text;
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
	if (i_msg == null)
	{
		display = false;
	}
	else if (i_msg.length)
	{
		g_elTop.innerHTML = i_msg;
		display = true;
	}
	else
	{
		display = false;
	}
	
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

function g_DisplayNotFound(i_display, i_path)
{
	if( i_display == null ) i_display = true;
	if( i_display ) g_SetContent('');
	document.getElementById('notfound').style.display = i_display ? 'block':'none';
	var path = i_path;
	if (null == i_path)
		i_path = document.location.pathname;
	document.getElementById('notfound_file').innerHTML = '<b>'+path+'</b>';
}

function GET( i_args)
{
	var path = i_args.path;
//console.log('Get=' + path);

	if( g_get_cache[path] )
	{
//console.log('Get CACHED=' + path);
		i_args.func( g_get_cache[path]);
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('text/html');
	//xhr.overrideMimeType('application/json');
	xhr.open('GET', path, true);
	//xhr.setRequestHeader('Access-Control-Allow-Origin','*');
	xhr.send(null);
	xhr.m_args = i_args;

	xhr.onload = g_XHR_OnLoad;
	xhr.onerror = function() {
		console.log(this);
		console.log('ERROR. Can`t get: ' + this.m_args.path);
		if (this.m_args.display_not_found === false)
		{
			if (this.m_args.el)
			{
				this.m_args.el.textContent = 'ERROR. Can`t get: ' + this.m_args.path;
				this.m_args.el.classList.add('error');
			}
		}
		else
			g_DisplayNotFound(true, this.m_args.path);
	}
}

function g_XHR_OnLoad()
{
	if( this.responseText.indexOf('INDEX_MARKER') != -1 )
	{
		console.log(this);
		console.log('ERROR. Can`t get: ' + this.m_args.path);
		if (this.m_args.display_not_found === false)
		{
			if (this.m_args.el)
			{
				this.m_args.el.textContent = 'ERROR. Can`t get: ' + this.m_args.path;
				this.m_args.el.classList.add('error');
			}
		}
		else
			g_DisplayNotFound(true, this.m_args.path);
		
		return;
	}
	this.m_args.func( this.responseText, this.m_args);
	g_get_cache[this.m_args.path] = this.responseText;
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
