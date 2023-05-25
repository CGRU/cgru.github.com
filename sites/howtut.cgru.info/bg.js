var bg_clr_min = 50;
var bg_clr_max = 60;

var $ = function(id) { return document.getElementById(id); };

var bg_elShake = [];
var bg_shake_cycle = 0;

var bg_body_w = 0;
var bg_body_h = 0;
var bg_ctx = null;
var bg_units = [];
var bg_draw_cycle = 0;
var bg_canvas = null;

function bg_Init()
{
	bg_canvas = $('canvas');

	bg_body_w = $('back').clientWidth;
	bg_body_h = $('back').clientHeight;

	console.log('Ininializing background canvas with resolution: ' + bg_body_h + ' x ' + bg_body_w);

	bg_canvas.width = bg_body_w;
	bg_canvas.height = bg_body_h;
	bg_canvas.style.width = bg_body_w + 'px';
	bg_canvas.style.height = bg_body_h + 'px';

	bg_ctx = bg_canvas.getContext('2d');
	bg_ctx.lineWidth = 1.0;
	for (let i = 0; i < bg_body_h; i++)
	{
		let clr = Math.floor(bg_clr_min + .5*(bg_clr_max - bg_clr_min) * Math.random());
		bg_ctx.strokeStyle = 'rgb('+clr+','+clr+','+clr+')';
		bg_ctx.beginPath();
		bg_ctx.moveTo(0, i+.5);
		bg_ctx.lineTo(bg_body_w, i+.5);
		bg_ctx.stroke();
	}

	bg_elShake = document.getElementsByClassName('shake');
	for (let i = 0; i < bg_elShake.length; i++)
	{
		bg_elShake[i].onmouseover = bg_OnMouseOver;
		bg_elShake[i].onmousemove = bg_OnMouseMove;
		bg_elShake[i].onmouseout = bg_OnMouseOut;
	}
	bg_Shake();

	document.body.onclick = bg_BodyOnClick;
	document.body.onmousemove = bg_BodyOnMouseMove;

	for (let i = 0; i < 100; i++)
		bg_Draw(true);

	bg_Draw();
}

function bg_OnMouseMove(i_e)
{
	i_e.currentTarget.m_shake = 1;

	let x = i_e.clientX;
	let y = i_e.clientY;
	let dx = 8;
	let dy = 4;
	bg_units.push(new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy,"clr_mult":4,"type":1}));
}
function bg_OnMouseOver(i_e)
{
	i_e.currentTarget.m_shake = 1;
}
function bg_OnMouseOut(i_e)
{
//	i_e.currentTarget.m_shake = 0;
}

function bg_Shake()
{
	let amp = 4.0 / (1 + .3*bg_shake_cycle);
	let opa = 1.0 - 1.0 / (2 + .3*bg_shake_cycle);
	bg_shake_cycle++;

	for (let i = 0; i < bg_elShake.length; i++)
	{
		let el = bg_elShake[i];

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
		setTimeout(bg_Shake, 50);
}

function bg_BodyOnMouseMove(e)
{
	let x = e.clientX;
	let y = e.clientY;
	let dx = 4;
	let dy = 4;
	bg_units.push(new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy}));
}

function bg_BodyOnClick(e)
{
	let x = e.clientX;
	let y = e.clientY;
	let dx = 4;
	let dy = 4;
	for (let i = 0; i < 4; i++)
		bg_units.push(new Unit({"x_min":x-dx,"x_max":x+dx,"y_min":y-dy,"y_max":y+dy,"clr_mult":4,"type":1}));
}

function bg_Draw(i_no_timeout)
{
	let time_start = new Date();

	bg_draw_cycle++;

	while(bg_units.length < 100)
	{
		bg_units.push(new Unit({"x_min":0,"x_max":bg_body_w,"y_min":0,"y_max":bg_body_h}));
	}

	if ((bg_draw_cycle % 10) == 0)
		bg_units.shift();

	//let context = bg_canvas.getContext('2d');
	//let image = context.createImageData(bg_body_w, bg_body_h);
	//let image = context.getImageData(0, 0, bg_body_w, bg_body_h);
	let image = bg_ctx.getImageData(0, 0, bg_body_w, bg_body_h);

	for (let i = 0; i < bg_units.length; i++)
	{
		bg_units[i].refresh(i==0);
		bg_units[i].draw(image.data, i==0);
	}

//	for (let i = 0; i < 40; i++) image.data[1000*bg_draw_cycle + i] = 255;


	//context.putImageData(image, 0, 0);
	bg_ctx.putImageData(image, 0, 0);

	if (i_no_timeout !== true)
		setTimeout(bg_Draw, 100);

//console.log(bg_draw_cycle + '[' + bg_units.length + ']: ' + ((new Date()) - time_start) + 'ms');
}

function Unit(i_args)
{
	if (i_args.clr_mult == null)
		i_args.clr_mult = 1;

	this.type = i_args.type;
	this.cycle = 0;

	this.x = i_args.x_min + (i_args.x_max - i_args.x_min) * Math.random();
	this.y = i_args.y_min + (i_args.y_max - i_args.y_min) * Math.random();

	if (Math.random() > .5)
	{
		this.vx = (Math.random() > .5) ? 1 : -1;;
		this.vy = 0;
	}
	else
	{
		this.vx = 0;
		this.vy = (Math.random() > .1) ? 1 : -1;;
	}

	this.img = bg_ctx.createImageData(2,2);

	this.setColor(i_args.clr_mult);
}
Unit.prototype.setColor = function(i_mult)
{
	if (i_mult == null) i_mult = 1;
	let clr = bg_clr_min + i_mult * (bg_clr_max - bg_clr_min) * Math.random();
	for (let i = 0; i < 4; i++)
	{
		this.img.data[i*4+0] = clr;
		this.img.data[i*4+1] = clr;
		this.img.data[i*4+2] = clr;
		this.img.data[i*4+3] = 255;
	}
}
Unit.prototype.refresh = function()
{
	let to_y = .01;
	let to_x = .1;
	let clr = .5;

	if (this.type)
	{
		to_x = .001 * this.cycle;
		if (to_x > .1) to_x = .1;
		clr = 1;
	}

	if ((Math.random() < to_y) && (this.vy == 0))
	{
		this.vx = 0;
		this.vy = (Math.random() > .1) ? 1 : -1;

		if (Math.random() < clr)
			this.setColor();
	}
	else if ((Math.random() < to_x) && (this.vx == 0))
	{
		this.vx = (Math.random() > .5) ? 1 : -1;
		this.vy = 0;
	}

	this.x += this.vx;
	this.y += this.vy;

	if (this.x > bg_body_w) this.x = 0;
	if (this.y > bg_body_h) this.y = 0;

	if (this.x < 0) this.x = bg_body_w;
	if (this.y < 0) this.y = bg_body_h;

	this.cycle++;
}
Unit.prototype.draw = function(i_data, iv)
{
//	bg_ctx.putImageData(this.img, this.x, this.y);
return;
if (iv)
	console.log(this.x + ',' + this.y);

	let index = 4 * (bg_body_w * this.y + this.x);
	for (let i = 0; i < 4; i++)
		i_data[index + i] = 255;

	index = 4 * (bg_body_w * this.y + this.x+1);
	for (let i = 0; i < 4; i++)
		i_data[index + i] = 255;

	index = 4 * (bg_body_w * (this.y+1) + this.x+1);
	for (let i = 0; i < 4; i++)
		i_data[index + i] = 255;

	index = 4 * (bg_body_w * (this.y+1) + this.x);
	for (let i = 0; i < 4; i++)
		i_data[index + i] = 255;
}

