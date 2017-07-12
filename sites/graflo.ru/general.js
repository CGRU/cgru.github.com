g_elContent_cur = null;
g_elContent_new = null;
g_elContent_old = null;
g_nav_default_path = 'about';
g_nav_items = {};

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
	bg_Init();

	window.onhashchange = g_NavHashChanged;

	g_NavCreateNewDiv();

	var args = {};
	args.path = "navigation.json";
	args.func = g_NavCreateTree;
	GET( args);
}

function g_NavCreateTree( i_httpRequest)
{
	if( i_httpRequest.status != 200 )
	{
		console.log('Navigation tree file not found.');
		return;
	}

	var tree = null;
	try { tree = JSON.parse( i_httpRequest.responseText);}
	catch( err)
	{
		console.log( err.message+'\n'+i_httpRequest.responseText);
		tree = null;
	}
	//console.log( JSON.stringify( tree));
	if( tree == null )
		return;

	var items = tree.items;
	if( items == null )
	{
		console.log('Navigation tree contains no items.')
		return;
	}

	g_NavCreateItems( items, $('navig_items'),'/', 0);

	g_NavHashChanged();
}

function g_NavCreateItems( i_items, i_elParent, i_path, i_depth)
{
	for( var i = 0; i < i_items.length; i++)
	{
		var item = i_items[i];
		var elItem = document.createElement('div');
		i_elParent.appendChild( elItem);
		elItem.classList.add('nav_item');
		elItem.style.marginLeft = i_depth * 16 + 'px';

		if( item.folder )
		{
			elItem.classList.add('nav_folder');
			var elName = document.createElement('div');
			elItem.appendChild( elName);
			elName.classList.add('nav_name');
			elName.textContent = item.name;

			if( item.items )
				g_NavCreateItems( item.items, elItem, i_path + item.folder + '/', i_depth+1);
		}
		else
		{
			elItem.classList.add('nav_link');
			var elLink = document.createElement('a');
			elItem.appendChild( elLink);
			elLink.classList.add('nav_name');
			elLink.textContent = item.name;
			elLink.href = '#' + i_path + item.page;
			elLink.onclick = function(){ this.blur();}
		}
	}
}

function g_NavHashChanged()
{
	var path = document.location.hash;

	if( path.indexOf('#') == 0 )
		path = path.substr(1);

	if( path == '' )
		path = g_nav_default_path;

	if( path[0] != '/')
		path = '/' + path;

	var args = {};
	args.path = 'content' + path + '.html';
	args.func = g_NavPageLoaded;
	GET( args);
}

function g_NavCreateNewDiv()
{
	var div = document.createElement('div');
	$('content').appendChild( div);
	div.classList.add('content_new');
	g_elContent_new = div;
}

function g_NavPageLoaded( i_httpRequest)
{
	g_elContent_new.innerHTML = i_httpRequest.responseText;
	g_elContent_new.classList.remove('content_new');
	if( i_httpRequest.status != 200 )
		g_elContent_new.classList.add('content_error');

	if( g_elContent_cur )
	{
		if( g_elContent_old )
			$('content').removeChild( g_elContent_old);

		g_elContent_old = g_elContent_cur;
		g_elContent_old.classList.add('content_old');
	}
	
	g_elContent_cur = g_elContent_new;

	g_NavCreateNewDiv();
}

function GET( i_args)
{
	var xhr = new XMLHttpRequest();
	//xhr.overrideMimeType('text/html');
	//xhr.overrideMimeType('application/json');
	xhr.open('GET', i_args.path, true);
	xhr.send(null);
	xhr.m_args = i_args;

	xhr.onload = g_XHR_OnLoad = function() {
		this.m_args.func( this);
	}
	xhr.onerror = function() {
		console.log(this);
		console.log('ERROR: ' + this.m_args.path);
	}
}

