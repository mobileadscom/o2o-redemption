var getPos = function(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    left: xPos,
    top: yPos
  };
}

var transitions = {
    'slideIn': function slideIn(ele) {
        ele.style.transition = 'none';
        var pos = getPos(ele);
        // console.log(pos);
        // ele.style.position = 'absolute';
        // ele.style.left = pos.left + 'px';
        // ele.style.top = pos.top + 'px';
        
        // ele.style.top = '0px';
        // ele.style.left = '-100%';
        ele.style.zIndex = "100";
        ele.style.display = 'block';
        ele.style.transform = 'translate(-100%)';
        setTimeout(function () {
            ele.style.transition = '0.3s all';
            ele.style.transform = 'translate(0)';
            // ele.style.left = '0px';
            ele.style.opacity = '1';
            setTimeout(function () {
                ele.style.position = 'static';
            }, 300);
        }, 100);
    },
    'fadeOut': function fadeOut(ele) {
        var pos = getPos(ele);
        // console.log(pos);
        // ele.style.position = 'absolute';
        // ele.style.left = pos.left + 'px';
        // ele.style.top = pos.top + 'px';
        ele.style.transition = '0.3s all';
        setTimeout(function () {
            ele.style.opacity = '0';
            setTimeout(function () {
                ele.style.display = 'none';
                // ele.style.position = 'static';
            }, 300);
        }, 100);
    }
};

export default transitions;