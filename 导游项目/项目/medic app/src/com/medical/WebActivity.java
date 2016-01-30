package com.medical;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;









import com.util.Baseservice;
import com.util.Jsoperation;
import com.util.ServiceForAccount;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
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

public class WebActivity extends Activity {

	private WebView webView = null;
	private TextView titleView = null;
	private Jsoperation client=null;
	private static WebActivity act=null;
	private final String IMAGE_TYPE = "image/*";
	private final int IMAGE_CODE = 0;   //这里的IMAGE_CODE是自己任意定义的
	private final int CHOOSE_INFO=1;  //回调人员选择
	private final int UPLOAD_IMAGE=2; //上传图片
	private  ServiceForAccount account=null;
	private int result;
	private String result1;
	private String actionName=null;
	String picturePath;
	String picPath;
	public String filename;
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		act=this;
		setContentView(R.layout.web);
		webView = (WebView) findViewById(R.id.toutput);
		client=new Jsoperation(this,webView);
		init();
		String url = getIntent().getStringExtra("url");
		open(url);
	}
	
	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		webView.loadUrl("javascript:MyRefresh();");
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
		this.findViewById(R.id.home).setOnClickListener(cl);
		initWebView();
		account= new ServiceForAccount(this);
	}

	private OnClickListener cl = new OnClickListener() {
		@Override
		public void onClick(View v) {
			if (v.getId() == R.id.back) {
				goBack();
			} else if(v.getId()==R.id.home){
				//先提示再退出
				Intent intent = new Intent();  
				intent.setClass(WebActivity.this, WebviewActivity.class);  
				intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);//设置不要刷新将要跳到的界面  
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);//它可以关掉所要到的界面中间的activity  
				startActivity(intent);
				overridePendingTransition(R.anim.right_in, R.anim.left_out);
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
		    		  
//		              Intent intent =new Intent(Intent.ACTION_VIEW, uri);  
//		              intent.setDataAndType(uri, "image/*");
//		              startActivity(intent);   
		              
					Intent intent = new Intent(Intent.ACTION_VIEW, uri);  
			        intent.setData(uri);
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
	    
	    if(requestCode==UPLOAD_IMAGE)
	    {
	    	super.onActivityResult(requestCode, resultCode, data);
			if (resultCode == Activity.RESULT_OK) {
//				String fileName = Baseservice.getImagePath(WebActivity.this)
//						+"/"+ new Date().getTime() + ".jpg";
//				this.filename = fileName;
//				Bundle bundle = data.getExtras();
				
				//压缩图像
				Bitmap bitmap = getBitmapFromUrl(filename,547,754); 
				FileOutputStream b = null;
				try {
					b = new FileOutputStream(filename);
					bitmap.compress(Bitmap.CompressFormat.JPEG, 100, b);// 把数据写入文件
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				} finally {
					try {
						b.flush();
						b.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			
				uploadImg();
			}
	    }
	}
	
    /** 
     * 根据路径获取图片资源（已缩放） 
     * @param url 图片存储路径 
     * @param width 缩放的宽度 
     * @param height 缩放的高度 
     * @return 
     */  
    private Bitmap getBitmapFromUrl(String url, double width, double height) {  
        BitmapFactory.Options options = new BitmapFactory.Options();  
        options.inJustDecodeBounds = true; // 设置了此属性一定要记得将值设置为false  
        Bitmap bitmap = BitmapFactory.decodeFile(url);  
        // 防止OOM发生  
        options.inJustDecodeBounds = false;  
        int mWidth = bitmap.getWidth();  
        int mHeight = bitmap.getHeight();  
        Matrix matrix = new Matrix();  
        float scaleWidth = 1;  
        float scaleHeight = 1;  
//        try {  
//            ExifInterface exif = new ExifInterface(url);  
//            String model = exif.getAttribute(ExifInterface.TAG_ORIENTATION);  
//        } catch (IOException e) {  
//            e.printStackTrace();  
//        }  
        // 按照固定宽高进行缩放  
        // 这里希望知道照片是横屏拍摄还是竖屏拍摄  
        // 因为两种方式宽高不同，缩放效果就会不同  
        // 这里用了比较笨的方式  
        if(mWidth <= mHeight) {  
            scaleWidth = (float) (width/mWidth);  
            scaleHeight = (float) (height/mHeight);  
        } else {  
            scaleWidth = (float) (height/mWidth);  
            scaleHeight = (float) (width/mHeight);  
        }  
//        matrix.postRotate(90); /* 翻转90度 */  
        // 按照固定大小对图片进行缩放  
        matrix.postScale(scaleWidth, scaleHeight);  
        Bitmap newBitmap = Bitmap.createBitmap(bitmap, 0, 0, mWidth, mHeight, matrix, true);  
        // 用完了记得回收  
        bitmap.recycle();  
        return newBitmap;  
    } 
	

	private void uploadImg() {
		new Thread(){
			
			public void run(){
				Log.i("ceshi","小亨上传:"+filename);
				result1=Baseservice.uploadPic(filename);
				if(result1==null)
				{
					handler.sendMessage(handler.obtainMessage(0));
				}
				else
				{
					handler.sendMessage(handler.obtainMessage(1));
				}

			}
		}.start();
	}
	
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {

			OnResult(msg.what);

			//OnRefresh();
		}
	};
	
	private void OnResult(int flag){
		if(flag==0)
		{
			Toast.makeText(this,"上传失败", Toast.LENGTH_SHORT).show();
			webView.loadUrl("javascript:OnScreenResult('-1')");
		}
		else if(flag==1)
		{
			Toast.makeText(this,"上传成功", Toast.LENGTH_SHORT).show();
			webView.loadUrl("javascript:OnScreenResult('"+result1+"')");
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
		intent.setClass(this, WebActivity.class);
		intent.putExtra("url", "file:///android_asset/html/"+url);
		startActivityForResult(intent, CHOOSE_INFO);
	}
	
   public void refreshInfo(String info_json){
       Intent intent = new Intent(this, WebActivity.class);   
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
