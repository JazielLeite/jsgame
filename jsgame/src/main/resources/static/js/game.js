dynamicallyLoadScript("js/robot.js");
dynamicallyLoadScript("js/block.js");
dynamicallyLoadScript("js/bullet.js");

function game(config) {
	this.speed = config && config.speed || 1,
	this.power = config && config.power || 1;
	this.canvas = null; 
	this.scorePoints = null;
	this.scoreSpeed = null;
	this.scorePower = null;
	this.scoreBombPower = null;
	this.scoreBombs = null;
	this.slots = 7;
	this.timmer = null;
	this.timmerCheckHits = null;
	this.robot = null;
	this.bullets = {};
	this.blocks = {};
	this.init();
}

game.prototype = {
	init : function(config) {
		var score = document.createElement("DIV");
		score.className = "score";
		document.body.appendChild(score);

		var spd = document.createElement("DIV");
		spd.style.width = "25%";
		score.appendChild(spd);
		var lbSpd = document.createElement("DIV");
		lbSpd.innerHTML = "Points:";
		lbSpd.className = "lbl";
		
		spd.appendChild(lbSpd);
		this.scorePoints = document.createElement("DIV");
		spd.appendChild(this.scorePoints);

		var ssd = document.createElement("DIV");
		ssd.style.width = "25%";
		score.appendChild(ssd);
		var lbSsd = document.createElement("DIV");
		lbSsd.innerHTML = "Speed:";
		lbSsd.className = "lbl";
		ssd.appendChild(lbSsd);
		this.scoreSpeed = document.createElement("DIV");
		ssd.appendChild(this.scoreSpeed);
		
		var spwd = document.createElement("DIV");
		spwd.style.width = "25%";
		score.appendChild(spwd);
		var lbSpwd = document.createElement("DIV");
		lbSpwd.innerHTML = "Power:";
		lbSpwd.className = "lbl";
		spwd.appendChild(lbSpwd);
		this.scorePower = document.createElement("DIV");
		spwd.appendChild(this.scorePower);
		
		var sbpwd = document.createElement("DIV");
		sbpwd.style.width = "15%";
		score.appendChild(sbpwd);
		var lbSbpwd = document.createElement("DIV");
		lbSbpwd.innerHTML = "BombPower:";
		lbSbpwd.className = "lbl";
		sbpwd.appendChild(lbSbpwd);
		this.scoreBombPower = document.createElement("DIV");
		sbpwd.appendChild(this.scoreBombPower);

		var sbn = document.createElement("DIV");
		sbn.style.width = "10%";
		score.appendChild(sbn);
		var lbSbn = document.createElement("DIV");
		lbSbn.innerHTML = "Bombs:";
		lbSbn.className = "lbl";
		sbn.appendChild(lbSbn);
		this.scoreBombs = document.createElement("DIV");
		sbn.appendChild(this.scoreBombs);
		
		this.canvas = document.createElement("DIV");
		this.canvas.id = "canvas";
		this.canvas.style.height = "90%";
		document.body.appendChild(this.canvas);
		this.load();
	}, 
	load : function() {
		var that = this;
		console.log("Loading game");
		window.setTimeout(this.start.bind(that), 1000);
	},
	start : function() {
		var that = this;
		try {
			this.robot = new robot({
				canvas : that.canvas,
				speed : that.speed,
				gameFncs : { 
					addBullet : function(bullet) {
						that.bullets[bullet.id] = bullet;
					}, 
					finishBullet : function(bullet) {
						delete that.bullets[bullet.id];
					},
					destroyRobot : function() {
						window.clearInterval(that.timmer);
						window.clearInterval(that.timmerCheckHits);
						if (that.blocks && Object.keys(that.blocks).length) {
							Object.keys(that.blocks).map(function(bId) {
								that.blocks[bId].stop();
							});
						}
						if (that.bullets && Object.keys(that.bullets).length) {
							Object.keys(that.bullets).map(function(bId) {
								that.bullets[bId].stop();
							});
						}
						that.canvas.className = "gameover";
						that.canvas.innerHTML = "GAME OVER";
					},
					addBomb : function(bombPower) {
						that.canvas.style.backgroundColor = "#FF0000";
						if (that.blocks && Object.keys(that.blocks) && Object.keys(that.blocks).length) {
							Object.keys(that.blocks).map(function(bId) {
								that.blocks[bId].hit(bombPower);
							});
						}
						that.scoreBombs.innerHTML = that.robot.bombs;
						window.setTimeout(function() {
							that.canvas.style.backgroundColor = '#FFCC00';	
						}, 50);
						window.setTimeout(function() {
							that.canvas.style.backgroundColor = '#FF0000';	
						}, 100);
						window.setTimeout(function() {
							that.canvas.style.backgroundColor = '#FFCC00';	
						}, 150);
						
					}
				}
			});
		} catch(err) {
			console.log("Error when start game", err);
		}
		if (!this.robot) {
			this.load();
		} else {
			console.log("game started");
			this.scoreSpeed.innerHTML = this.robot.speed;
			this.scorePower.innerHTML = this.robot.shootPower;
			this.scoreBombPower.innerHTML = this.robot.bombPower;
			this.scoreBombs.innerHTML = this.robot.bombs;
			this.scorePoints.innerHTML = 0;
			this.timmer = window.setInterval(this.cicles.bind(that), 500);
			this.timmerCheckHits = window.setInterval(this.checkHits.bind(that), 50);
		}
	},
	pause : function() {
		var that = this;
		window.clearInterval(that.timmer);
		window.clearInterval(that.timmerCheckHits);
		if (that.bullets && Object.keys(that.bullets).length) {
			Object.keys(that.bullets).map(function(bId) {
				that.bullets[bId].pause();
			});
		}
		if (that.blocks && Object.keys(that.blocks).length) {
			Object.keys(that.blocks).map(function(bId) {
				that.blocks[bId].pause();
			});
		}
	},
	getNextBlockTop : function() {
		var tops = {};
		for (var t = 0; t < this.canvas.offsetHeight - this.slots; t = t + Math.floor(this.canvas.offsetHeight/this.slots)) {
			tops["t" + t] = t;
		}
		if (this.blocks && Object.keys(this.blocks).length) {
			var that = this;
			Object.keys(this.blocks).map(function(bId) {
				if (that.blocks[bId].getRight() > that.canvas.offsetWidth) {
					delete tops["t"+ that.blocks[bId].top];
				}
			});
		}
		return tops[Object.keys(tops)[Math.floor(Math.random() * Object.keys(tops).length)]];
	},
	addBlock : function(blockPrize) {
//		console.log("adding block");
		var that = this;
		var finishBlock = function(block) {
			delete that.blocks[block.id];
			if (block.getPower() <= 0) {
				var prize = block.getPrize();
				if (prize) { //{power: 0, speed: 0, bomb: 0, bombPower : 0, typeAmmo: 0}
					if (prize.typeAmmo && prize.typeAmmo > 0) {
						that.robot.changeType(prize.typeAmmo);
						window.setTimeout(function() { 
							that.robot.changeType(1);
						}, 10000);
					} 
					else if (prize.speed && prize.speed > 0) {
						that.robot.speed += prize.speed;
						that.scoreSpeed.innerHTML = that.robot.speed;
					}
					else if (prize.power && prize.power > 0) {
						that.robot.shootPower += prize.power;
						that.scorePower.innerHTML = that.robot.shootPower;
					}
					else if (prize.bomb && prize.bomb > 0) {
						that.robot.bombs += prize.bomb;
						that.scoreBombs.innerHTML = that.robot.bombs;
					}
					else if (prize.bombPower && prize.bombPower > 0) {
						that.robot.bombPower += prize.bombPower;
						that.scoreBombPower.innerHTML = that.robot.bombPower;
					}
				}
				that.scorePoints.innerHTML = parseInt(that.scorePoints.innerText, 10) + block.getInitialPower();
			}
		}
		var block = new blockr({
			canvas : that.canvas,
			gameFncs : { finishBlock, finishBlock },
			speed : that.speed,
			power : Math.floor((Math.random() * (that.robot.getShootPower() * 20)) + 1),
			height : Math.floor(that.canvas.offsetHeight/that.slots),
			width : Math.floor(that.canvas.offsetHeight/that.slots),
			left : that.canvas.offsetWidth + 1,
			top : that.getNextBlockTop(),
			maxPower : that.robot.getShootPower() * 20,
			prize : blockPrize
		});
		this.blocks[block.id] = block;
	},
	cicles : function() {
		
		var that = this;
		var n = Math.floor((Math.random() * 100) + 1);

		if (n < 3) { //prize speed
			this.addBlock({power: 0, speed: 1, bomb: 0, typeAmmo: 0, bombPower : 0});

		} else if (n < 5) { // prize power
			this.addBlock({power: 1, speed: 0, bomb: 0, typeAmmo: 0, bombPower : 0});

		} else if (n < 7) { // prize power
			this.addBlock({power: 0, speed: 0, bomb: 1, typeAmmo: 0, bombPower : 0});

		} else if (n < 10) { //wall
			for (var i = 0; i < this.slots; i++) {
				this.addBlock();
			}
		} else if (n < 11) { //TypeAmmo
			this.addBlock({power: 0, speed: 0, bomb: 0, typeAmmo: Math.floor((Math.random() * 3) + 1), bombPower : 0});
			
		} else if (n < 13) { // prize bombpower
			this.addBlock({power: 0, speed: 0, bomb: 0, typeAmmo: 0, bombPower : this.robot.shootPower});
		
		} else if (n < 25 + this.robot.bombPower + this.robot.shootPower + this.robot.speed) { //block
			this.addBlock();
			
		} else { //nothing
//			console.log(n);
		}
	},
	checkHits : function() {
		var that = this;
		if (this.bullets && Object.keys(this.bullets).length) {
			Object.keys(this.bullets).map(function(bId) {
				try {
					that.bullets[bId].hit(that.blocks);
				} catch(err) {}
			});
		}
		if (this.blocks && Object.keys(this.blocks).length) {
			Object.keys(this.blocks).map(function(bId) {
				var block = that.blocks[bId];
				try {
					that.robot.hit(block);
					block.hit(0);
				} catch(err) {}
			});
		}
	}
}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); 
    script.src = url; 
    document.head.appendChild(script);
}

window.JSGame = new game();
