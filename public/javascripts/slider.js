var slider = {
    el: undefined,
    path: undefined,
    slideWidth: undefined,
    startX: 0,
    moveX: 0,
    drag: false,
    touching: false,
    callback: undefined,
    start: function start(event) {
        if (this.drag) {
            this.startX = event.clientX;
        }
        else{
            this.startX = event.targetTouches[0].pageX;
        }
        this.el.style.transition = 'none';
    },
    move: function move(event) {
        if ( this.touching || this.drag ) {
            var x = this.drag ? event.clientX : event.targetTouches[0].pageX
            var dist = x - this.startX;
            if (dist < this.slideWidth - this.el.clientWidth && dist > 0) {
                this.moveX = dist;
                this.el.style.transform = 'translate(' + dist.toString() + 'px' + ')';
            }
        }
    },
    end: function end(event) {
        var _this = this;
        _this.el.style.transition = '0.3s transform';

        setTimeout(function () {
            _this.el.style.transition = 'none';
        }, 300);

        if (this.moveX < this.slideWidth / 1.7) {
            _this.el.style.transform = 'translate(0)';
        } else {
            var dist = this.slideWidth - _this.el.clientWidth;
            _this.el.style.transform = 'translate(' + dist.toString() + 'px)';
            _this.callback();
            setTimeout( function() {
                _this.el.style.transform = 'translate(0)';
                _this.startX = 0;
                _this.moveX = 0;
            }, 310);
        }
        _this.drag = false;
        _this.touching = false;
    },
    init: function init(el, callback) {
        var _this = this;
        this.callback = callback;
        this.el = el;
        this.path = this.el.parentElement;
        this.slideWidth = this.el.parentElement.clientWidth;

        this.el.addEventListener("touchstart", function (event) {
            _this.touching = true;
            slider.start(event);
        });

        this.el.addEventListener("touchmove", function (event) {
            slider.move(event);
        });

        this.el.addEventListener("touchend", function (event) {
            slider.end(event);
        });

        this.el.addEventListener("mousedown", function(event) {
            _this.drag = true;
            slider.start(event);
        });

        this.el.addEventListener("mousemove", function(event) {
            slider.move(event);
        });

        this.el.addEventListener("mouseup", function(event) {
            slider.end(event);
        });

        this.el.addEventListener("mouseleave", function(event) {
            if (_this.drag) {
              slider.end(event);
            }
        });
    }
};

export default slider;