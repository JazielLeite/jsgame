function blockr(config) {
	this.gameFncs = config.gameFncs || { finishBlock : doNothing };
	this.prize = config.prize || {power: 0, speed: 0, bomb: 0, typeAmmo: 0, bombPower : 0};
	this.speed = config.speed || 1;
	this.power = config.power || 10;
	this.canvas = config.canvas || document.getElementById("canvas");
	this.width = config.width || 30;
	this.height = config.height || this.canvas.offsetHeight/5 || this.width;
	this.top = config.top || 0;
	this.maxPower = config.maxPower || 30;
	this.initialPower = this.power;
	this.left = config.left || this.canvas.offsetWidth;
	this.id = config.id || Math.floor((Math.random() * 10000) + 1);
	this.dom = null;
	this.timmer = null;
	this.init();
}

blockr.prototype = {
	init : function(config) {
		this.dom = document.createElement("DIV");
		this.dom.id = "BLK-" + this.id;
		this.dom.className = this.getClass();
		this.dom.style.top = this.top + "px";
		this.dom.style.left = this.left + "px";
		this.dom.style.width = this.width + "px";
		this.dom.style.height = this.height + "px";
		this.canvas.appendChild(this.dom);
		this.dom.innerHTML = this.getLabel();
		this.go();
	},
	getClass: function() {
		var className = "block";
		if (this.prize.typeAmmo && this.prize.typeAmmo > 0) {
			className += " type";
		} 
		else if (this.prize.speed && this.prize.speed > 0) {
			className += " speed";
		}
		else if (this.prize.power && this.prize.power > 0) {
			className += " power";
		}
		else if (this.prize.bomb && this.prize.bomb > 0) {
			className += " bomb";
		}
		else if (this.prize.bombPower && this.prize.bombPower > 0) {
			className += " bombpower";
		} 
		return className;
	},
	getLabel : function() {
		var label = "";
		if (this.prize.typeAmmo && this.prize.typeAmmo > 0) {
			this.dom.className += " type";
			label += "TYPE "+this.prize.typeAmmo+"<BR/>";
		} 
		else if (this.prize.speed && this.prize.speed > 0) {
			this.dom.className += " speed";
			label += "SPEED<BR/>";
		}
		else if (this.prize.power && this.prize.power > 0) {
			this.dom.className += " power";
			label += "POWER<BR/>";
		}
		else if (this.prize.bomb && this.prize.bomb > 0) {
			this.dom.className += " bomb";
			label += "BOMB<BR/>";
		}
		else if (this.prize.bombPower && this.prize.bombPower > 0) {
			this.dom.className += " bombpower";
			label += "BOMBPOW +"+this.prize.bombPower+"<BR/>";
		} 
		else {
			label += "BLOCK<BR/>";
		}
		return label + this.power;
	},
	go : function() {
		var that = this;
		this.timmer = window.setInterval(function() {
			that.left -= 10 * that.speed;
			that.dom.style.left = that.left + "px";
		},60);
	}, 
	stop : function() {
		console.log("parando bloco " + this.id);
		window.clearInterval(this.timmer);
		this.dom.parentNode.removeChild(this.dom);
		this.gameFncs.finishBlock(this);
	}, 
	pause : function() {
		window.clearInterval(this.timmer);
	},
	hit : function(bulletPower) {
		if (this.left + this.width < 0) {
			this.stop();
			return;
		}
		if (bulletPower <= 0) {
			return;
		}
		this.power -= bulletPower;
		if (this.power <= 0) {
			this.stop();
			return;
		}
		this.dom.innerHTML = this.getLabel();
	},
	getTop : function() {
		return this.top;
	}, 
	getLeft : function() {
		return this.left;
	},
	getRight : function() {
		return this.left + this.width;
	},
	getHeight : function() {
		return this.height;
	},
	getWidth : function() {
		return this.width;
	},
	getPower : function() {
		return this.power;
	},
	getInitialPower : function() {
		return this.initialPower;
	},
	getPrize : function() {
		return this.prize;
	}
}