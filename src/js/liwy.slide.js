/**
 * liwy-slide
 * @version 1.0.0
 * @author liwy
 * @license THe MIT License (MIT)
 * 
 * @todo 单项或多项显示
 * 		 --设置项的数量
 * 		 --设置项的右边距
 * @todo 项的无限循环功能
 * @todo 传送带模式
 * 		 --自定义项宽度
 *       --设置移动速度
 * @todo 鼠标拖动与触摸拖动
 * @todo 单项时out/in动画
 * 		 --设置动画时间
 * @todo 自动高度
 * @todo 自动播放
 *   	 --设置播放间隔
 *       --设置鼠标悬停
 * @todo next/prev按钮
 *		 --自定义按钮
 * @todo play/stop按钮
 * @todo dots按钮
 * 		 --自定义按钮
 * @todo 自适应
 * 		 --调整项数量
 * 		 --调整next/prev按钮显示
 *       --调整dots按钮显示
 * @todo 切换方向
 *  	 --从左到右
 *		 --从右到左
 * 		 --从上到下
 * 		 --从下到上
 * 		 --褪色模式
 * @todo caption标题
 * @todo 缩略图按钮
 * @todo 延迟加载
 * @todo 事件回调函数
 * @todo reload slide
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
		this.init();
	};

	/**
	 * 默认参数对象
	 * 静态属性
	 * @public
	 */
	LiwySlide.defaults = {
		'color': 'red',
		'fontSize': '12px',

		//基本参数
		mode: 'horizontal',//转换模式：'horizontal','vertical','fade'
	    slideSelector: '', //指定幻灯片的DOM元素,默认为liwySlide的所有的直接子元素,jQuery sellector
	    infiniteLoop: true, //是否无限循环，boolean
	    hideControlOnEnd: false,//在关闭无限循环时，是否到第一个禁用prev按钮，到最后一个禁用next按钮，boolean
	    speed: 500, //转换间隔,单位ms,int
	    easing: null, //过渡特效动画
	    slideMargin: 0, //每个幻灯片的边距,int
	    startSlide: 0, //开始幻灯片的位置,int
	    randomStart: false, //是否随机幻灯片位置开始,boolean
	    captions: false, //显示image的title属性
	    ticker: false, //是否开启传送带模式
	    tickerHover: false, //当鼠标悬停在slide上时，停止ticker，如果使用CSS transitions，此功能不起作用！
	    adaptiveHeight: false, //根据每张幻灯片的高度动态调整滑块的高度
	    adaptiveHeightSpeed: 500,//幻灯片高度转换时间（以毫秒为单位）。注意：只用于adaptiveHeight: true
	    video: false, //是否包含视频，如果包含需要引入plugins/jquery.fitvids.js
	    useCSS: true, //如果为true，CSS转换将用于水平和垂直幻灯片动画（这使用本机硬件加速）。如果是false，将使用jQuery animate（）。
	    preloadImages: 'visible', //加载模式：visible,all;如果“all”，则在启动滑块之前预加载所有图像。如果“visible”，则在开始滑块之前仅预载最初可见幻灯片中的图像（提示：如果所有幻灯片都是相同的尺寸，则使用“visible”）
	    responsive: true, //是否启用调整slider尺寸，如果你需要使用固定宽度的滑块，这是有用的
	    slideZIndex: 50, //sliderd的z-index层级
	    wrapperClass: 'bx-wrapper',//默认：bx-wrapper,滑块的包装类，用于修改bxSlider的默认样式

	    // 触摸参数
	    touchEnabled: true, //是否启用触摸
	    swipeThreshold: 50, //触摸滑动需要超出的像素数量才能执行幻灯片切换。注意：只用于touchEnabled: true
	    oneToOneTouch: true, //如果true，非褪色幻灯片随着手指滑动
	    preventDefaultSwipeX: true, //如果true触摸屏不会随着手指滑动而沿x轴移动
	    preventDefaultSwipeY: false, //如果true触摸屏不会随着手指滑动而沿y轴移动

	    // PAGER
	    pager: true,  //是否显示分页图标
	    pagerType: 'full',//'full','short';如果'full'，将为每个幻灯片生成寻分页链接。如果'short'，将使用x / y分页（例1/5）
	    pagerShortSeparator: ' / ', //如果pagerType: 'short'，pager将使用该值作为分离字符
	    pagerSelector: null, //元素用来填充pager。默认情况下，寻呼机附加到bx-viewport, jQuery selector
	    buildPager: null, //如果提供，则在每个幻灯片元素上调用函数，并将返回的值用作pager item标记。function(slideIndex)
	    pagerCustom: null, //父元素用作pager。父元素必须包含么个slider的<a data-slide-index="x">元素。见这里的例子。不适用于dynamic carousels。,jQuery selector

	    // CONTROLS
	    controls: true,  //是否显示next/prev按钮
	    nextText: 'Next', //next按钮显示文本
	    prevText: 'Prev', //prev按钮显示文本
	    nextSelector: null, //next按钮的位置，用于自定义,jQuery selector
	    prevSelector: null, //prev按钮的位置，用于自定义,jQuery selector
	    autoControls: false, //是否显示start/stop按钮
	    startText: 'Start', //start按钮显示文本
	    stopText: 'Stop', //stop按钮显示文本
	    autoControlsCombine: false,	//当幻灯片播放时，只显示“停止”控制，反之亦然
	    autoControlsSelector: null, //元素用于填充自动控件,jQuery selector

	    // AUTO
	    auto: false, //是否开启自动转换
	    pause: 4000, //自动转换的间隔
	    autoStart: true, //自动显示开始播放。如果false，当单击“开始”控件时，幻灯片放映将开始
	    autoDirection: 'next',//next,prev; 自动显示幻灯片切换的方向
	    stopAutoOnClick: false,//与控件交互将停止自动播放
	    autoHover: false, //当鼠标悬停在滑块上时，自动显示将暂停
	    autoDelay: 0, //自动显示应在启动前等待时间
	    autoSlideForOnePage: false,

	    // CAROUSEL
	    minSlides: 1,  //要显示的最小幻灯片数量。如果圆盘传送带小于原始尺寸，幻灯片的尺寸将缩小。
	    maxSlides: 1, //要显示的幻灯片的最大数量。如果圆盘传送带大于原始尺寸，幻灯片将会大小。
	    moveSlides: 0, //要转移的幻灯片数量。这个值必须>= minSlides和<= maxSlides。如果为零（默认值），将使用完全可见幻灯片的数量。
	    slideWidth: 0, //每张幻灯片的宽度。所有水平转盘都需要此设置！
	    shrinkItems: false, //旋转木马只会显示整个项目，并缩小图像以适合基于maxSlides / MinSlides的视口。

	    /*
		// KEYBOARD
    	keyboardEnabled: false,  //启用可见滑块的键盘导航
	    // 无障碍参数
	    ariaLive: true,
	    ariaHidden: true,
	    */

	    // CALLBACKS
	    onSliderLoad: function() { return true; },  //滑块完全加载后立即执行
	    onSlideBefore: function() { return true; }, //在每个幻灯片转换之前立即执行。
	    onSlideAfter: function() { return true; }, //每次幻灯片转换后立即执行。函数参数是当前的slide元素（当转换完成时）。
	    onSlideNext: function() { return true; }, //在“下一步”幻灯片切换之前立即执行。函数参数是目标（下一个）幻灯片元素。
	    onSlidePrev: function() { return true; },//在每个“上一个”幻灯片转换之前立即执行。函数参数是目标（prev）幻灯片元素。
	    onSliderResize: function() { return true; },  //滑块调整大小后立即执行
		onAutoChange: function() { return true; } //自动转移开始或停止后立即执行。
 
	};

	/**
	 * 初始化方法
	 * 实例方法
	 * @public
	 */
	LiwySlide.prototype.init = function() {
		this.options.slideWidth = parseInt(this.options.slideWidth); //转换slide的宽度的数据类型
		this.children = this.$element.children(this.options.slideSelector); //slider的子元素集合

		//检查实际幻灯片张数小于minslides / maxslides
		if (this.children.length < this.options.minSlides) { this.options.minSlides = this.children.length; }
      	if (this.children.length < this.options.maxSlides) { this.options.maxSlides = this.children.length; }

      	//如果设置随机起始位置，重置起始位置为一个随机数
      	if (this.options.randomStart) { this.options.startSlide = Math.floor(Math.random() * this.children.length); }

      	//设置活动对象的位置信息
      	this.active = { index: this.options.startSlide };

		//旋转模式
      	this.carousel = this.options.minSlides > 1 || this.options.maxSlides > 1 ? true : false;
      	//如果为旋转模式，关闭延迟加载
      	if (this.carousel) { this.optons.preloadImages = 'all'; }

      	//计算slide显示区域的宽度范围
      	this.minThreshold = (this.optons.minSlides * this.optons.slideWidth) 
      						+ ((this.optons.minSlides - 1) * this.optons.slideMargin);
      	this.maxThreshold = (this.optons.maxSlides * this.optons.slideWidth) 
      						+ ((this.optons.maxSlides - 1) * this.optons.slideMargin);

      	// 存储slide的活动状态
      	this.working = false;
      	// 初始化控制按钮对象
      	this.controls = {};
      	// 初始化周期函数
      	this.interval = null;
      	// 确定哪些属性用于转换
      	this.animProp = this.options.mode === 'vertical' ? 'top' : 'left';

      	//确定是否可以使用硬件加速
      	this.usingCSS = this.options.useCSS && this.options.mode !== 'fade' && (function() {
        	// create our test div element
        	var div = document.createElement('div'),
        	// css transition properties
        	props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
        	// test for each property
        	for (var i = 0; i < props.length; i++) {
          		if (div.style[props[i]] !== undefined) {
            		this.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
            		this.animProp = '-' + this.cssPrefix + '-transform';
            		return true;
          		}
        	}
        	return false;
      	}());

      	// 如果垂直模式，显示的slides最大与最小数相同
      	if (this.options.mode === 'vertical') { this.options.maxSlides = this.options.minSlides; }

      	// 保存原始样式到 data
      	$element.data('origStyle', $element.attr('style'));
      	$element.children(this.options.slideSelector).each(function() {
        	$(this).data('origStyle', $(this).attr('style'));
      	});


		setup();
	};

	/**
	 * 执行dom与css的修改
	 */
	LiwySlide.prototype.setup = function() {

		var preloadSelector = this.children.eq(this.options.startSlide); //设置默认加载的子slide

		// 包装slide到一个包装元素中
      	$element.wrap('<div class="' + this.options.wrapperClass + '"><div class="liwy-viewport"></div></div>');

      	// 存储.liwy-viewport元素
      	this.viewport = $element.parent();

      	/*
      	// 添加无障碍属性
      	if (this.options.ariaLive && !this.options.ticker) {
        	this.viewport.attr('aria-live', 'polite');
      	}
      	*/

      	// 加载中的提示div
      	this.loader = $('<div class="liwy-loading" />');
      	this.viewport.prepend(this.loader);

      	//设置$element的最大宽度，去控制任何可能的slides
      	//也从$element中去除margin和padding
      	$element.css({
        	width: this.options.mode === 'horizontal' ? (this.children.length * 1000 + 215) + '%' : 'auto',
        	position: 'relative'
      	});

      	//如果使用css转换，和添加了easing
      	if (this.usingCSS && this.options.easing) {
        	$element.css('-' + this.cssPrefix + '-transition-timing-function', this.options.easing);
      	} else if (!this.options.easing) {
        	this.options.easing = 'swing';
      	}

	    // 设置.liwy-viewport的样式
	    this.viewport.css({
	        width: '100%',
	        overflow: 'hidden',
	        position: 'relative'
	    });

	    //设置.liwy-viewport父元素的最大宽度
      	slider.viewport.parent().css({
        	maxWidth: getViewportMaxWidth()
      	});

      	// 设置slide子元素样式
      	this.children.css({
        	'float': this.options.mode === 'horizontal' ? 'left' : 'none',
        	listStyle: 'none',
        	position: 'relative'
      	});
      	this.children.css('width', getSlideWidth());
      	if (this.options.mode === 'horizontal' && this.options.slideMargin > 0) { 
      		this.children.css('marginRight', this.options.slideMargin); 
      	}
      	if (this.options.mode === 'vertical' && this.options.slideMargin > 0) { 
      		this.children.css('marginBottom', this.options.slideMargin); 
      	}

      	// 如果fade模式，设置slider子元素样式
      	if (this.options.mode === 'fade') {
        	this.children.css({
          		position: 'absolute',
          		zIndex: 0,
          		display: 'none'
        	});
        	// 设置startSlide的zIndex值
        	this.children.eq(this.options.startSlide).css({zIndex: this.options.slideZIndex, display: 'block'});
      	}

      	// 创建控制按钮容器元素
      	this.controls.element = $('<div class="liwy-controls" />');

      	// 如果现实图片标题
      	if (this.options.captions) {
      		this.children.each(function(index) {
		        var title = $(this).find('img:first').attr('title');
		        if (title !== undefined && ('' + title).length) {
		          $(this).append('<div class="liwy-caption"><span>' + title + '</span></div>');
		        }
		     });
      	}

      	//活动slide是否是最后一个
      	this.active.last = this.options.startSlide === getPagerQty() - 1;

      	// 如果开启video引入fitVids()插件
      	if (this.options.video) { $element.fitVids(); }

      	//设置预加载的子项集
      	if (this.options.preloadImages === 'all' || this.options.ticker) { preloadSelector = this.children; }

      	if (!this.options.ticker) {
	      	//添加next/prev元素
	        if (this.options.controls) {
	        	this.controls.next = $('<a class="liwy-next" href="">' + this.options.nextText + '</a>');
			    this.controls.prev = $('<a class="liwy-prev" href="">' + this.options.prevText + '</a>');
			    //绑定事件
			    this.controls.next.bind('click touchend', function(e) {
			      	e.preventDefault();
			      	if (this.controls.element.hasClass('disabled')) { return; }
			      	if (this.options.auto && this.options.stopAutoOnClick) { this.stopAuto(); }
			      	this.goToNextSlide();
			    });
			    this.controls.prev.bind('click touchend', clickPrevBind);

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
	        //添加stop/play元素
	        if (this.options.auto && this.options.autoControls) {
	        	this.controls.start = $('<div class="liwy-controls-auto-item"><a class="liwy-start" href="">' + this.options.startText + '</a></div>');
			    this.controls.stop = $('<div class="liwy-controls-auto-item"><a class="liwy-stop" href="">' + this.options.stopText + '</a></div>');
			    
			    this.controls.autoEl = $('<div class="liwy-controls-auto" />');
			    //绑定事件
			    this.controls.autoEl.on('click', '.liwy-start', clickStartBind);
			    this.controls.autoEl.on('click', '.liwy-stop', clickStopBind);

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
			    // update the auto controls
			    updateAutoControls(this.options.autoStart ? 'stop' : 'start');
	        }
	        //添加pager
	        if (this.options.pager) {
	        	if (!this.options.pagerCustom) {
			        this.pagerEl = $('<div class="liwy-pager" />');
			        if (this.options.pagerSelector) {
			          	$(this.options.pagerSelector).html(this.pagerEl);
			        } else {
			          	this.controls.element.addClass('liwy-has-pager').append(this.pagerEl);
			        }
			        
			        populatePager();
		      	} else {
		        	this.pagerEl = $(this.options.pagerCustom);
		      	}
		    	//为pager子元素绑定事件
		      	this.pagerEl.on('click touchend', 'a', clickPagerBind);
	        }
	        if (this.options.controls || this.options.autoControls || this.options.pager) { 
	        	this.viewport.after(this.controls.element); 
	        }
      	} else {
        	this.options.pager = false;
      	}
	};


	//=============================PUBLIC function start===================================
	/**
     * 转换到指定的slide位置
     *
     * @param slideIndex (int)
     *  - 转换到slide的位置
     *
     * @param direction (string)
     *  - 方向 "prev" / "next"
     */
    LiwySlide.goToSlide = function(slideIndex, direction) {
      	var performTransition = true,
      		moveBy = 0,
      		position = {left: 0, top: 0},
      		lastChild = null,
      		lastShowingIndex, eq, value, requestEl;

      	this.oldIndex = this.active.index;
      	this.active.index = setSlideIndex(slideIndex);

      	// 如果slide正在转换中，忽略
      	if (this.working || this.active.index === this.oldIndex) { return; }
      	//设置slide正在转换
      	this.working = true;

      	//转换前执行onSlideBefor回调函数
      	performTransition = this.options.onSlideBefore.call(this, this.children.eq(this.active.index), this.oldIndex, this.active.index);
      	//如果回调函数返回false结束执行并重置
      	if (typeof (performTransition) !== 'undefined' && !performTransition) {
	        this.active.index = this.oldIndex; // restore old index
	        this.working = false; // is not in motion
	        return;
      	}
      	if (direction === 'next') {
	        // 执行next前调用回调函数
	        if (!this.options.onSlideNext.call(this, this.children.eq(this.active.index), this.oldIndex, this.active.index)) {
	          	performTransition = false;
	        }
      	} else if (direction === 'prev') {
	        // 执行prev前调用回调函数
	        if (!this.options.onSlidePrev.call(this, this.children.eq(this.active.index), this.oldIndex, this.active.index)) {
	          performTransition = false;
	        }
      	}

      	this.active.last = this.active.index >= getPagerQty() - 1;//设置是否为最后一个

      	// 更新pager的活动样式
      	if (this.options.pager || this.options.pagerCustom) { updatePagerActive(this.active.index); }
      	// 更新方向控制键的样式
      	if (this.options.controls) { updateDirectionControls(); }

      	if (this.options.mode === 'fade') {
	        if (this.options.adaptiveHeight && this.viewport.height() !== getViewportHeight()) {
	          	this.viewport.animate({height: getViewportHeight()}, this.options.adaptiveHeightSpeed);
	        }
	        this.children.filter(':visible').fadeOut(this.options.speed).css({zIndex: 0});
	        this.children.eq(this.active.index).css('zIndex', this.options.slideZIndex + 1).fadeIn(this.options.speed, function() {
	          	$(this).css('zIndex', this.options.slideZIndex);
	          	updateAfterSlideTransition();
	        });

	    //???????????????????????????????
      	// 不是 "fade"模式
      	} else {
	        if (this.options.adaptiveHeight && this.viewport.height() !== getViewportHeight()) {
	          this.viewport.animate({height: getViewportHeight()}, this.options.adaptiveHeightSpeed);
	        }

	        if (!this.options.infiniteLoop && this.carousel && this.active.last) {
	          	if (this.options.mode === 'horizontal') {
		            // get the last child position
		            lastChild = this.children.eq(this.children.length - 1);
		            position = lastChild.position();
		            // calculate the position of the last slide
		            moveBy = this.viewport.width() - lastChild.outerWidth();
	          	} else {
		            // get last showing index position
		            lastShowingIndex = this.children.length - this.options.minSlides;
		            position = this.children.eq(lastShowingIndex).position();
	          	}
	          	// horizontal carousel, going previous while on first slide (infiniteLoop mode)
        	} else if (this.carousel && this.active.last && direction === 'prev') {
	          	// get the last child position
	          	eq = this.options.moveSlides === 1 ? this.options.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (this.children.length - this.options.maxSlides);
	          	lastChild = el.children('.bx-clone').eq(eq);
	          	position = lastChild.position();
	        // if infinite loop and "Next" is clicked on the last slide
	        } else if (direction === 'next' && this.active.index === 0) {
	          	// get the last clone position
	          	position = el.find('> .bx-clone').eq(this.options.maxSlides).position();
	          	this.active.last = false;
	        // normal non-zero requests
	        } else if (slideIndex >= 0) {
	          	//parseInt is applied to allow floats for slides/page
	          	requestEl = slideIndex * parseInt(getMoveBy());
	          	position = this.children.eq(requestEl).position();
	        }

	        /* If the position doesn't exist
	         * (e.g. if you destroy the slider on a next click),
	         * it doesn't throw an error.
	         */
	        if (typeof (position) !== 'undefined') {
	          	value = this.options.mode === 'horizontal' ? -(position.left - moveBy) : -position.top;
	          	// plugin values to be animated
	          	setPositionProperty(value, 'slide', this.options.speed);
	        }
	        this.working = false;
      	}
      	if (this.options.ariaHidden) { applyAriaHiddenAttributes(this.active.index * getMoveBy()); }
    };


	/**
     * 转换到下一个slide
     */
    LiwySlide.goToNextSlide = function() {
      	if (!this.options.infiniteLoop && this.active.last) { return; }
	  	if (this.working == true){ return ;}
      	var pagerIndex = parseInt(this.active.index) + 1;
      	this.goToSlide(pagerIndex, 'next');
    };
    /**
     * 转换到前一个slide
     */
    LiwySlide.goToPrevSlide = function() {
      	// if infiniteLoop is false and last page is showing, disregard call
      	if (!this.options.infiniteLoop && this.active.index === 0) { return; }
	  	if (this.working == true){ return ;}
      	var pagerIndex = parseInt(this.active.index) - 1;
      	this.goToSlide(pagerIndex, 'prev');
    };

    /**
     * 开始自动展示
     */
    LiwySlide.startAuto = function(preventControlUpdate) {
      	if (this.interval) { return; }
      	this.interval = setInterval(function() {
        	if (this.options.autoDirection === 'next') {
          		this.goToNextSlide();
        	} else {
          		this.goToPrevSlide();
        	}
      	}, this.options.pause);

	  	//调用onAutoChange回调函数
	  	this.options.onAutoChange.call(this, true);
      	//更新auto按钮
      	if (this.options.autoControls && preventControlUpdate !== true) { updateAutoControls('stop'); }
    };

    /**
     * 停止自动展示
     */
    LiwySlide.stopAuto = function(preventControlUpdate) {
      	if (!this.interval) { return; }
      	clearInterval(this.interval); //清除循环函数
      	this.interval = null;
	  
	  	//调用onAutoChange回调函数
	  	this.options.onAutoChange.call(this, false);

	  	//更新auto按钮
      	if (this.options.autoControls && preventControlUpdate !== true) { updateAutoControls('start'); }
    };
	//=============================PUBLIC function end===================================


	//==============================工具方法 start=========================================

	/**
     * 返回计算宽度可用于 wrapper / viewport
     */
    LiwySlide.prototype.getViewportMaxWidth = function() {
      	var width = '100%';
      	if (this.options.slideWidth > 0) {
        	if (this.options.mode === 'horizontal') {
          		width = (this.options.maxSlides * this.options.slideWidth) 
          				+ ((this.options.maxSlides - 1) * this.options.slideMargin);
        	} else {
          		width = this.options.slideWidth;
        	}
      	}
      	return width;
    };
    /**
     * 返回计算slide子元素的宽度
     */
    LiwySlide.prototype.getSlideWidth = function() {
      	var newElWidth = this.options.slideWidth,
      		wrapWidth = this.viewport.width();
      	// 如果没有设置slideWidth 或 slideWidth大于wrapWidth并且非旋转模式 或 垂直模式
      	if (this.options.slideWidth === 0 ||
        	(this.options.slideWidth > wrapWidth && !this.carousel) ||
        	this.options.mode === 'vertical') {

        	newElWidth = wrapWidth;

      	} else if (this.options.maxSlides > 1 && this.options.mode === 'horizontal') {
        	if (wrapWidth > this.maxThreshold) {
          		return newElWidth;
        	} else if (wrapWidth < this.minThreshold) {
          		newElWidth = (wrapWidth - (this.options.slideMargin * (this.options.minSlides - 1))) / this.options.minSlides;
        	} else if (this.options.shrinkItems) {
          		newElWidth = Math.floor((wrapWidth + this.options.slideMargin) / (Math.ceil((wrapWidth + this.options.slideMargin) / (newElWidth + this.options.slideMargin))) - this.options.slideMargin);
        	}
      	}
      	return newElWidth;
    };

    /*
     * 返回pager的数量
     */
    LiwySlide.prototype.getPagerQty = function() {
      	var pagerQty = 0,
      		breakPoint = 0,
      		counter = 0;

      	if (this.options.moveSlides > 0) {
        	if (this.options.infiniteLoop) {
          		pagerQty = Math.ceil(this.children.length / getMoveBy());
        	} else {

          		while (breakPoint < this.children.length) {
            		++pagerQty;
            		breakPoint = counter + getNumberSlidesShowing();
            		counter += this.options.moveSlides <= getNumberSlidesShowing() ? this.options.moveSlides : getNumberSlidesShowing();
          		}
		  		return counter;
        	}

      	} else {
        	pagerQty = Math.ceil(this.children.length / getNumberSlidesShowing());
      	}
      	return pagerQty;
    };

    /**
     * 返回由单独的幻灯片的数量移动滑块
     */
    LiwySlide.prototype.getMoveBy = function() {
      	// if moveSlides was set by the user and moveSlides is less than number of slides showing
      	if (this.options.moveSlides > 0 && this.options.moveSlides <= getNumberSlidesShowing()) {
        	return this.options.moveSlides;
      	}
      	// if moveSlides is 0 (auto)
      	return getNumberSlidesShowing();
    };

    /**
     * 返回幻灯片视图当前可见的数量（包括部分可见的幻灯片）
     */
    LiwySlide.prototype.getNumberSlidesShowing = function() {
      	var slidesShowing = 1,
      		childWidth = null;
      	if (this.options.mode === 'horizontal' && this.options.slideWidth > 0) {
        	if (this.viewport.width() < this.minThreshold) {
          		slidesShowing = this.options.minSlides;
        	} else if (this.viewport.width() > this.maxThreshold) {
          		slidesShowing = this.options.maxSlides;
        	} else {
          		childWidth = this.children.first().width() + this.options.slideMargin;
          		slidesShowing = Math.floor((this.viewport.width() + this.options.slideMargin) / childWidth) || 1;
        	}
      	// if "vertical" mode, slides showing will always be minSlides
      	} else if (this.options.mode === 'vertical') {
        	slidesShowing = this.options.minSlides;
      	}
      	return slidesShowing;
    };

    /**
     * 更新替换auto按钮
     */
    LiwySlide.prototype.updateAutoControls = function(state) {
      	if (this.options.autoControlsCombine) {
        	this.controls.autoEl.html(this.controls[state]);
      	} else {
        	this.controls.autoEl.find('a').removeClass('active');
        	this.controls.autoEl.find('a:not(.liwy-' + state + ')').addClass('active');
      	}
    };

    /**
     * pager的显示样式
     */
    LiwySlide.prototype.populatePager = function() {
      	var pagerHtml = '',
      		linkContent = '',
      		pagerQty = getPagerQty();
      	//循环pager item
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
     * 如果index大于或小于子元素的个数
     *
     */
    LiwySlide.prototype.setSlideIndex = function(slideIndex) {
      	if (slideIndex < 0) {
	        if (this.options.infiniteLoop) {
	          return getPagerQty() - 1;
	        }else {
	          return this.active.index;
	        }

      	//如果SlideIndex大于子元素的长度，设置活动的位置为0（这发生在无限循环）
      	} else if (slideIndex >= getPagerQty()) {
	        if (this.options.infiniteLoop) {
	          	return 0;
	        } else {
	          	//否则不移动
	          	return this.active.index;
	        }
      	} else {
        	return slideIndex;
      	}
    };

    /**
     * 更新pager的活动样式
     *
     */
    LiwySlide.prototype.updatePagerActive = function(slideIndex) {
      	// 如果pager type为short类型
      	var len = this.children.length; // nb of children
      	if (this.options.pagerType === 'short') {
        	if (this.options.maxSlides > 1) {
          		len = Math.ceil(this.children.length / this.options.maxSlides);
        	}
        	this.pagerEl.html((slideIndex + 1) + this.options.pagerShortSeparator + len);
        	return;
      	}
      	this.pagerEl.find('a').removeClass('active');
      	this.pagerEl.each(function(i, el) { 
      		$element.find('a').eq(slideIndex).addClass('active'); 
      	});
    };

    /**
     * 更新的方向控制（检查是否应该是隐藏的）
     */
    LiwySlide.prototype.updateDirectionControls = function() {
      if (getPagerQty() === 1) {
        this.controls.prev.addClass('disabled');
        this.controls.next.addClass('disabled');
      } else if (!this.options.infiniteLoop && this.options.hideControlOnEnd) {
        // if first slide
        if (this.active.index === 0) {
          this.controls.prev.addClass('disabled');
          this.controls.next.removeClass('disabled');
        // if last slide
        } else if (this.active.index === getPagerQty() - 1) {
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
     * 返回视图的计算高度，用来确定adaptiveheight或最大高度值
     */
    var getViewportHeight = function() {
      	var height = 0;
      	var children = $(); //首先确定哪些子slide应该用在我们的高度计算

      	if (this.options.mode !== 'vertical' && !this.options.adaptiveHeight) {
        	children = this.children;
      	} else {
        	if (!this.carousel) {
          		children = this.children.eq(this.active.index);
        	// 如何设置carousel, 返回一部分子slide
        	} else {
          		var currentIndex = this.options.moveSlides === 1 ? this.active.index : this.active.index * getMoveBy();
          		children = this.children.eq(currentIndex);
          		for (i = 1; i <= this.options.maxSlides - 1; i++) {
            		if (currentIndex + i >= this.children.length) {
              			children = children.add(this.children.eq(i - 1));
            		} else {
              			children = children.add(this.children.eq(currentIndex + i));
            		}
          		}
        	}
      	}

      	if (this.options.mode === 'vertical') {
        	children.each(function(index) {
          		height += $(this).outerHeight();
        	});
        	if (this.options.slideMargin > 0) {
          		height += this.options.slideMargin * (this.options.minSlides - 1);
        	}
      	} else {
        	height = Math.max.apply(Math, children.map(function() {
          		return $(this).outerHeight(false);
        	}).get());
      	}

      	if (this.viewport.css('box-sizing') === 'border-box') {
        	height += parseFloat(this.viewport.css('padding-top')) + parseFloat(this.viewport.css('padding-bottom')) +
              	parseFloat(this.viewport.css('border-top-width')) + parseFloat(this.viewport.css('border-bottom-width'));
      	} else if (this.viewport.css('box-sizing') === 'padding-box') {
        	height += parseFloat(this.viewport.css('padding-top')) + parseFloat(this.viewport.css('padding-bottom'));
      	}

      	return height;
    };

    /**
     * 执行所需的操作幻灯片过渡后
     */
    var updateAfterSlideTransition = function() {
      	if (this.options.infiniteLoop) {
	        var position = '';
	        if (this.active.index === 0) {
	          	position = this.children.eq(0).position();
	        } else if (this.active.index === getPagerQty() - 1 && this.carousel) {
	          	position = this.children.eq((getPagerQty() - 1) * getMoveBy()).position();
	        } else if (this.active.index === this.children.length - 1) {
	          	position = this.children.eq(this.children.length - 1).position();
	        }
	        if (position) {
	          	if (this.options.mode === 'horizontal') { setPositionProperty(-position.left, 'reset', 0); }
	          	else if (this.options.mode === 'vertical') { setPositionProperty(-position.top, 'reset', 0); }
	        }
      	}
      	// 声明转换完成
      	this.working = false;
      	// 条用 onSlideAfter 回调函数
      	this.options.onSlideAfter.call(this, this.children.eq(this.active.index), this.oldIndex, this.active.index);
    };

    /**
     * 设置element的动画属性的位置（这反过来又会使element）。
     * 如果使用CSS，设置的transform 属性。如果不使用CSS设置 top/left属性
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
    var setPositionProperty = function(value, type, duration, params) {
      var animateObj, propValue;
      // 使用 CSS transform
      if (this.usingCSS) {
        // 确定 translate3d 值
        propValue = this.options.mode === 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
        // 添加transition-duration样式
        $element.css('-' + this.cssPrefix + '-transition-duration', duration / 1000 + 's');
        if (type === 'slide') {
          	// 设置 property 值
          	$element.css(this.animProp, propValue);
          	if (duration !== 0) {
            	// bind a callback method - executes when CSS transition completes
            	//绑定完成transition后的回调函数
            	$element.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
              		//确保它是正确的
              		if (!$(e.target).is($element)) { return; }
              		// 解除绑定回调函数
              		$element.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
              		updateAfterSlideTransition();
            	});
          	} else {
            	updateAfterSlideTransition();
          	}
        } else if (type === 'reset') {
          	$element.css(this.animProp, propValue);
        } else if (type === 'ticker') {
          	// make the transition use 'linear'
          	$element.css('-' + this.cssPrefix + '-transition-timing-function', 'linear');
          	$element.css(this.animProp, propValue);
          	if (duration !== 0) {
            	$element.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
              		if (!$(e.target).is($element)) { return; }
              		$element.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
              		setPositionProperty(params.resetValue, 'reset', 0);
              		tickerLoop();
            	});
          	} else { //duration = 0
            	setPositionProperty(params.resetValue, 'reset', 0);
            	tickerLoop();
          	}
        }

      	// 使用 JS animate
      	} else {
        	animateObj = {};
        	animateObj[this.animProp] = value;
        	if (type === 'slide') {
          		$element.animate(animateObj, duration, this.options.easing, function() {
            		updateAfterSlideTransition();
          		});
        	} else if (type === 'reset') {
          		$element.css(this.animProp, value);
        	} else if (type === 'ticker') {
          		$element.animate(animateObj, duration, 'linear', function() {
            		setPositionProperty(params.resetValue, 'reset', 0);
            		// run the recursive loop after animation
            		tickerLoop();
          		});
        	}
      	}
    };

    /**
     * Runs a continuous loop, news ticker-style
     * 运行一个不断循环、创建一个ticker-style
     */
    var tickerLoop = function(resumeSpeed) {
      	var speed = resumeSpeed ? resumeSpeed : this.options.speed,
      		position = {left: 0, top: 0},
      		reset = {left: 0, top: 0},
      		animateProperty, resetValue, params;

      	// 如果next动画left是最后一个子slide，重置left为0
      	if (this.options.autoDirection === 'next') {
        	position = $element.find('.liwy-clone').first().position();
      	} else {
        	reset = this.children.first().position();
      	}
      	animateProperty = this.options.mode === 'horizontal' ? -position.left : -position.top;
      	resetValue = this.options.mode === 'horizontal' ? -reset.left : -reset.top;
      	params = {resetValue: resetValue};
      	setPositionProperty(animateProperty, 'ticker', speed, params);
    };

    //==============================工具方法 end=========================================


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