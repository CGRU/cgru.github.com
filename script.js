g_site = 'cgru.info';
g_path_prefix = '/content';

g_navs = [];
g_path = null;

g_elContent = null;
g_elTop = null;
g_goCount = -1;
g_get_cache = {};

var $ = function(id) { return document.getElementById(id); };

function g_Init()
{
	if (document.location.host.indexOf(g_site) != -1)
		$('sflogo').innerHTML = '<img src="https://sflogo.sourceforge.net/sflogo.php?group_id=178692&amp;type=12" width="120" height="30" border="0" alt="SourceForge.net"/>';

	document.body.onkeydown = g_OnKeyDown;

	let navs = document.body.getElementsByClassName('navig');
	for (let i = 0; i < navs.length; i++)
	{
		if (navs[i].classList.contains('external')) continue;

		// Replace cgru.info to local site, if needed:
		if (document.location.host.indexOf(g_site) == -1)
		{
			let href = navs[i].getAttribute('href');
			href = href.replace(g_site, document.location.host);
			navs[i].setAttribute('href', href);
		}

		navs[i].onclick = g_NavClicked;
		g_navs.push(navs[i]);
	}

	g_elContent = $('content');
	g_elTop = $('ontop');
	g_elTop.onclick = function(e){ g_DisplayOnTop(false);};

	window.onpopstate = g_Navigate;

	g_Navigate();
}

function g_OnKeyDown(i_evt)
{
	g_DisplayOnTop(false);
	switch (i_evt.keyCode)
	{
	case 27: // ESC
		break;
	}
}

function g_NavClicked(i_evt)
{
	i_evt.preventDefault();
	GO(i_evt.currentTarget.href);
}

function GO(i_path)
{
	window.history.pushState('object','CGRU', i_path);
	g_Navigate();
}

function g_Navigate()
{
	let path = document.location.pathname;
	if (path == '/') path = '/home';
	path = path.split('#')[0];

	if (g_path == path)
	{
		g_GotoHash();
		return;
	}

	g_path = path;

//console.log('g_Navigate:' + path);
	for (let i = 0; i < g_navs.length; i++)
	{
		let href = g_navs[i].href.split('#')[0];

		// Remove protocol and host from href:
		if (href.indexOf('http') == 0)
		{
			href = href.replace(/https?:\/\//,'');
			href = href.replace(document.location.host,'');
		}
//console.log(href);

		if (path == href)
		{
			if (g_goCount == 0)
				g_navs[i].scrollIntoView(false);
			g_navs[i].classList.add('current');
		}
		else
			g_navs[i].classList.remove('current');
	}
//console.log(path);

	g_DisplayLoading();

	if (path.indexOf('.html') == -1)
		path += '.html';
	path = g_path_prefix + path;

	GET({'path':path,'func':g_SetContent});
}

function g_DisplayLoading(i_display)
{
	if (i_display == null) i_display = true;
	document.getElementById('loading').style.display = i_display ? 'block':'none';
}

function g_SetContent(i_data)
{
	g_DisplayLoading(false);
	g_DisplayNotFound(false);
	g_DisplayOnTop(false);
	g_elContent.innerHTML = i_data;

	g_GotoHash();

	g_ProcessContent();
}

function g_GotoHash()
{
	let hash = document.location.hash;
	if (hash && hash.length)
	{
		if (hash.indexOf('#') == 0)
			hash = hash.substr(1);
		let el = document.getElementById(hash);
		if (el)
		{
			el.scrollIntoView(true);
			g_anchor_el = el;
			let imgs = g_elContent.getElementsByTagName('img');
			for (let i = 0; i < imgs.length; i++)
				imgs[i].onload = function(){ g_anchor_el.scrollIntoView(true)};
		}
	}
}

function g_ProcessContent()
{
	let anchors = g_elContent.getElementsByClassName('anchor');
	for (let i = 0; i < anchors.length; i++)
		anchors[i].onclick = function(e){
				document.location.hash = e.currentTarget.getAttribute('id');
			};

	let links = g_elContent.getElementsByClassName('local_link');
	for (let i = 0; i < links.length; i++)
	{
		links[i].onclick = g_NavClicked;
	}

	let forontops = g_elContent.getElementsByClassName('forontop');
	for (let i = 0; i < forontops.length; i++)
		forontops[i].onclick = function(e){ g_ForOnTopClicked(e.currentTarget);};
}

function g_ForOnTopClicked(i_el)
{
	g_DisplayOnTop('<img src="'+i_el.getAttribute('src')+'"/>');
}

function g_DisplayOnTop(i_msg)
{
	let display = false;
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

function g_DisplayNotFound(i_display, i_path)
{
	if (i_display == null)
		i_display = true;

	if (i_display)
		g_SetContent('');

	document.getElementById('notfound').style.display = i_display ? 'block':'none';
	let path = i_path;
	if (null == i_path)
		i_path = document.location.pathname;
	document.getElementById('notfound_file').innerHTML = '<b>'+path+'</b>';
}

function GET(i_args)
{
	let path = i_args.path;

	if (g_get_cache[path])
	{
		i_args.func(g_get_cache[path]);
		return;
	}

	let xhr = new XMLHttpRequest();
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
	if (this.responseText.indexOf('INDEX_MARKER') != -1)
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
	this.m_args.func(this.responseText, this.m_args);
	g_get_cache[this.m_args.path] = this.responseText;
}

