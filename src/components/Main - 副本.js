require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片数据 
let imageDatas = require('../data/imageDatas.json');
//将图片信息转换为图片URL路径信息
/*let genImageURL = (imageDatasArr) => {
	for (let i = 0,j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i]

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);*/

imageDatas = ((imageDatasArr) => {
	for (let i = 0,j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i]

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
  		<img src={yeomanImage} alt="Yeoman Generator" />
    	<div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
		<h2>My edited here.</h2> 
	    <section className="stage">
	      <section className="img-sec">      		
	      </section>
	      <nav className="controller-nav">
	      </nav>
	    </section>       
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
