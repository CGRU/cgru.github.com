uf_default_path = 'about';
uf_back_clr_min = 60;
uf_back_clr_max = 70;

var $ = function( id ) { return document.getElementById( id ); };

uf_elContent = null;
uf_elShake = [];
uf_shake_cycle = 0;

uf_body_w = 0;
uf_body_h = 0;
uf_ctx = null;
uf_units = [];
uf_draw_cycle = 0;

function uf_Init()
{
	var canvas = $('canvas');

	uf_body_w = $('back').clientWidth;
	uf_body_h = $('back').clientHeight;

	console.log( 'Resolution: ' + uf_body_h + ' x ' + uf_body_w);

	canvas.width = uf_body_w;
	canvas.height = uf_body_h;
	canvas.style.width = uf_body_w + 'px';
	canvas.style.height = uf_body_h + 'px';

	uf_ctx = canvas.getContext('2d');
	uf_ctx.lineWidth = 1.0;
	for( var i = 0; i < uf_body_h; i++)
	{
		var clr = Math.floor( uf_back_clr_min + .5*(uf_back_clr_max - uf_back_clr_min) * Math.random());
		uf_ctx.strokeStyle = 'rgb('+clr+','+clr+','+clr+')';
//continue;
		uf_ctx.beginPath();
		uf_ctx.moveTo( 0, i+.5);
		uf_ctx.lineTo( uf_body_w, i+.5);
		uf_ctx.stroke();
	}

	uf_elShake = document.getElementsByClassName('shake');
	for( var i = 0; i < uf_elShake.length; i++)
	{
		uf_elShake[i].onmouseover = uf_OnMouseOver;
		uf_elShake[i].onmousemove = uf_OnMouseMove;
		uf_elShake[i].onmouseout = uf_OnMouseOut;
	}

	uf_Shake();
	for( var i = 0; i < 100; i++ ) uf_Draw( true);
	uf_Draw();

	document.body.onclick = uf_BodyOnClick;
	document.body.onmousemove = uf_BodyOnMouseMove;

	window.onhashchange = uf_PathChanged;
	uf_PathChanged();
}

function uf_PathChanged()
{
	var path = document.location.hash;

	if( path.indexOf('#') == 0 )
		path = path.substr(1);

	if( path == '' )
		path = uf_default_path;

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

	uf_elContent = $('c_' + path);
	if( uf_elContent == null )
	{
		console.log('Constent "' + path + '" not founded.');
		return;
	}
	
	uf_elContent.classList.add('current');
//	uf_elContent.style.display = 'block';
	uf_elContent.style.left = '-100%';
	uf_elContent.style.right = '100%';

	uf_elContent.classList.remove('transition');

//console.log( path);

	setTimeout( uf_SetCurrent, 10);
	uf_shake_cycle = 0;
	uf_Shake();

}

function uf_SetCurrent()
{
	uf_elContent.classList.add('transition');
	uf_elContent.style.left = '0';
	uf_elContent.style.right = '0';
}

