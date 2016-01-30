package com.medical;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;





import com.util.Baseservice;
import com.util.Jsoperation;
import com.util.ServiceForAccount;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

public class MyinfoActivity extends Activity {

	private WebView webView = null;
	private TextView titleView = null;
	private Jsoperation client=null;
	private static MyinfoActivity act=null;
	private final String IMAGE_TYPE = "image/*";
	private final int IMAGE_CODE = 0;   //这里的IMAGE_CODE是自己任意定义的
	private final int CHOOSE_INFO=1;  //回调人员选择
	private  ServiceForAccount account=null;
	private int result;
	private String actionName=null;
	String picturePath;
	String picPath;
	String filename;
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		act=this;
		setContentView(R.layout.webmyinfo);
		webView = (WebView) findViewById(R.id.toutput);
		client=new Jsoperation(this,webView);
		init();
		String url = getIntent().getStringExtra("url");
		open(url);
	}
	
	private void open(String url){
		int index=0;
		if((index=url.indexOf('?'))>0){
			client.setParm(url.substring(index));
			webView.loadUrl(url.substring(0,index));
		}else{
			webView.loadUrl(url);
		}
	}
	
	public static void refresh(){
		try{
			act.webView.reload();
		}catch(Exception e){
			
		}
	}

	private void init() {
		titleView = (TextView) this.findViewById(R.id.title);
		this.findViewById(R.id.back).setOnClickListener(cl);
		this.findViewById(R.id.edit).setOnClickListener(cl);
		initWebView();
		account= new ServiceForAccount(this);
	}

	private OnClickListener cl = new OnClickListener() {
		@Override
		public void onClick(View v) {
			if (v.getId() == R.id.back) {
				goBack();
			} else if(v.getId()==R.id.edit){
				//先提示再退出
			  webView.loadUrl("file:///android_asset/html/gerenedit.html");
			}
		}
	};

	private void initWebView() {
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setSaveFormData(false);
		webSettings.setSavePassword(false);
		webSettings.setSupportZoom(false);
		webSettings.setAppCacheEnabled(true);
		webView.addJavascriptInterface(client, "client");
		/* 获取标题 */
		webView.setWebChromeClient(new WebChromeClient() {
			@Override
			public void onReceivedTitle(WebView view, String title) {
				super.onReceivedTitle(view, title);
				titleView.setText(title);
			}
			
			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				// TODO Auto-generated method stub
				super.onProgressChanged(view, newProgress);
				if(newProgress==100)
					webView.loadUrl("javascript:addNativeOK()");
			}
			
		});
		
		
		
		/** 设置在同一webview加载 */
		webView.setWebViewClient(new WebViewClient() {
			public boolean shouldOverrideUrlLoading(WebView view, String url) { // 重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
 
		         if(url.indexOf(".jpg")!=-1 || url.indexOf(".jpeg")!=-1 || url.indexOf(".png")!=-1 || url.indexOf(".bmp")!=-1 || url.indexOf(".gif")!=-1)
		         {
		              Uri uri = Uri.parse(url); //url为你要链接的地址  
		    		  
		              Intent intent =new Intent(Intent.ACTION_VIEW, uri);  
		              intent.setDataAndType(uri, "image/*");
		              startActivity(intent);   
		         }
		         else  view.loadUrl(url);
 
				return true;
			}

		});
		/** 取消选择文字功能 */
		webView.setOnLongClickListener(new WebView.OnLongClickListener() {
			@Override
			public boolean onLongClick(View v) {
				return true;
			}
		});
		webView.setDownloadListener(new DownloadListener(){
			@Override
			public void onDownloadStart(String url, String userAgent, String contentDisposition,
					String mimetype, long contentLength) {
				Uri uri = Uri.parse(url);  
				Intent intent = new Intent(Intent.ACTION_VIEW, uri);  
				startActivity(intent);
			}
		});
		
	}

	
//	/** 
//     * 这个函数是用来处理 当进行goBack的时候 使用前一个页面的缓存 避免每次都从新载入 
//     * @param webSettings webView的settings 
//     */  
//    protected void setPageCacheCapacity(WebSettings webSettings) {  
//        try {  
//            Class<?> c = Class.forName("android.webkit.WebSettingsClassic");  
//  
//            Method tt = c.getMethod("setPageCacheCapacity", new Class[] { int.class });  
//  
//            tt.invoke(webSettings, 5);  
//  
//        } catch (ClassNotFoundException e) {  
//            System.out.println("No such class: " + e);  
//        } catch (NoSuchMethodException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (IllegalArgumentException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (IllegalAccessException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (InvocationTargetException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        }  
//    }
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			goBack();
			return true;
		} else {
			return super.onKeyDown(keyCode, event);
		}
	}

	public void goBack() {
		//先判断本页面后退
		if("1".equals(client.getParm())){
			webView.loadUrl("javascript:goBack();");
		}else{
			if (webView.canGoBack()) {
				webView.goBack(); // 后退
				//webView.reload();
			} else {
				finish();
				overridePendingTransition(R.anim.right_in, R.anim.left_out);
			}
		}
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (resultCode != RESULT_OK) {        //此处的 RESULT_OK 是系统自定义得一个常量
	        return;
	    }
	    //此处的用于判断接收的Activity是不是你想要的那个
	    if (requestCode == IMAGE_CODE) {
	    	  // Uri selectedImage = data.getData();
//	    	   String[] filePathColumns={MediaStore.Images.Media.DATA};
//	    	   Cursor c = this.getContentResolver().query(selectedImage, filePathColumns, null,null, null);
//	    	   c.moveToFirst();
//	    	   int columnIndex = c.getColumnIndex(filePathColumns[0]);
//	    	   picturePath= c.getString(columnIndex);
//	    	   c.close();
	    	   
	    }
	    
	    if(requestCode==CHOOSE_INFO)
	    {
	        Bundle buddle = data.getExtras();   
	        String info = buddle.getString("info");   
	        webView.loadUrl("javascript:refreshInfo('"+info+"')");
	    }
	}



	public void showMsg(String str) {
		Toast.makeText(this,str, Toast.LENGTH_SHORT).show();
	}
	
	public void showPhotoSheet(String actName) {
		actionName = actName;
		Intent intent=new Intent(Intent.ACTION_GET_CONTENT);
		intent.addCategory(Intent.CATEGORY_OPENABLE); 
	    intent.setType(IMAGE_TYPE);
        //Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);  
	    startActivityForResult(intent, IMAGE_CODE);
	}
    
	public void chooseInfo(String url){
		Intent intent = new Intent();
		intent.setClass(this, MyinfoActivity.class);
		intent.putExtra("url", "file:///android_asset/html/"+url);
		startActivityForResult(intent, CHOOSE_INFO);
	}
	
   public void refreshInfo(String info_json){
       Intent intent = new Intent(this, MyinfoActivity.class);   
       intent.putExtra("info", info_json);
       setResult(RESULT_OK, intent);  
       this.finish(); 
   }
   
	public void saveGlobalInfo(String key,String value){
		account.saveKeyValue(key, value);
	}
	
	public String readGlobalInfo(String key){
		
		return account.getValueByKey(key);
	}
	
	public void saveNotGlobalInfo(String key,String value)
	{
		Baseservice.account_map.put(key, value);
	}
	public String readNotGlobalInfo(String key){
		return Baseservice.account_map.get(key);
	}
}
