bg_clr_min = 50;
bg_clr_max = 60;

var $ = function( id ) { return document.getElementById( id ); };

bg_elShake = [];
bg_shake_cycle = 0;

bg_body_w = 0;
bg_body_h = 0;
bg_ctx = null;
bg_units = [];
bg_draw_cycle = 0;

function bg_Init()
{
	var canvas = $('canvas');

	bg_body_w = $('back').clientWidth;
	bg_body_h = $('back').clientHeight;

	console.log('Ininializing background canvas with resolution: ' + bg_body_h + ' x ' + bg_body_w);

	canvas.width = bg_body_w;
	canvas.height = bg_body_h;
	canvas.style.width = bg_body_w + 'px';
	canvas.style.height = bg_body_h + 'px';

	bg_ctx = canvas.getContext('2d');
	bg_ctx.lineWidth = 1.0;
	for( var i = 0; i < bg_body_h; i++)
	{
		var clr = Math.floor( bg_clr_min + .5*(bg_clr_max - bg_clr_min) * Math.random());
		bg_ctx.strokeStyle = 'rgb('+clr+','+clr+','+clr+')';
		bg_ctx.beginPath();
		bg_ctx.moveTo( 0, i+.5);
		bg_ctx.lineTo( bg_body_w, i+.5);
		bg_ctx.stroke();
	}

	bg_elShake = document.getElementsByClassName('shake');
	for( var i = 0; i < bg_elShake.length; i++)
	{
		bg_elShake[i].onmouseover = bg_OnMouseOver;
		bg_elShake[i].onmousemove = bg_OnMouseMove;
		bg_elShake[i].onmouseout = bg_OnMouseOut;
	}

	bg_Shake();
	for( var i = 0; i < 100; i++ ) bg_Draw( true);
	bg_Draw();

	document.body.onclick = bg_BodyOnClick;
	document.body.onmousemove = bg_BodyOnMouseMove;
}

function bg_OnMouseMove(i_e)
{
	i_e.currentTarget.m_shake = 1;

	var x = i_e.clientX;
	var y = i_e.clientY;
	var dx = 8;
	var dy = 4;
	bg_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy,"clr_mult":4,"type":1}));
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function bg_OnMouseOver(i_e)
{
	i_e.currentTarget.m_shake = 1;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}
function bg_OnMouseOut(i_e)
{
//	i_e.currentTarget.m_shake = 0;
//console.log( i_e.currentTarget.textContent + ' ' + i_e.currentTarget.m_shake);
}

function bg_Shake()
{
//console.log('shake ' + g_shake);
	var amp = 4.0 / ( 1 + .3*bg_shake_cycle );
	var opa = 1.0 - 1.0 / ( 2 + .3*bg_shake_cycle );
	bg_shake_cycle++;

	for( var i = 0; i < bg_elShake.length; i++)
	{
//console.log(
		var el = bg_elShake[i];

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

//	if( bg_shake_cycle < 100 )
		setTimeout( bg_Shake, 50);
}

function bg_BodyOnMouseMove( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 4;
	var dy = 4;
	bg_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function bg_BodyOnClick( e )
{
return;
	var x = e.clientX;
	var y = e.clientY;
	var dx = 40;
	var dy = 10;
	for( var i = 0; i < 100; i++)
		bg_units.push( new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function bg_Draw( i_no_timeout )
{
//console.log(bg_units.length);

	bg_draw_cycle++;

	while( bg_units.length < 100 )
	{
		bg_units.push( new Unit({"x_min":0,"x_max":bg_body_w,"y_min":0,"y_max":bg_body_h}));
	}

	if(( bg_draw_cycle % 10 ) == 0 )
		bg_units.shift();

	for( var i = 0; i < bg_units.length; i++)
	{
		bg_units[i].refresh();
		bg_units[i].draw();
	}

	if( i_no_timeout !== true )
		setTimeout( bg_Draw, 100);
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

	this.img = bg_ctx.createImageData(2,2);

	this.setColor( i_args.clr_mult);
}
Unit.prototype.setColor = function( i_mult)
{
	if( i_mult == null ) i_mult = 1;
	var clr = bg_clr_min + i_mult * (bg_clr_max - bg_clr_min) * Math.random();
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

	if( this.x > bg_body_w ) this.x = 0;
	if( this.y > bg_body_h ) this.y = 0;

	if( this.x < 0 ) this.x = bg_body_w;
	if( this.y < 0 ) this.y = bg_body_h;

	this.cycle++;
}
Unit.prototype.draw = function()
{
	bg_ctx.putImageData( this.img, this.x, this.y );
}