function uf_OnMouseMove(i_e)
{
	i_e.currentTarget.m_shake = 1;

	var x = i_e.clientX;
	var y = i_e.clientY;
	var dx = 8;
	var dy = 4;
//	for( var i = 0; i < 4; i++)
	uf_units.push( uf_DrawCreateUnit( x-dx, x+dx, y-dy, y+dy, 4));
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function uf_OnMouseOver(i_e)
{
	i_e.currentTarget.m_shake = 1;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function uf_OnMouseOut(i_e)
{
//	i_e.currentTarget.m_shake = 0;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}

function uf_Shake()
{
//console.log('shake ' + uf_shake);
	var amp = 4.0 / ( 1 + .3*uf_shake_cycle );
	var opa = 1.0 - 1.0 / ( 2 + .3*uf_shake_cycle );
	uf_shake_cycle++;

	for( var i = 0; i < uf_elShake.length; i++)
	{
//console.log(
		var el = uf_elShake[i];

		if(( el.m_shake == null ) || ( el.m_shake == 0 ))
			continue;

		var amp = 4.0 / ( 1 + .1 * el.m_shake );
		el.m_shake += 1.0;

		if( isNaN( amp ) || ( amp < .1 ))
		{
			el.m_shake = 0;
			continue;
		}

		var value = (Math.floor( amp * Math.random())) + 'px';
//console.log( value);
		el.style.top = value;

		var value = (Math.floor( .5 * amp * Math.random())) + 'px';
		el.style.left = value;
	}

//	if( uf_shake_cycle < 100 )
		setTimeout( uf_Shake, 50);
}

function uf_BodyOnMouseMove( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 4;
	var dy = 4;
	uf_units.push( uf_DrawCreateUnit( x-dx, x+dx, y-dy, y+dy));
}

function uf_BodyOnClick( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 40;
	var dy = 10;
	for( var i = 0; i < 100; i++)
		uf_units.push( uf_DrawCreateUnit( x-dx, x+dx, y-dy, y+dy));
}

function uf_DrawCreateUnit( i_x_min, i_x_max, i_y_min, i_y_max, i_clr_mult)
{
	if( i_clr_mult == null )
		i_clr_mult = 1;

	var unit = {};
	unit.x = i_x_min + ( i_x_max - i_x_min ) * Math.random();
	unit.y = i_y_min + ( i_y_max - i_y_min ) * Math.random();

	if( Math.random() > .5 )
	{
		unit.vx = ( Math.random() > .5 ) ? 1 : -1;;
		unit.vy = 0;
	}
	else
	{
		unit.vx = 0;
		unit.vy = ( Math.random() > .1 ) ? 1 : -1;;
	}

	unit.id = uf_ctx.createImageData(2,2);
	var clr = uf_back_clr_min + i_clr_mult * (uf_back_clr_max - uf_back_clr_min) * Math.random();
	for( var i = 0; i < 4; i++)
	{
		unit.id.data[i*4+0] = clr;
		unit.id.data[i*4+1] = clr;
		unit.id.data[i*4+2] = clr;
		unit.id.data[i*4+3] = 255;
	}

	return unit;
}
function uf_Draw( i_no_timeout )
{
//console.log(uf_units.length);

	uf_draw_cycle++;

	while( uf_units.length < 100 )
	{
		uf_units.push( uf_DrawCreateUnit( 0, uf_body_w, 0, uf_body_h));
	}

	if(( uf_draw_cycle % 10 ) == 0 )
		uf_units.shift();

	for( var i = 0; i < uf_units.length; i++)
	{
		uf_ctx.putImageData( uf_units[i].id, uf_units[i].x, uf_units[i].y );

		if(( Math.random() > .99 ) && ( uf_units[i].vy == 0 ))
		{
			uf_units[i].vx = 0;
			uf_units[i].vy = ( Math.random() > .1 ) ? 1 : -1;

//			if( Math.random() > .9 )
			{
				var clr = uf_back_clr_min + (uf_back_clr_max - uf_back_clr_min) * Math.random();
				for( var c = 0; c < 4; c++)
				{
					uf_units[i].id.data[c*4+0] = clr;
					uf_units[i].id.data[c*4+1] = clr;
					uf_units[i].id.data[c*4+2] = clr;
					uf_units[i].id.data[c*4+3] = 255;
				}
			}
		}
		else if(( Math.random() > .9 ) && ( uf_units[i].vx == 0 ))
		{
			uf_units[i].vx = ( Math.random() > .5 ) ? 1 : -1;
			uf_units[i].vy = 0;
		}

		uf_units[i].x += uf_units[i].vx;
		uf_units[i].y += uf_units[i].vy;

		if( uf_units[i].x > uf_body_w ) uf_units[i].x = 0;
		if( uf_units[i].y > uf_body_h ) uf_units[i].y = 0;

		if( uf_units[i].x < 0 ) uf_units[i].x = uf_body_w;
		if( uf_units[i].y < 0 ) uf_units[i].y = uf_body_h;
	}

	if( i_no_timeout !== true )
		setTimeout( uf_Draw, 150);
}

