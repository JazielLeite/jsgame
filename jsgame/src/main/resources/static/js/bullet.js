function bullet(config) {
	this.gameFncs = config.gameFncs || { finishBullet : doNothing };
	this.width = 15;
	this.height = 15;
	this.id = config.id || Math.floor((Math.random() * 1000000) + 1);
	this.speed = config.speed || 1;
	this.power = config.power || 1;
	this.top = config.top || this.height/2;
	this.left = config.left || this.width/2;
	this.canvas = config.canvas || document.getElementById("canvas");
	this.dom = null;
	this.timmer = null;
	this.init();
}

bullet.prototype = {
	init : function() {
		this.top = this.top - (this.height/2);
		this.dom = document.createElement("DIV");
		this.dom.id = "BUL" + this.id;
		this.dom.style.position = "absolute";
		this.dom.style.top = this.top + "px";
		this.dom.style.left = this.left + "px";
		this.dom.style.width = this.width + "px";
		this.dom.style.height = this.height + "px";
		this.dom.style.borderRadius = "5px";
		this.dom.style.backgroundColor = "#000000";
		this.canvas.appendChild(this.dom);
		this.go();
	},
	go : function() {
		var that = this;
		this.timmer = window.setInterval(function() {
			that.left = that.left + (10 * that.speed);
			that.dom.style.left = that.left + "px";
			if (that.hit()) {
				that.stop();
			}
		},60);
	}, 
	stop : function() {
		console.log("parando bala " + this.id);
		this.dom.parentNode.removeChild(this.dom);
		window.clearInterval(this.timmer);
		this.gameFncs.finishBullet(this);
	},
	pause : function() {
		window.clearInterval(this.timmer);
	},
	hit : function(blocks) {
		if (this.left >= this.canvas.offsetWidth) {
			this.stop();
		} 
		else if (blocks && Object.keys(blocks).length) {
			var that = this;
			Object.keys(blocks).map(function(bId) {
				var block = blocks[bId];
//				debugger;
				var blockRight = block.getLeft() + block.getWidth();
				if (blockRight < that.left) {
					return;
				}
				var myRight = that.left + that.width;
				if (block.getLeft() > myRight) {
					return;
				}
				var blockBotton = block.getTop() + block.getHeight();
				if (blockBotton < that.top) {
					return;
				}
				var myBotton = that.top + that.height;
				if (block.getTop() > myBotton) {
					return;
				}
//				console.log("C R A S H I N G ", block.id);
				that.stop();
				block.hit(that.power);
			});
		}
	}
}