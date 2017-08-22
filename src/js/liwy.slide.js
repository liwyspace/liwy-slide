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
		'fontSize': '12px'
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