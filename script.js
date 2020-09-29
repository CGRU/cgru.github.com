var $ = function(id) { return document.getElementById(id); };

function g_Init()
{
	if (document.location.host.indexOf('cgru.info') != -1)
		$('sflogo').innerHTML = '<img src="https://sflogo.sourceforge.net/sflogo.php?group_id=178692&amp;type=12" width="120" height="30" border="0" alt="SourceForge.net"/>';

	document.body.onkeydown = g_OnKeyDown;

	$('ontop').onclick = function(e){
		g_DisplayOnTop(false);
	};

	let forontops = $('content').getElementsByClassName('forontop');
	for (let i = 0; i < forontops.length; i++)
		forontops[i].onclick = function(e){ g_ForOnTopClicked(e.currentTarget);};
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

function g_ForOnTopClicked(i_el)
{
	g_DisplayOnTop('<img src="'+i_el.getAttribute('img')+'"/>');
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
		$('ontop').innerHTML = i_msg;
		display = true;
	}
	else
	{
		display = false;
	}
	
	$('ontop').style.display = display ? 'block':'none';
}

