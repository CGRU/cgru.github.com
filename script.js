function g_Init()
{
	document.getElementById('content').innerHTML = 'init';

	var nav = document.getElementById('navig').getElementsByTagName('div');
	for( var i = 0; i < nav.length; i++ )
	{
		nav[i].onclick = g_NavClick;
	}
}

function g_NavClick( i_evt)
{
	var nav = i_evt.currentTarget;
	GO( nav.getAttribute('file'));
}

function GO( i_path)
{
	document.getElementById('content').innerHTML = i_path;
	GET(i_path);
}

function GET( i_path)
{
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('application/json');
//	xhr.setRequestHeader('AFANASY', '1 0 '+obj_str.length);
	xhr.onerror = function() { document.getElementById('content').innerHTML = xhr.status + ':' + xhr.statusText; }
	xhr.open('GET', i_path, true);
	xhr.send(null);

	xhr.onreadystatechange = function()
	{
		if( xhr.readyState == 4 )
		{
document.getElementById('content').innerHTML = xhr.status + ':' + xhr.statusText;
			if( xhr.responseText.length )
				document.getElementById('content').innerHTML = xhr.responseText;
			else
				document.getElementById('content').innerHTML = 'Error getting file';
/*
			if(( xhr.status == 200 ) && xhr.responseText.length )
			{
				log += '<br/><b><i>recv:</i></b> '+ xhr.responseText;

				nw_error_count = 0;
				nw_connected = true;
//				g_ProcessMsg( eval('('+xhr.responseText+')'));
//				g_ProcessMsg( JSON.parse( xhr.responseText));

				var newobj = null;
				try { newobj = JSON.parse( xhr.responseText);}
				catch( err)
				{
					g_Log(err.message+'\n\n'+xhr.responseText);
					newobj = null;
				}

				if( newobj )
					g_ProcessMsg( JSON.parse( xhr.responseText));
			}
			else
			{
				nw_error_count++;
				nw_error_total++;
//document.getElementById("status").textContent=nw_error_count+': Status number = ' + xhr.status;
//document.getElementById("statustext").textContent='Status text: ' + xhr.statusText;
				if(( nw_error_count > nw_error_count_max ) && nw_connected )
				{
					nw_connected = false;
					g_Error('Connection lost.');
					g_ConnectionLost();
				}
			}
			g_Log( log, 'netlog');
*/
		}
		else
				document.getElementById('content').innerHTML = 'Error getting file';
	}
}
