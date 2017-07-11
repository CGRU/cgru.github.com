g_nav_cur_item = null;
g_nav_old_item = null;
g_nav_default_path = 'about';
g_nav_items = {};

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
	bg_Init();

	window.onhashchange = g_NavHashChanged;

	var args = {};
	args.path = "navigation.json";
	args.func = g_NavCreateTree;
	GET( args);
}

function g_NavCreateTree( i_data)
{
	var tree = null;
	try { tree = JSON.parse( i_data);}
	catch( err)
	{
		console.log( err.message+'\n'+i_data);
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

function g_NavPageLoaded( i_data)
{
	//console.log( i_data);
	var div = document.createElement('div');
	div.innerHTML = i_data;
	$('content').appendChild( div);

	if( g_nav_cur_item )
	{
		if( g_nav_old_item )
			$('content').removeChild( g_nav_old_item);

		g_nav_old_item = g_nav_cur_item;
		g_nav_old_item.classList.add('content_old');
	}
	
	g_nav_cur_item = div;
}

function g_SetCurrent()
{
	g_elContent.classList.add('transition');
	g_elContent.style.left = '0';
	g_elContent.style.right = '0';
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
		this.m_args.func( this.responseText, this.m_args);
	}
	xhr.onerror = function() {
		console.log(this);
		console.log('ERROR: ' + this.m_args.path);
	}
}

