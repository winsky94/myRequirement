package com.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;


import android.content.Context;
import android.os.Environment;
import android.util.Log;

public class Baseservice {
//	public final static String ServerPath = "tech.zhetian.net";
//	public final static String ServerPath = "192.168.1.130:8080";
//	public final static String ServerPath = "192.168.1.29:88";
	public final static String ServerPath = "26.ztoas.com:88";
	public final static String WebPath = "/mp";
	public final static String ApkVerUrl = "http://" + ServerPath
			+ "/app/mlm/zhuanzhuan.ver";
	public final static String ApkUrl = "http://" + ServerPath
	+ "/app/mlm/zhuanzhuan.apk";
	//public final static String Apktest = "http://" + ServerPath
	//		+ "/app/mlm/shaixuaninfo.txt";	
	
	//public final static String OAPath = "http://" + ServerPath + "/oa/App";
	
	public static HashMap<String,String> account_map=new HashMap<String, String>();
	private static String imagePath=null;
	
	public static class UpdateInfo {
		public int code;
		public String name;

		public int getCode() {
			return code;
		}

		public void setCode(int code) {
			this.code = code;
		}
	};
	
	public static UpdateInfo getUpdateInfo() {
		UpdateInfo info = new UpdateInfo();
		try {
			String result = NetworkTool.getContent(ApkVerUrl);
			JSONObject objMap = new JSONObject(result);
			info.code = objMap.getInt("code");
			info.name = objMap.getString("name");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return info;
	}
	
	public static String getImagePath(Context context) {
		if (imagePath == null) {
			if (Environment.getExternalStorageState().equals(
					Environment.MEDIA_MOUNTED)) {
				// 判断sd卡是否存在
				File sdDir = Environment.getExternalStorageDirectory();// 获取跟目录
				File file = new File(sdDir.getAbsolutePath() + "/med");
				if (file.isDirectory()) {
					imagePath = file.getAbsolutePath();
				} else {
					if (file.mkdirs()) {
						imagePath = file.getAbsolutePath();
					} else {
						imagePath = context.getFilesDir()
								.getAbsolutePath();
					}
				}
			} else {
				imagePath = context.getFilesDir().getAbsolutePath();
			}
		}
		return imagePath;
	}
	
	public static String login(String user, String pwd,Context context) {
		try {
			Log.i("ceshi", "dedao2");
			String result = NetworkTool
					.getContent("http://"+ServerPath+"/shake_bill/app/ShakeBill!login.action?uname="+user+"&password="+pwd);
			Log.i("ceshi", "dedao"+result);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "error";
	}

//    public static ArrayList<HashMap<String, Object>> GetShaixuanList(){
//    	ArrayList<HashMap<String,Object>> buf = null;
//    	
//    	try {
//			String result =NetworkTool.getContent(Apktest);
//			buf = new ArrayList<HashMap<String, Object>>();
//			JSONArray ar = new JSONArray(result);
//			for(int i=0;i<ar.length();i++)
//			{   JSONObject ob = ar.getJSONObject(i);
//			    HashMap<String, Object> obj1  =new HashMap<String, Object>();
//			    String dalei = ob.getString("name");
//			    JSONArray ar1 = ob.getJSONArray("childname");
//			    ArrayList<String> buf1 = new ArrayList<String>();
//			    for(int j=0;j<ar1.length();j++)
//			    {
//			    	buf1.add(ar1.getString(j));	
//			    }
//			    obj1.put("type",dalei);
//			    obj1.put("type1",buf1);
//			    buf.add(obj1);
//			}
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//
//		}
//    	System.out.println(buf);
//    	return buf;
//    }
	
	public static String uploadPic(String picturePath) {
		FileUpload up = new FileUpload();
		try {
				return up.send("http://"+Baseservice.ServerPath+Baseservice.WebPath+"/app/MedicalPlatform!upload.action",
						picturePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
