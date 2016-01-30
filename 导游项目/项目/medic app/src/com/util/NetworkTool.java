package com.util;


import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;

public class NetworkTool {

	/**
	* 获取网址内容
	* @param url
	* @return
	* @throws Exception
	*/
	public static String getContent(String url) throws Exception{
	    StringBuilder sb = new StringBuilder();
	    
	    HttpClient client = new DefaultHttpClient();
	    HttpParams httpParams = client.getParams();
	    //设置网络超时参数
	    HttpConnectionParams.setConnectionTimeout(httpParams, 3000);
	    HttpConnectionParams.setSoTimeout(httpParams, 5000);
	    HttpResponse response = client.execute(new HttpGet(url));
	    HttpEntity entity = response.getEntity();
	    if (entity != null) {
	        BufferedReader reader = new BufferedReader(new InputStreamReader(entity.getContent(), "UTF-8"), 8192);
	        String line = null;
	        while ((line = reader.readLine())!= null){
	            sb.append(line + "\n");
	        }
	        reader.close();
	    }
	    return sb.toString();
	}
	
	public static String sendPostRequest(String http,String content) throws Exception {
		URL url = new URL(http);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        OutputStream output = conn.getOutputStream();
        output.write(content.getBytes());
        output.flush();
        output.close();
        BufferedReader reader = new BufferedReader(new InputStreamReader(conn
                .getInputStream(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine())!= null){
            sb.append(line + "\n");
        }
        reader.close();
        return sb.toString();
    }

	   public static InputStream getXML(String path){
		   InputStream in=null;
		   try {
			  URL url = new URL(path);
			  if(url!=null)
			  {
				  HttpURLConnection conn = (HttpURLConnection)url.openConnection();
				  conn.setConnectTimeout(3000);
				  conn.setDoInput(true);
				  conn.setRequestMethod("GET");
				  int code = conn.getResponseCode();
				  if(code==200)
				  {
					  in = conn.getInputStream();
				  }
			  }
		} catch (Exception e) {
			// TODO: handle exception
		}
		   return in;
	   }
}
