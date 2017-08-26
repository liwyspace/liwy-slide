/*! liwy-slide - v1.0.0 - 2017-08-26
* https://github.com/liwyspace/liwy-slide#readme
* Copyright (c) 2017 liwy; Licensed MIT */
/**
 * liwy-slide
 * @version 1.0.0
 * @author liwy
 * @license THe MIT License (MIT)
 * 
 *
 * @todo 单项水平显示
 * @todo next/prev按钮
 * @todo dots按钮
 * @todo caption标题
 * @todo 自动转换
 */
;(function($, window, document, undefined) {

    /**
     * 定义插件对象
     * @public
     * @param {HTMLElement|jQuery} element
     * @param (Object) options
     */
    var LiwySlide = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({},LiwySlide.defaults,options);
        // this.viewport = null; //存储.liwy-viewport 视窗dom元素
        // this.loader = null; //存储.liwy-loading 加载中dom元素
        // this.children = null; //存储slide的子元素的dom元素集合
        // this.controls = {}; //存储控制按钮容器对象
        // this.pagerEl = null; //存储pager的dom元素
        // this.active = {}; //存储当前活动对象
        // this.working = false; //存储transition是否进行中
        // this.animProp = null; //存储transition的属性
        // this.interval = null;//存储自动播放周期函数

        this.init();
    };

    /**
     * 默认参数对象
     * 静态属性
     * @public
     */
    LiwySlide.defaults = {
        //基本参数
        wrapperClass: 'liwy-wrapper',//默认：liwy-wrapper;定义我们liwyslide插件对外层div的样式class
        mode: 'horizontal',//三种transition模式：'horizontal'水平,'vertical'垂直,'fade'褪色
        slideSelector: '', //用于过滤我们liwyslide的子元素,默认为liwyslide的所有的直接子元素; jQuery sellector
        startSlide: 0, //开始slide的位置,int
        randomStart: false, //是否随机幻灯片位置开始,boolean
        captions: true, //显示image的title属性
        infiniteLoop: true, //是否无限循环，boolean
        speed: 500, //transition时间
        //next/prev控制按钮
        controls: true,  //是否使用next/prev按钮
        nextText: 'Next', //next按钮显示文本
        prevText: 'Prev', //prev按钮显示文本
        nextSelector: null, //next按钮被append的位置，用于自定义,jQuery selector
        prevSelector: null, //prev按钮被append的位置，用于自定义,jQuery selector
        //start/stop按钮
        autoControls: true, //是否使用start/stop按钮
        startText: 'Start', //start按钮显示文本
        stopText: 'Stop', //stop按钮显示文本
        autoControlsCombine: true, //start/stop设置为开关按钮
        autoControlsSelector: null, //start/stop按钮被append的位置,jQuery selector
        //pager按钮
        pager: true,  //是否使用分页图标
        pagerSelector: null, //pager按钮被append位置, jQuery selector
        buildPager: null, //重写pager上的文本内容的回调函数。function(pagerIndex)
        pagerCustom: null, //自定义page图标，必须包含和slide个数一样的<a data-slide-index="x">元素。不适用于dynamic carousels。,jQuery selector
        // AUTO
        auto: true, //是否开启自动转换功能
        pause: 2000, //自动转换的间隔
        autoDirection: 'next',//next,prev; 自动显示幻灯片切换的方向
        autoStart: true, //自动开始播放。如果false，当单击“开始”控件时，将开始自动播放
        autoDelay: 5000, //自动显示应在启动前等待时间
        // stopAutoOnClick: false,//与控件交互将停止自动播放
        // autoHover: false, //当鼠标悬停在滑块上时，自动显示将暂停
        
    };

    /**
     * 初始化方法
     * 实例方法
     * @public
     */
    LiwySlide.prototype.init = function() {
        

        //liwyslide的子元素集合
        this.children = this.$element.children(this.options.slideSelector);
        //如果设置随机起始位置，重置起始位置为一个随机数
        if (this.options.randomStart) { 
            this.options.startSlide = Math.floor(Math.random() * this.children.length); 
        }
        //设置活动对象的位置信息
        this.active = { index: this.options.startSlide };
        if (this.active.index === this.getPagerNumber() - 1) { this.active.last = true; }
        // 确定哪些属性用于转换
        this.animProp = this.options.mode === 'vertical' ? 'top' : 'left';

        this.working = false; // 存储slide的活动状态
        this.controls = {}; // 存储控制按钮容器对象
        this.interval = null; // 存储自动播放周期函数

        this.setup();
    };

    /**
     * 执行dom与css的修改
     */
    LiwySlide.prototype.setup = function() {

        // 创建liwyslide的包装类,用来修改时我们的liwyslide; 使用者可以通过wrapperClass参数自定义包装器的样式
        this.$element.wrap('<div class="' + this.options.wrapperClass + '"><div class="liwy-viewport"></div></div>');
        this.viewport = this.$element.parent(); // 将.liwy_viewport元素保存到对象上

        // 添加“加载中”提示div
        this.loader = $('<div class="liwy-loading" />');
        this.viewport.prepend(this.loader); //将loader元素添加到viewport中去


        // 设置wrapper的最大宽度
        var wrapper_width = '100%';
        this.viewport.parent().css({
            maxWidth: wrapper_width
        });

        // 设置viewport的样式
        this.viewport.css({
            width: '100%',
            overflow: 'hidden',
            position: 'relative'
        });
        
        // 设置liwyslide的样式
        this.$element.css({
            // 如果为水平transition模式,定义足够大的宽度，以能够应对各种width、margin、padding需求
            // 宽度为viewport的宽度的N十倍，N为liwyslide子元素的个数
            width: this.options.mode === 'horizontal' ? (this.children.length * 1000) + '%' : 'auto',
            position: 'relative'
        });

        // 设置liwyslide子元素slide的样式
        this.children.css({
            //如果水平transition模式，所有slide左浮动
            'float': this.options.mode === 'horizontal' ? 'left' : 'none',
            listStyle: 'none',
            position: 'relative'
        });
        
        // 设置slide的宽度
        var slideWidth = this.viewport.width();
        this.children.css('width', slideWidth);
        
        // 添加图片标题
        if (this.options.captions) {
            this.children.each(function(index) {
                var title = $(this).find('img:first').attr('title');
                if (title !== undefined && ('' + title).length) {
                  $(this).append('<div class="liwy-caption"><span>' + title + '</span></div>');
                }
             });
        }
        
        // 创建控制按钮的容器元素
        this.controls.element = $('<div class="liwy-controls" />');
        // 创建next/prev按钮
        if (this.options.controls) {
            this.controls.next = $('<a class="liwy-next" href="">' + this.options.nextText + '</a>');
            this.controls.prev = $('<a class="liwy-prev" href="">' + this.options.prevText + '</a>');
            //绑定事件
            this.controls.next.bind('click touchend', $.proxy(function(e) {
                e.preventDefault();
                if (this.controls.element.hasClass('disabled')) { return; }
                // if (this.options.auto && this.options.stopAutoOnClick) { this.stopAuto(); }
                this.goToNextSlide();
            },this));
            this.controls.prev.bind('click touchend', $.proxy(function(e) {
                e.preventDefault();
                if (this.controls.element.hasClass('disabled')) { return; }
                // if (this.options.auto && this.options.stopAutoOnClick) { this.stopAuto(); }
                this.goToPrevSlide();
            },this));

            //定义controls元素位置
            if (this.options.nextSelector) {
                $(this.options.nextSelector).append(this.controls.next);
            }
            if (this.options.prevSelector) {
                $(this.options.prevSelector).append(this.controls.prev);
            }
            if (!this.options.nextSelector && !this.options.prevSelector) {
                this.controls.directionEl = $('<div class="liwy-controls-direction" />');
                this.controls.directionEl.append(this.controls.prev).append(this.controls.next);
                this.controls.element.addClass('liwy-has-controls-direction').append(this.controls.directionEl);
            }

        }
        
        //创建stop/play按钮
        if (this.options.auto && this.options.autoControls) {
            this.controls.start = $('<div class="liwy-controls-auto-item"><a class="liwy-start" href="">' + this.options.startText + '</a></div>');
            this.controls.stop = $('<div class="liwy-controls-auto-item"><a class="liwy-stop" href="">' + this.options.stopText + '</a></div>');
            
            this.controls.autoEl = $('<div class="liwy-controls-auto" />');
            //绑定事件
            this.controls.autoEl.on('click', '.liwy-start', $.proxy(function(e) {
                this.startAuto();
                e.preventDefault();
            },this));
            this.controls.autoEl.on('click', '.liwy-stop', $.proxy(function(e) {
                this.stopAuto();
                e.preventDefault();
            },this));

            //只显示start按钮
            if (this.options.autoControlsCombine) {
                this.controls.autoEl.append(this.controls.start);
            } else {
                this.controls.autoEl.append(this.controls.start).append(this.controls.stop);
            }

            // 自定义auto按钮显示位置
            if (this.options.autoControlsSelector) {
                $(this.options.autoControlsSelector).html(this.controls.autoEl);
            } else {
                this.controls.element.addClass('liwy-has-controls-auto').append(this.controls.autoEl);
            }
            // 更新自动按钮状态样式
            this.updateAutoControls(this.options.autoStart ? 'stop' : 'start');
        }

        //创建pager按钮
        if (this.options.pager) {
            if (!this.options.pagerCustom) {
                this.pagerEl = $('<div class="liwy-pager" />');
                if (this.options.pagerSelector) {
                    $(this.options.pagerSelector).html(this.pagerEl);
                } else {
                    this.controls.element.addClass('liwy-has-pager').append(this.pagerEl);
                }
                
                this.populatePager(); //布局pagerEl的样式
            } else {
                this.pagerEl = $(this.options.pagerCustom);
            }
            //为pager子元素绑定事件
            this.pagerEl.on('click touchend', 'a', $.proxy(function(e) {
                var pagerLink, pagerIndex;
                e.preventDefault();
                if (this.controls.element.hasClass('disabled')) {
                    return;
                }
                // 停止自动transition
                // if (this.options.auto  && this.options.stopAutoOnClick) { el.stopAuto(); }
                pagerLink = $(e.currentTarget);
                if (pagerLink.attr('data-slide-index') !== undefined) {
                    pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
                    //跳转到pager指定的slide
                    if (pagerIndex !== this.active.index) { this.goToSlide(pagerIndex); }
                }
            },this));
        }

        //将创建的控制按钮添加到viewport
        if (this.options.controls || this.options.autoControls || this.options.pager) {
            this.viewport.after(this.controls.element); 
        }

        this.start();
    };

    /**
     * 启动插件
     */
    LiwySlide.prototype.start = function() {
        
        //如果无限循环，复制第一个slide放到最后，复制最后一个slide放到最前
        if (this.options.infiniteLoop && this.options.mode !== 'fade') {
            var slice = 1,
                sliceAppend  = this.children.slice(0, slice).clone(true).addClass('liwy-clone'),
                slicePrepend = this.children.slice(-slice).clone(true).addClass('liwy-clone');

            this.$element.append(sliceAppend).prepend(slicePrepend);
        }

        // 移除加载中div
        this.loader.remove();

        //重置slide的position坐标
        this.setSlidePosition();

        //更新pager的活动样式
        if (this.options.pager) { this.updatePagerActive(this.options.startSlide); } 
        //更新controls的样式
        if (this.options.controls) { this.updateDirectionControls(); } 

        //当窗口大小改变时调整样式
        $(window).bind('resize', $.proxy(function(e) {

            //redrawSlider
            this.children.add(this.$element.find('.liwy-clone')).outerWidth(this.viewport.width());

            //重置slide的position坐标
            this.setSlidePosition();

        },this));

        //设置auto start
        if (this.options.auto && this.options.autoStart) {
            // 自动启动前等待时间
            if (this.options.autoDelay > 0) {
                var timeout = setTimeout($.proxy(this.startAuto,this), this.options.autoDelay);
            } else {
                this.startAuto();
            }
        }
    };




    //===================================================================================
    //============================ API方法 start ========================================
    //===================================================================================
    /**
     * 转换到指定的slide位置
     *
     * @param slideIndex (int)
     *  - 转换到slide的位置
     *
     * @param direction (string)
     *  - 方向 "prev" / "next"
     */
    LiwySlide.prototype.goToSlide = function(pagerIndex, direction) {
        // 判断slide是否正在转换中，忽略
        if (this.working || this.active.index === this.oldIndex) { return; }
        this.working = true;//设置slide正在转换

        var position = {left: 0, top: 0},
            value, 
            requestEl;

        this.oldIndex = this.active.index;

        // 计算活动对象index
        var activeIndex = pagerIndex;
        if (pagerIndex < 0) {
            if (this.options.infiniteLoop) {
              activeIndex = this.getPagerNumber() - 1; //移动到最后一个slide
            }else {
              activeIndex = this.active.index;  //不移动
            }
        } else if (pagerIndex >= this.getPagerNumber()) {
            if (this.options.infiniteLoop) {
                activeIndex = 0; //移动到第一个slide
            } else {
                activeIndex =  this.active.index;//不移动
            }
        }
        this.active.index = activeIndex;

        // 是否为最后一个
        this.active.last = this.active.index >= this.getPagerNumber() - 1;

        
        // 更新pager的激活状态
        if (this.options.pager || this.options.pagerCustom) { this.updatePagerActive(this.active.index); }
        // 更新next/prev按钮的激活状态
        if (this.options.controls) { this.updateDirectionControls(); }


        //如果移动的方向是next，且是从最后一个移动到第一个时
        if (direction === 'next' && this.active.index === 0) {
            //将移动的坐标定位到最后一个slide的后面，我们在start时复制的第一个slide的位置
            position = this.$element.find('> .liwy-clone').eq(1).position();
            this.active.last = false;

        } else if (pagerIndex >= 0) {
            requestEl = pagerIndex * parseInt(this.getMoveNumber());//目标slide
            position = this.children.eq(requestEl).position(); //目标slide的坐标

        }

        //执行转换动画
        if (typeof (position) !== 'undefined') {
            value = this.options.mode === 'horizontal' ? -position.left : -position.top;
            // plugin values to be animated
            this.transitionAnimate(value, 'slide', this.options.speed);
        }

        //转换结束，重置working状态
        // this.working = false;
    };


    /**
     * 转换到下一个slide
     */
    LiwySlide.prototype.goToNextSlide = function() {
        //非无限模式时到达最后一个后不再转换到下一个
        if (!this.options.infiniteLoop && this.active.last) { return; } 
        if (this.working == true){ return ;}
        var pagerIndex = parseInt(this.active.index) + 1;

        this.goToSlide(pagerIndex, 'next');
    };

    /**
     * 转换到前一个slide
     */
    LiwySlide.prototype.goToPrevSlide = function() {
        //非无限模式时到达第一个后不再转换到上一个
        if (!this.options.infiniteLoop && this.active.index === 0) { return; } 
        if (this.working == true){ return ;}
        var pagerIndex = parseInt(this.active.index) - 1;

        this.goToSlide(pagerIndex, 'prev');
    };

    /**
     * 开始自动转换
     */
    LiwySlide.prototype.startAuto = function(preventControlUpdate) {
        if (this.interval) { return; }
        this.interval = setInterval($.proxy(function() {
            if (this.options.autoDirection === 'next') {
                this.goToNextSlide();
            } else {
                this.goToPrevSlide();
            }
        },this), this.options.pause);

        //更新start/stop按钮的激活状态
        if (this.options.autoControls && preventControlUpdate !== true) { 
            this.updateAutoControls('stop'); 
        }
    };

    /**
     * 停止自动转换
     */
    LiwySlide.prototype.stopAuto = function(preventControlUpdate) {
        if (!this.interval) { return; }
        clearInterval(this.interval); //清除循环函数
        this.interval = null;

        //更新start/stop按钮的激活状态
        if (this.options.autoControls && preventControlUpdate !== true) { this.updateAutoControls('start'); }
    };
    //===================================================================================
    //============================ API方法 end ==========================================
    //===================================================================================




    //===================================================================================
    //============================ 工具方法 start =======================================
    //===================================================================================
    /**
     * 获取viewprot中可显示的slide个数（包括部分可见的幻灯片）
     * getNumberSlidesShowing
     *
     */
    LiwySlide.prototype.getSlideShowNumber = function() {
        var slidesShowing = 1,
            childWidth = null;
        return slidesShowing;
    };

    /**
     * 获取每次移动的slide个数
     * getMoveBy
     */
    LiwySlide.prototype.getMoveNumber = function() {
        return this.getSlideShowNumber();
    };

    /**
     * 获取pager的个数
     * getPagerQty
     */
    LiwySlide.prototype.getPagerNumber = function() {
        var pagerQty = 0,
            breakPoint = 0,
            counter = 0;

        pagerQty = Math.ceil(this.children.length / this.getSlideShowNumber());
        return pagerQty;
    };

    /**
     * 设置pager的布局样式
     */
    LiwySlide.prototype.populatePager = function() {
        var pagerHtml = '',
            linkContent = '',
            pagerQty = this.getPagerNumber();
        for (var i = 0; i < pagerQty; i++) {
            linkContent = '';
            if (this.options.buildPager && $.isFunction(this.options.buildPager) || this.options.pagerCustom) {
                linkContent = this.options.buildPager(i);
                this.pagerEl.addClass('liwy-custom-pager');
            } else {
                linkContent = i + 1;
                this.pagerEl.addClass('liwy-default-pager');
            }
            pagerHtml += '<div class="liwy-pager-item"><a href="" data-slide-index="' + i + '" class="liwy-pager-link">' + linkContent + '</a></div>';
        }
        this.pagerEl.html(pagerHtml);
    };

    /**
     * 更新pager的激活状态
     */
    LiwySlide.prototype.updatePagerActive = function(slideIndex) {
        var len = this.children.length;

        this.pagerEl.find('a').removeClass('active');
        this.pagerEl.each(function(i, el) { 
            $(el).find('a').eq(slideIndex).addClass('active'); 
        });
    };

    /**
     * 更新next/prev按钮的激活状态（检查是否应该是隐藏的）
     */
    LiwySlide.prototype.updateDirectionControls = function() {
      if (this.getPagerNumber() === 1) {
        this.controls.prev.addClass('disabled');
        this.controls.next.addClass('disabled');
      } else if (!this.options.infiniteLoop && this.options.hideControlOnEnd) {
        // if first slide
        if (this.active.index === 0) {
          this.controls.prev.addClass('disabled');
          this.controls.next.removeClass('disabled');
        // if last slide
        } else if (this.active.index === this.getPagerNumber() - 1) {
          this.controls.next.addClass('disabled');
          this.controls.prev.removeClass('disabled');
        // if any slide in the middle
        } else {
          this.controls.prev.removeClass('disabled');
          this.controls.next.removeClass('disabled');
        }
      }
    };

    /**
     * 更新start/stop按钮的激活状态
     */
    LiwySlide.prototype.updateAutoControls = function(state) {
        console.log(state);
        if (this.options.autoControlsCombine) {
            this.controls.autoEl.html(this.controls[state]);
        } else {
            this.controls.autoEl.find('a').removeClass('active');
            this.controls.autoEl.find('a:not(.liwy-' + state + ')').addClass('active');
        }
    };

    /**
     * 动画转换方法
     * setPositionProperty
     *
     * @param value (int)
     *  - 动画属性的值
     *
     * @param type (string) 'slide', 'reset', 'ticker'
     *  - 函数的类型
     *
     * @param duration (int)
     *  - 过渡所需时间（ms）
     *
     * @param params (array) optional
     *  - 包含任何变量，需要通过一个可选的参数
     */
    LiwySlide.prototype.transitionAnimate = function(value, type, duration, params) {
        var animateObj, propValue;

        animateObj = {};
        animateObj[this.animProp] = value;
        if (type === 'slide') { //移动动画
            this.$element.animate(animateObj, duration, this.options.easing, $.proxy(function() {
                this.transitionAnimateAfter();
            },this));
        } else if (type === 'reset') { //无动画
            this.$element.css(this.animProp, value);
        }

    };

    /**
     * 动画转换后的工作
     * updateAfterSlideTransition
     */
    LiwySlide.prototype.transitionAnimateAfter = function() {
        if (this.options.infiniteLoop) {
            var position = '';
            if (this.active.index === 0) {
                position = this.children.eq(0).position();
            } else if (this.active.index === this.children.length - 1) {
                position = this.children.eq(this.children.length - 1).position();
            }
            if (position) {
                //开始执行转换动画
                if (this.options.mode === 'horizontal') { this.transitionAnimate(-position.left, 'reset', 0); }
                else if (this.options.mode === 'vertical') { this.transitionAnimate(-position.top, 'reset', 0); }
            }
        }
        // 声明转换动画完成
        this.working = false;
    };

    /**
     * 设置slide的 position
     */
    LiwySlide.prototype.setSlidePosition = function() {
        // 设置$element的开始时的left/top坐标
        var position = this.children.eq(this.active.index * this.getMoveNumber()).position();
        // 移动到开始时的位置
        if (position !== undefined) {
          if (this.options.mode === 'horizontal') { this.transitionAnimate(-position.left, 'reset', 0); }
          else if (this.options.mode === 'vertical') { this.transitionAnimate(-position.top, 'reset', 0); }
        }
    };

    //===================================================================================
    //============================== 工具方法 end =======================================
    //===================================================================================

    //为jquery添加我们的liwy-slide插件
    $.fn.liwySlide = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('liwy.slide');
            if (!data) {
                data = new LiwySlide(this, typeof option === 'object' && option);
                $this.data('liwy.slide', data);
            }
        });
    };
})(window.jQuery, window, document);