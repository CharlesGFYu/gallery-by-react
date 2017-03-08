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

class ImgFigure extends React.Component {
	render() {
		return (
			<figure>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figurecaption>
					<h2>{this.props.data.title}</h2>
				</figurecaption>
			</figure>
		)
	}
}

class AppComponent extends React.Component {
	construct(){
		this.controllerUnits = [];
		this.ImgFigures = [];
	}
  render() {
  	// var controllerUnits = [],ImgFigures = [];
  	imageDatas.forEach((value) => {
  		this.ImgFigures.push(<ImgFigure data={value}/>);
  	}).bind(this);
    return (
	    <section className="stage">
	     	<section className="img-sec">
	     		{this.imgFigures}
	     	</section>
	     	<nav className="controller-nav">
					{this.controllerUnits}
	     	</nav>
	    </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
