package com.jzcodes.jsgame.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class GameController {
	
	
	@RequestMapping("/")
	public String index() {
		return "index.html";
	}

	
	@RequestMapping("/game")
	public String goGame() {
		return "game.html";
	}
	
}
