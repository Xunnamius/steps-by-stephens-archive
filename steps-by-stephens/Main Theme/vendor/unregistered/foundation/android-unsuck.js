var nua = navigator.userAgent;
var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
if(isAndroid)
{
    window.onload = function()
    {
        if(!document.querySelectorAll || !Array.prototype.forEach)
            return;

        [].slice.call(document.querySelectorAll('select.form-control')).forEach(function(item)
        {
            item.style.width = '100%';
            item.className = item.className.replace('form-control', '');
        });
    };
}
