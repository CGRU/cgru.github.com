g_default_path = 'about';
g_back_clr_min = 50;
g_back_clr_max = 60;

var $ = function( id ) { return document.getElementById( id ); };

g_elContent = null;
g_elShake = [];
g_shake_cycle = 0;

g_body_w = 0;
g_body_h = 0;
g_ctx = null;
g_units = [];
g_draw_cycle = 0;

function g_Init()
{
	var canvas = $('canvas');

	g_body_w = $('back').clientWidth;
	g_body_h = $('back').clientHeight;

	console.log( 'Resolution: ' + g_body_h + ' x ' + g_body_w);

	canvas.width = g_body_w;
	canvas.height = g_body_h;
	canvas.style.width = g_body_w + 'px';
	canvas.style.height = g_body_h + 'px';

	g_ctx = canvas.getContext('2d');
	g_ctx.lineWidth = 1.0;
	for( var i = 0; i < g_body_h; i++)
	{
		var clr = Math.floor( g_back_clr_min + .5*(g_back_clr_max - g_back_clr_min) * Math.random());
		g_ctx.strokeStyle = 'rgb('+clr+','+clr+','+clr+')';
//continue;
		g_ctx.beginPath();
		g_ctx.moveTo( 0, i+.5);
		g_ctx.lineTo( g_body_w, i+.5);
		g_ctx.stroke();
	}

	g_elShake = document.getElementsByClassName('shake');
	for( var i = 0; i < g_elShake.length; i++)
	{
		g_elShake[i].onmouseover = g_OnMouseOver;
		g_elShake[i].onmousemove = g_OnMouseMove;
		g_elShake[i].onmouseout = g_OnMouseOut;
	}

	g_Shake();
	for( var i = 0; i < 100; i++ ) g_Draw( true);
	g_Draw();

	document.body.onclick = g_BodyOnClick;
	document.body.onmousemove = g_BodyOnMouseMove;

	window.onhashchange = g_PathChanged;
	g_PathChanged();
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
	g_Shake();

}

function g_SetCurrent()
{
	g_elContent.classList.add('transition');
	g_elContent.style.left = '0';
	g_elContent.style.right = '0';
}

function g_OnMouseMove(i_e)
{
	i_e.currentTarget.m_shake = 1;

	var x = i_e.clientX;
	var y = i_e.clientY;
	var dx = 8;
	var dy = 4;
//	for( var i = 0; i < 4; i++)
//	g_units.push( g_DrawCreateUnit( x-dx, x+dx, y-dy, y+dy, 4));
	g_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy,"clr_mult":4,"type":1}));
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function g_OnMouseOver(i_e)
{
	i_e.currentTarget.m_shake = 1;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function g_OnMouseOut(i_e)
{
//	i_e.currentTarget.m_shake = 0;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}

function g_Shake()
{
//console.log('shake ' + g_shake);
	var amp = 4.0 / ( 1 + .3*g_shake_cycle );
	var opa = 1.0 - 1.0 / ( 2 + .3*g_shake_cycle );
	g_shake_cycle++;

	for( var i = 0; i < g_elShake.length; i++)
	{
//console.log(
		var el = g_elShake[i];

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

//	if( g_shake_cycle < 100 )
		setTimeout( g_Shake, 50);
}

function g_BodyOnMouseMove( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 4;
	var dy = 4;
	g_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function g_BodyOnClick( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 40;
	var dy = 10;
	for( var i = 0; i < 100; i++)
		g_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function g_Draw( i_no_timeout )
{
//console.log(g_units.length);

	g_draw_cycle++;

	while( g_units.length < 100 )
	{
		g_units.push( new Unit({"x_min":0,"x_max":g_body_w,"y_min":0,"y_max":g_body_h}));
	}

	if(( g_draw_cycle % 10 ) == 0 )
		g_units.shift();

	for( var i = 0; i < g_units.length; i++)
	{
		g_units[i].refresh();
		g_units[i].draw();
	}

	if( i_no_timeout !== true )
		setTimeout( g_Draw, 100);
}

function Unit( i_args)
{
	if( i_args.clr_mult == null )
		i_args.clr_mult = 1;

	this.type = i_args.type;
	this.cycle = 0;

	this.x = i_args.x_min + ( i_args.x_max - i_args.x_min ) * Math.random();
	this.y = i_args.y_min + ( i_args.y_max - i_args.y_min ) * Math.random();

	if( Math.random() > .5 )
	{
		this.vx = ( Math.random() > .5 ) ? 1 : -1;;
		this.vy = 0;
	}
	else
	{
		this.vx = 0;
		this.vy = ( Math.random() > .1 ) ? 1 : -1;;
	}

	this.img = g_ctx.createImageData(2,2);

	this.setColor( i_args.clr_mult);
}
Unit.prototype.setColor = function( i_mult)
{
	if( i_mult == null ) i_mult = 1;
	var clr = g_back_clr_min + i_mult * (g_back_clr_max - g_back_clr_min) * Math.random();
	for( var i = 0; i < 4; i++)
	{
		this.img.data[i*4+0] = clr;
		this.img.data[i*4+1] = clr;
		this.img.data[i*4+2] = clr;
		this.img.data[i*4+3] = 255;
	}
}
Unit.prototype.refresh = function()
{
	var to_y = .01;
	var to_x = .1;
	var clr = .5;

	if( this.type )
	{
		to_x = .001 * this.cycle;
		if( to_x > .1 ) to_x = .1;
		clr = 1;
	}

	if(( Math.random() < to_y ) && ( this.vy == 0 ))
	{
		this.vx = 0;
		this.vy = ( Math.random() > .1 ) ? 1 : -1;

		if( Math.random() < clr )
			this.setColor();
	}
	else if(( Math.random() < to_x ) && ( this.vx == 0 ))
	{
		this.vx = ( Math.random() > .5 ) ? 1 : -1;
		this.vy = 0;
	}

	this.x += this.vx;
	this.y += this.vy;

	if( this.x > g_body_w ) this.x = 0;
	if( this.y > g_body_h ) this.y = 0;

	if( this.x < 0 ) this.x = g_body_w;
	if( this.y < 0 ) this.y = g_body_h;

	this.cycle++;
}
Unit.prototype.draw = function()
{
	g_ctx.putImageData( this.img, this.x, this.y );
}

