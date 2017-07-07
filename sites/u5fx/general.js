uf_default_path = 'about';
uf_back_clr_min = 50;
uf_back_clr_max = 60;

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
//	uf_units.push( uf_DrawCreateUnit( x-dx, x+dx, y-dy, y+dy, 4));
	uf_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy,"clr_mult":4,"type":1}));
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
	uf_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function uf_BodyOnClick( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 40;
	var dy = 10;
	for( var i = 0; i < 100; i++)
		uf_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function uf_Draw( i_no_timeout )
{
//console.log(uf_units.length);

	uf_draw_cycle++;

	while( uf_units.length < 100 )
	{
		uf_units.push( new Unit({"x_min":0,"x_max":uf_body_w,"y_min":0,"y_max":uf_body_h}));
	}

	if(( uf_draw_cycle % 10 ) == 0 )
		uf_units.shift();

	for( var i = 0; i < uf_units.length; i++)
	{
		uf_units[i].refresh();
		uf_units[i].draw();
	}

	if( i_no_timeout !== true )
		setTimeout( uf_Draw, 100);
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

	this.img = uf_ctx.createImageData(2,2);

	this.setColor( i_args.clr_mult);
}
Unit.prototype.setColor = function( i_mult)
{
	if( i_mult == null ) i_mult = 1;
	var clr = uf_back_clr_min + i_mult * (uf_back_clr_max - uf_back_clr_min) * Math.random();
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

	if( this.x > uf_body_w ) this.x = 0;
	if( this.y > uf_body_h ) this.y = 0;

	if( this.x < 0 ) this.x = uf_body_w;
	if( this.y < 0 ) this.y = uf_body_h;

	this.cycle++;
}
Unit.prototype.draw = function()
{
	uf_ctx.putImageData( this.img, this.x, this.y );
}

