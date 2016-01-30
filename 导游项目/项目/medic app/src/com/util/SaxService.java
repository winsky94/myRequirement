package com.util;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;


public class SaxService {

	public SaxService() {
		// TODO Auto-generated constructor stub
	}
   
	public static List<HashMap<String,String>> readXML(InputStream in,String nodeName ){
		   
		   try {
			  SAXParserFactory  factory = SAXParserFactory.newInstance();
			  SAXParser parser = factory.newSAXParser();
			  MyHandler handler = new MyHandler(nodeName);
			  parser.parse(in, handler);
			  in.close();
			  return handler.getList();
		} catch (Exception e) {
			// TODO: handle exception
		}
		   
		   return null;
	}
}
