var $ = function(id) { return document.getElementById(id); };

var show_IntervalSec = 10;
var show_MonitorHeight = 120;

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

	// Show famous project images
	// Calculate show monitors count
	let monitors_count = Math.ceil($('show_right').clientHeight / show_MonitorHeight);
	if (monitors_count >= ShowData.length/2)
		monitors_count = ShowData.length/2 - 1;
	//console.log('Show height:' + $('show_right').clientHeight + ', count:' + monitors_count);
	// Create monitors
	for (let i = 0; i < monitors_count; i++)
	{
		new ShowMonitor($('show_left'));
		new ShowMonitor($('show_right'));
	}

	// Create software icons
	for (let i = 0; i < SoftwareIconsData.length; i++)
	{
		let path = SoftwareIconsData[i].icon;
		let name = path.split('/').pop();
		name = name.split('.')[0];

		let el = document.createElement('div');

		let elImg = document.createElement('img');
		el.appendChild(elImg);
		elImg.src = '/' + path;
		elImg.height = 64;

		let elName = document.createElement('div');
		el.appendChild(elName);
		elName.textContent = name;

		$('software_icons').appendChild(el);
	}

	// Create studios logos
	for (let i = 0; i < StudioLogosData.length; i++)
	{
		let path = StudioLogosData[i].logo;

		let link = path;
		link = link.replace(/\.(png|svg)/,'')
		link = link.replace(/.*___/,'');
		if (path.indexOf('___http___') != -1)
			link = 'http://' + link;
		else
			link = 'https://' + link;

		let el = document.createElement('a');
		el.href = link;
		el.target = '_blank';

		let elImg = document.createElement('img');
		elImg.m_el = el;
		elImg.src = '/' + path;
		elImg.onload = g_StudioLogoOnLoad;

		$('studios').appendChild(el);
	}
}

function g_StudioLogoOnLoad(i_evt)
{
	let img = i_evt.currentTarget;
	let aspect = img.naturalWidth / img.naturalHeight;
	let el = img.m_el;

	let height = 64;
	let width = 256;

	if (aspect > 2.0)
	{
		el.style.width = width + 'px';
	}
	else
	{
		el.style.width = height * aspect + 'px';
	}

	el.style.height = height + 'px';
	el.style.backgroundImage = 'url(' + img.src + ')';

	$('studios').classList.add('loaded');
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

function ShowMonitor(i_elShow)
{
	this.elShow = i_elShow;

	this.elMon = document.createElement('div');
	this.elMon.classList.add('show_monitor');
	this.elShow.appendChild(this.elMon);

	this.elDivs = [];
	for (let i = 0; i < 2; i++)
	{
		let elDiv = document.createElement('div');
		this.elMon.appendChild(elDiv);
		elDiv.classList.add('show_div');
		elDiv.onclick = function(e) {g_ForOnTopClicked(e.currentTarget);};
		this.elDivs.push(elDiv);
	}

	this.index = 0;
	this.imgNum = -1;

	this.update(true);
}

show_ImageNums = [];
ShowMonitor.prototype.update = function(i_first_time) {
	let next = 1 - this.index;
	if (i_first_time)
		next = 0;

	// We should not display the same images in the same time.
	// Find a new image number that is not displayed now.
	let new_img_num = -1;
	do
	{
		new_img_num = Math.floor(Math.random() * ShowData.length);
	}
	while (show_ImageNums.indexOf(new_img_num) != -1);

	// Remove previous image number from an array
	let prev_num_index = show_ImageNums.indexOf(this.imgNum);
	if (prev_num_index != -1)
		show_ImageNums.splice(prev_num_index, 1);

	// Apply a new image number and to store it in array
	this.imgNum = new_img_num;
	show_ImageNums.push(this.imgNum);

	let item = ShowData[this.imgNum];
	let img   = '/' + item.image;
	let thumb = '/' + item.thumbnail;

	this.elDivs[next].style.backgroundImage = 'url(' + thumb + ')';
	this.elDivs[next].setAttribute('img', img);

	// Set a timeout to call this function again
	setTimeout(ShowMonitorUpdate, 1000 * show_IntervalSec * (1+Math.random()), this);

	if (i_first_time)
		return;

	if (this.index)
	{
		this.elMon.classList.remove('shifted');
	}
	else
	{
		this.elMon.classList.add('shifted');
	}

	this.index = 1 - this.index;
};
function ShowMonitorUpdate(i_monitor){i_monitor.update()}
