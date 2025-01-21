var $ = function(id) { return document.getElementById(id); };


function g_Init()
{
    let elParent = $('images_history');

    for (let obj of DataImagesHistory)
    {
        console.log(obj)
        let elDiv = document.createElement('div');
        let elImg = document.createElement('img');
        elImg.src = obj.src;
        elDiv.appendChild(elImg);
        elParent.appendChild(elDiv);
    }
}

