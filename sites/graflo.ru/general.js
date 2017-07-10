g_default_path = 'about';

var $ = function( id ) { return document.getElementById( id ); };

function g_Init()
{
	bg_Init();

	window.onhashchange = g_PathChanged;

	var args = {};
	args.path = "navigation.json";
	args.func = g_NavCreateTree;
	GET( args);

	g_PathChanged();
}

function g_NavCreateTree( i_tree)
{
console.log( JSON.stringify( i_tree));
}

function g_PathChanged()
{
	var path = document.location.hash;

	if( path.indexOf('#') == 0 )
		path = path.substr(1);

	if( path == '' )
		path = g_default_path;

	var navigs = document.getElementsByClassName('navig');
	for( var i = 0; i < navigs.length; i++)
		navigs[i].classList.remove('current');

	var navig = $('n_' + path);
	if( navig )
		navig.classList.add('current');

	var contents = document.getElementsByClassName('content');
	for( var i = 0; i < contents.length; i++)
	{
		if( contents[i].classList.contains('current'))
		{
//			contents[i].style.left = '100%';
			contents[i].classList.remove('current');
		}
		else
		{
//			contents[i].style.left = '-100%';
//			contents[i].style.display = 'none';
		}
		contents[i].style.left = '100%';
		contents[i].style.right = '-100%';
	}

	g_elContent = $('c_' + path);
	if( g_elContent == null )
	{
		console.log('Constent "' + path + '" not founded.');
		return;
	}
	
	g_elContent.classList.add('current');
//	g_elContent.style.display = 'block';
	g_elContent.style.left = '-100%';
	g_elContent.style.right = '100%';

	g_elContent.classList.remove('transition');

//console.log( path);

	setTimeout( g_SetCurrent, 10);
	g_shake_cycle = 0;

}

function g_SetCurrent()
{
	g_elContent.classList.add('transition');
	g_elContent.style.left = '0';
	g_elContent.style.right = '0';
}

function GET( i_args)
{
	var path = i_args.path;
//console.log('Get=' + path);

	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('text/html');
//	xhr.overrideMimeType('application/json');
	xhr.open('GET', path, true);
	xhr.send(null);
	xhr.m_args = i_args;

	xhr.onload = g_XHR_OnLoad;
	xhr.onerror = function() {
		console.log(this);
		console.log('ERROR: ' + this.m_args.path);
		g_DisplayNotFound();
	}
}

function g_XHR_OnLoad()
{
	if( this.responseText.indexOf('INDEX_MARKER') != -1 )
	{
		g_DisplayNotFound();
		return;
	}
	this.m_args.func( this.responseText, this.m_args);
}

