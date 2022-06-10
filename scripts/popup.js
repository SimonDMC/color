function generatePopup(params) {

    // assign parameters with default values
    let id = params.id || 'popup';
    let title = params.title || 'Popup Title';
    let content = params.content || 'Popup Content';
    let titleColor = params.titleColor || '#000000';
    let backgroundColor = params.backgroundColor || '#ffffff';
    let closeColor = params.closeColor || '#000000';
    let textColor = params.textColor || '#000000';
    let width = params.width || 'min(770px, 80vw)';
    let heightMultiplier = params.heightMultiplier || 0.66;
    let sideMargin = params.sideMargin || '3%';
    let titleMargin = params.titleMargin || '0';
    let showImmediately = params.showImmediately || false;
    let showOnce = params.showOnce || false;

    // pre-processing
    content = content.split('\n');
    for (let i = 0; i < content.length; i++) {
        let line = content[i].trim();
        if (line === '') continue;

        // add <p>
        if (line.includes('§')) {
            let split = line.split('§');
            line = `<p class="${split[0].trim()}">${split[1].trim()}</p>`;
        } else {
            line = `<p>${line}</p>`;
        }

        // replace two spaces with nbsps
        line = line.replace(/  /g, '&nbsp;&nbsp;');

        // style formatting
        line = line.replace(/{/g, '<span class="')
                .replace(/}\[/g, '">')
                .replace(/]/g, '</span>');

        content[i] = line;
    }
    content = content.join('');

    // height calculations
    let height = params.height || 'min(' + (770 * heightMultiplier) + 'px, ' + (80 * heightMultiplier) + 'vw)';

    // create popup
    let popup = document.createElement('div');
    popup.setAttribute('class', 'popup '+id);
    // don't display before CSS loads
    popup.style.display = 'none';
    popup.innerHTML = `
    <div class="popup-content" style="background-color: ${backgroundColor}; width:${width}; height:${height}">
        <div class="popup-header" style="margin-bottom: ${titleMargin}">
            <div class="popup-title" style="color: ${titleColor}">${title}</div>
            <div class="popup-close" style="color: ${closeColor}">&times;</div>
        </div>
        <div class="popup-body" style="color: ${textColor}; margin-left: ${sideMargin}; margin-right: ${sideMargin}"> 
            ${content}
        </div>
    </div>`;
    document.body.appendChild(popup);

    // register event listener for closing
    $('.popup').click(function(e) {
        if (e.target.className == 'popup-close' || e.target.classList.contains('popup')) {
            // close popup
            $('.popup').fadeOut(300);
            // remember for next time
            if (localStorage && showOnce) {
                localStorage.setItem('popup-' + id, true);
            }
        }
    });

    // show popup (with no animation) if enabled
    if (showImmediately) {
        // check for local storage
        if (showOnce && localStorage) {
            if (localStorage.getItem('popup-' + id)) {
                return;
            }
        }
        $('.popup.'+id).fadeIn(0);
    }
}

function showPopup(id) {
    $('.popup.'+id).fadeIn(300);
}