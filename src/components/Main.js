require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片数据
let imageDatas = require('../data/imageDatas.json');
//将图片信息转换为图片URL路径信息
imageDatas = ((imageDatasArr) => {
	for (let i = 0,j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i]

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);
let figureArr = [];
//图片单元组件
class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		figureArr.push(this.figureItem);
	}
	/*
		* imgFigure 的点击处理函数
	*/
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let styleObj = {};
		//如果 props 属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		//如果图片的旋转角度有值，并且不为 0 ， 添加旋转角度
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','OTransform','transform']).forEach((value) => {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			});
		}
		if (this.props.arrange.isCenter) {
			styleObj['zIndex'] = '11';
		}
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} ref={(figureItem) => { this.figureItem = figureItem; }} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
						<div>{this.props.data.desc}</div>
					</div>
				</figcaption>
			</figure>
		);
	}
}
//控制单元组件
class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
	}
	handleClick(e) {
		//如果点击的是当前正在居中态的按钮，则翻转图片，否则将对应的图片居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let controllerUnitClassName = "controller-unit";
		//如果对应的是居中的图片，显示控制按钮的居中态
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center ";
			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += " is-inverse ";
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		);
	}
}
//应用组件
class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Constant: {
				centerPos: {
					left: 0,
					top: 0
				},
				hPosRange: {//水平方向的取值范围
					leftSecX: [0,0],
					rightSecX: [0,0],
					y: [0,0]
				},
				vPosRange: {//垂直方向取值范围
					x: [0,0],
					topY: [0,0]
				}
			},
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					}
					rotate: 0,	//旋转角度
					isInverse: false,	//设置正反面
					isCenter: false	//图片是否居中
				}*/
			]
		}
	}
	/*
		* 获取区间内的一个随机值
	*/
	getRangeRandom(low, high) {
		return Math.ceil(Math.random() * (high - low) + low);
	}
	/*
		* 获取 0~30° 之间的一个任意正负值
	*/
	get30DegRandom() {
		return (Math.random() > 0.5 ? '' : '-')+Math.ceil(Math.random()*30);
	}
	/*
		* 翻转图片
		* @param index 输入当前被执行 inverse 操作的图片对应的图片信息数组的 index 值
		* @param {Function} 这是一个闭包函数，其内 return 一个真正待被执行的函数
	*/
	inverse(index) {
		return function () {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}
	/*
		* 利用 rearrange 函数，居中对应 index 的图片
		* @param index , 需要被居中的图片对应的图片信息数组的 index 值
		* @param {Function}
	*/
	center(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	}
	/*
		* 重新布局所有图片
		* @param centerIndex 指定居中排布哪个图片
	*/
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.state.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeX = vPosRange.x,
				vPosRangeTopY = vPosRange.topY,

				imgsArrangeTopArr = [],
				topImgNum = Math.floor(Math.random()*2),//取一个或不取
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

				//首先居中 centerIndex 的图片
				imgsArrangeCenterArr[0] = {
					pos: centerPos,
					rotate: 0,
					isCenter: true
				};

				//取出要布局上侧的图片的状态信息
				topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
				imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

				//布局位于上侧的图片
				imgsArrangeTopArr.forEach((value,index) => {
					imgsArrangeTopArr[index] = {
						pos: {
							top: this.getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
							left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
						},
						rotate: this.get30DegRandom(),
						isCenter: false
					};
				});
				//布局左右两侧的图片
				for (let i = 0,j = imgsArrangeArr.length,k = j/2;i < j;i++) {
					let  hPosRangeLORX = null;
					//前半部布局左边，右半部布局右边
					if (i < k) {
						hPosRangeLORX = hPosRangeLeftSecX;
					} else {
						hPosRangeLORX = hPosRangeRightSecX;
					}

					imgsArrangeArr[i] = {
						pos: {
							top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
							left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
						},
						rotate: this.get30DegRandom(),
						isCenter: false
					}
				}
				if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
					imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
				}
				imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				});
	}
	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {
		//首先拿到舞台的占位大小
		let stageDOM = this.stageSec,
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);
		//拿到一个imageFigure的占位大小
		let imgFigureDOM = this.imgFigure.figureItem,
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);
		//计算中心图片的位置点
		this.state.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		//计算左侧，右侧区域图片排布位置的取值范围
		this.state.Constant.hPosRange.leftSecX[0] = - halfImgW;
		this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.state.Constant.hPosRange.y[0] = -halfImgH;
		this.state.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域图片排布位置的取值范围
		this.state.Constant.vPosRange.topY[0] = -halfImgH;
		this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
		this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.state.Constant.vPosRange.x[1] = halfStageW;
		let initIndex = Math.floor(Math.random() * imageDatas.length);
		this.rearrange(initIndex);
	}
  render() {
  	let controllerUnits = [],imgFigures = [];
  	imageDatas.forEach((value,index) => {
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			imgFigures.push(<ImgFigure key={index.toString()} data={value} ref={(imgFigure) => { this.imgFigure = imgFigure; }} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

			controllerUnits.push(<ControllerUnit key={index.toString()} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
  	});
    return (
			<section className="stage" ref={(stage) => { this.stageSec = stage; }}>
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
