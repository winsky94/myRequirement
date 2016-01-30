package com.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class MyHandler extends DefaultHandler {
  private HashMap<String, String> map=null;  //存储单个解析的完整对象
  private List<HashMap<String,String>> list = null; //存储所有对象
  private String currentTagString = null;//正在解析的元素的标签
  private String currentValue =null;//当前元素的值
  private String nodeName =null;//当前节点的名称
	
	public List<HashMap<String, String>> getList() {
	return list;
}


	public MyHandler(String nodeName) {
		// TODO Auto-generated constructor stub
		this.nodeName=nodeName;
	}

	@Override
	public void startDocument() throws SAXException {
		// TODO Auto-generated method stub
		//当读到第一个标签的时候会触发这个方法
		list=new ArrayList<HashMap<String,String>>();

	}

	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes attributes) throws SAXException {
		// TODO Auto-generated method stub
		//当遇到文档开头的时候调用这个方法
		if(qName.equals(nodeName)){
			map= new HashMap<String, String>();
		}
		if(attributes!=null&&map!=null){
			for(int i=0;i<attributes.getLength();i++)
			{
				map.put(attributes.getQName(i), attributes.getValue(i));
			}
		}
		currentTagString=qName;
	}

	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		// TODO Auto-generated method stub
		//这个方法是用来处理文件所读取到的内容
		if(currentTagString!=null&&map!=null)
		{
			currentValue=new String(ch, start, length);
			if(currentValue!=null&&!currentValue.trim().equals("")&&!currentValue.trim().equals("\n"))
			{
				map.put(currentTagString, currentValue);
			}
		}
		currentTagString=null;//把当前节点对应的值和标签设置为空
		currentValue=null;
	}

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		// TODO Auto-generated method stub
		//遇到结束标记的时候会调用这个方法
		if(qName.equals(localName))
		{
			list.add(map);
			map=null;
		}
		super.endElement(uri, localName, qName);
	}
    
}
