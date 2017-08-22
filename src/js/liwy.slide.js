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
		this.setStyle();
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
	    nextSelector: null, //next按钮的选择器，用于自定义,jQuery selector
	    prevSelector: null, //prev按钮的选择器，用于自定义,jQuery selector
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

		// KEYBOARD
    	keyboardEnabled: false,  //启用可见滑块的键盘导航
	    // 无障碍参数
	    ariaLive: true,
	    ariaHidden: true,

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
	 * setStyle方法
	 * 实例方法
	 * @public
	 */
	LiwySlide.prototype.setStyle = function() {
		this.$element.css({
			'color': this.options.color,
			'fontSize': this.options.fontSize
		});
	};


	//为jquery添加我们的liwy-slide插件
	$.fn.liwySlide = function(option) {

		return this.each(function() {

			var $this = $(this),
				data = $this.data('liwy.slide');

			if (!data) {
				data = new LiwySlide(this, typeof option === 'object' && option);
				$this.data('liwy.slide', data);

				$.each([
					'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
				], function(i, event) {
					console.log("i:"+i+"  event:"+event)
				});
			}
		});
	};
})(window.jQuery, window, document);