var g_elContent_cur = null;
var g_elContent_new = null;
var g_elContent_old = null;
var g_nav_default_path = 'home/home';
var g_nav_cur_path = null;
var g_nav_items = {};

var g_elShake = [];
var g_shake_cycle = 0;

var g_ElNavigRoot = null;

var $ = function(id) { return document.getElementById(id); };

function g_Init()
{
	g_elShake = document.getElementsByClassName('shake');
	for (let el of g_elShake)
	{
		el.onmouseover = g_ElShake_Over;
		el.onmousemove = g_ElShake_Move;
	}
	g_ElShake();

	window.onhashchange = g_NavHashChanged;

	g_ContentCreateNewDiv();

	g_NavCreateTree();
}

function g_ElShake_Over(i_e){i_e.currentTarget.m_shake = 1;}
function g_ElShake_Move(i_e){i_e.currentTarget.m_shake = 1;}

function g_ElShake()
{
	let amp = 4.0 / (1 + .3*g_shake_cycle);
	let opa = 1.0 - 1.0 / (2 + .3*g_shake_cycle);
	g_shake_cycle++;

	for (let i = 0; i < g_elShake.length; i++)
	{
		let el = g_elShake[i];

		if ((el.m_shake == null) || (el.m_shake == 0))
			continue;

		let amp = 4.0 / (1 + .1 * el.m_shake);
		el.m_shake += 1.0;

		if (isNaN(amp) || (amp < .1))
		{
			el.m_shake = 0;
			continue;
		}

		el.style.top = (Math.floor(amp * Math.random())) + 'px';

		el.style.left = (Math.floor(.5 * amp * Math.random())) + 'px';
	}

//	if (bg_shake_cycle < 100)
		setTimeout(g_ElShake, 50);
}

function g_NavCreateTree()
{
	if (NavTree == null)
	{
		console.log('Navigation tree is null.')
		return;
	}

	const items = NavTree.items;
	if (items == null)
	{
		console.log('Navigation tree contains no items.')
		return;
	}

	g_ElNavigRoot = document.createElement('div');

	g_NavCreateItems(items, g_ElNavigRoot,'/', 0);

	g_NavHashChanged();
}

function g_NavCreateItems(i_items, i_elParent, i_path, i_depth)
{
	for (let item of i_items)
	{
		const elItem = document.createElement('div');
		i_elParent.appendChild(elItem);
		elItem.classList.add('nav_item');

		if (item.folder)
		{
			elItem.classList.add('nav_folder');
			const elName = document.createElement('div');
			elItem.appendChild(elName);
			elName.classList.add('nav_name');
			elName.textContent = item.name;

			if (item.items)
				g_NavCreateItems(item.items, elItem, i_path + item.folder + '/', i_depth+1);
		}
		else
		{
			elItem.classList.add('nav_link');
			const elLink = document.createElement('a');
			elItem.appendChild(elLink);
			elLink.classList.add('nav_name');
			elLink.textContent = item.name;
			elLink.onclick = function(){ this.blur();}

			const href = i_path + item.page;
			elLink.href = '#' + href;
			g_nav_items[href] = elItem;
		}
	}
}

function g_NavHashChanged()
{
	let path = document.location.hash;

	if (path.indexOf('#') == 0)
		path = path.substr(1);

	if ((path == '') || (path == '/'))
		path = g_nav_default_path;

	if (path[0] != '/')
		path = '/' + path;

	if (g_nav_cur_path == path)
		return;

	g_nav_cur_path = path;

	let args = {};
	args.navpath = path;
	args.path = 'content' + path + '.html';
	args.func = g_NavPageLoaded;
	GET(args);
}

function g_ContentCreateNewDiv()
{
	const div = document.createElement('div');
	$('content').appendChild(div);
	div.classList.add('content_new');
	g_elContent_new = div;
}

function g_NavPageLoaded(i_httpRequest)
{
	g_elContent_new.innerHTML = i_httpRequest.responseText;
	g_elContent_new.classList.remove('content_new');
	if (i_httpRequest.status != 200)
		g_elContent_new.classList.add('content_error');

	if (g_elContent_cur)
	{
		if (g_elContent_old)
			$('content').removeChild(g_elContent_old);

		g_elContent_old = g_elContent_cur;
		g_elContent_old.classList.add('content_old');
	}
	
	g_elContent_cur = g_elContent_new;

	for (let p in g_nav_items)
		g_nav_items[p].classList.remove('current');

	let path = i_httpRequest.m_args.navpath;
	if (g_nav_items[path])
		g_nav_items[path].classList.add('current');

	g_ContentProcess();

	g_ContentCreateNewDiv();
}

function g_ContentProcess()
{
	if (g_nav_cur_path.indexOf('home') != -1)
	{
		$("navigation").appendChild(g_ElNavigRoot);
		console.log(g_nav_cur_path);
	}

	for (let sctxt of g_elContent_cur.getElementsByTagName('script'))
	{
		const script = document.createElement('script');
		script.text = sctxt.textContent;
		const docscripts = document.getElementsByTagName('script')[0];
		docscripts.parentNode.insertBefore(script, docscripts);
	}
}

function GET(i_args)
{
	const xhr = new XMLHttpRequest();
	xhr.open('GET', i_args.path, true);
	xhr.send(null);
	xhr.m_args = i_args;

	xhr.onload = g_XHR_OnLoad = function() {
		this.m_args.func(this);
	}
	xhr.onerror = function() {
		console.log(this);
		console.log('ERROR: ' + this.m_args.path);
	}
}

