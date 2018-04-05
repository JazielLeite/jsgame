var doNothing = function() {};
function robot(config) {
	this.gameFncs = config.gameFncs || { addBullet : doNothing, 
										finishBullet : doNothing, 
										destroyRobot : doNothig,
										addBomb: doNothing };
	this.bombs = config.bombs || 0;
	this.shootPower = config.shootPower || 1;
	this.bombPower = config.bombPower || 10;
	this.bombs = config.bombs || 3;
	this.speed = config.speed || 1;
	this.typeAmmo = config.typeAmmo || 1;
	this.width = 120;
	this.height = 90;
	this.canvas = config.canvas || document.getElementById("canvas");
	this.top = Math.floor(this.canvas.offsetHeight / 2);
	this.left = 5;
	this.dom = null;
	this.init();
}

robot.prototype = {
	init : function() {
		this.dom = document.createElement("DIV");
		this.dom.id = "robot";
		this.redrawType(this.typeAmmo);
		this.top = Math.floor(this.top - (this.height/2));
		this.dom.style.left = this.left + "px";
		this.dom.style.top = this.top + "px";
		this.dom.style.width = this.width + 'px';
		this.dom.style.height = this.height + "px";
		this.canvas.appendChild(this.dom);
		this.bind();
	},
	changeType : function(type) {
		if (this.typeAmmo == type) {
			return false;
		}
		this.typeAmmo = type;
		this.redrawType();
		return true;
	},
	redrawType : function() {
		if (this.typeAmmo == 1) {
			this.dom.style.backgroundPosition = "0px 0px";
			this.width = 122;
			this.height = 94;
		} else if (this.typeAmmo == 2) {
			this.dom.style.backgroundPosition = "0px 96px";
			this.width = 123;
			this.height = 94;
		} else if (this.typeAmmo == 3) {
			this.dom.style.backgroundPosition = "0px 196px";
			this.width = 118;
			this.height = 95;
		} else if (this.typeAmmo == 4) {
			this.dom.style.backgroundPosition = "0px 296px";
			this.width = 120;
			this.height = 94;
		}
	},
	bind : function() {
		var that = this;
		document.addEventListener("keypress", function robotBind(e) {
			
			if (e.keyCode == 115 || e.keyCode == 83 || e.keyCode == 40) {
				that.goDown();
			} else if (e.keyCode == 119 || e.keyCode == 87 || e.keyCode == 38) {
				that.goUp();
			} else if (e.keyCode == 98 || e.keyCode == 66) {
				that.bomb();
			} 
		});
		document.addEventListener("keydown", function robotBind(e) {
			if (e.keyCode == 13 || e.keyCode == 32) {
				that.shoot();
			} 
		});
		document.addEventListener("mousedown", function robotBind(e) {
			console.log(e.key, e.keyCode, e);
			that.shoot();
		});
		document.addEventListener("mousemove", function robotMouseMoveBind(e) {
			var top = e.pageY - that.canvas.offsetTop;
			if (that.top > that.canvas.offsetHeight - that.height) {
				top = that.canvas.offsetHeight - that.height;
			} 
			else if (that.top < 0) {
				top = 0;
			}  
			that.top = top;
			that.dom.style.top = that.top + "px";
		});
	},
	unBind : function() {
		document.removeEventListener("keypress", function robotBind(e) {});
		document.removeEventListener("keydown", function robotBind(e) {});
		document.removeEventListener("mousedown", function robotBind(e) {});
		document.removeEventListener("mousemove", function robotMouseMoveBind(e) {});
	},
	goDown : function() {
		var inc = 10 * this.speed;
		if (this.canvas.offsetHeight < this.top + this.height + inc) {
			inc = 0;
		}
		this.top += inc;
		this.dom.style.top = this.top + "px";
	},
	goUp : function() {
		var inc = 10 * this.speed;
		if (this.top - inc < 0) {
			inc = 0;
		}
		this.top -= inc;
		this.dom.style.top = this.top + "px";
	},
	shoot : function() {
		var that = this;
		this.gameFncs.addBullet(
				new bullet(
						{	
							canvas : that.canvas,
							speed: that.speed,
							power: that.shootPower,
							top: Math.floor(that.top + (that.height/2)),
							left: that.left + that.width,
							gameFncs : { 
								finishBullet : that.gameFncs.finishBullet 
							}
						}
				)
		);
	}, 
	bomb : function() {
		if (!this.bombs) {
			return;
		}
		this.bombs--;
		this.gameFncs.addBomb(this.bombPower);
		
	},
	hit : function(block) {
		var blockRight = block.getLeft() + block.getWidth();
		if (blockRight < this.left) {
			return;
		}
		var myRight = this.left + this.width;
		if (block.getLeft() > myRight) {
			return;
		}
		var blockBotton = block.getTop() + block.getHeight();
		if (blockBotton < this.top) {
			return;
		}
		var myBotton = this.top + this.height;
		if (block.getTop() > myBotton) {
			return;
		}
		console.log("C R A S H I N G ", block.id);
		this.gameFncs.destroyRobot();
		
	},
	getShootPower : function() {
		return this.shootPower;
	}
}