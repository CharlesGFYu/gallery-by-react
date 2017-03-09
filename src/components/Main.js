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
class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		figureArr.push(this.figureItem);
	}
	render() {
		return (
			<figure className="img-figure" ref={(figureItem) => { this.figureItem = figureItem; }}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}

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
				}*/
			]
		}
	}
	/*
		* 重新布局所有图片
		* @param centerIndex 指定居中排布哪个图片
	*/
	rearrange(centerIndex) {

	}
	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {
		//首先拿到舞台的占位大小
		let //stageDOM = React.findDOMNode(this.refs.stage),
				stageDOM = this.stageSec,
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);
		//拿到一个imageFigure的占位大小
		let //imgFigureDOM = React.findDOMNode(this.refs.imageFigure0),//0.14.0之后废除，使用回调方式
				imgFigureDOM = //this.imgFigure._reactInternalInstance._renderedComponent._hostNode,
											 this.imgFigure.figureItem,
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
		this.state.Constant.vPosRange.x[0] = halfImgW - imgW;
		this.state.Constant.vPosRange.x[1] = halfImgW;

		this.rearrange(0);
	}
  render() {
  	let controllerUnits = [],imgFigures = [];
  	imageDatas.forEach((value,index) => {
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					}
				}
			}
  		//imgFigures.push(<ImgFigure key={index.toString()} data={value} ref={'imgFigure'+index}/>);
			imgFigures.push(<ImgFigure key={index.toString()} data={value} ref={(imgFigure) => { this.imgFigure = imgFigure; }}/>);
  	});
    return (
	    // <section className="stage" ref="stage">
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
