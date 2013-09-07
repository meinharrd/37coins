package com._37coins;

import java.util.Locale;

import com._37coins.MessageProcessor.Action;

public class Tag {
	
	public Tag(Action cmd, Locale lng){
		this.cmd = cmd;
		this.lng = lng;
	}
	
	private Action cmd;
	private Locale lng;
	
	public Action getAction(){
		return cmd;
	}
	
	public Locale getLocale(){
		return lng;
	}

}