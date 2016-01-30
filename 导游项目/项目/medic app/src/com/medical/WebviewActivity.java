package com.medical;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.medical.R;
import com.util.Baseservice;
import com.util.FileUpload;
import com.util.Jsoperation;
import com.util.ServiceForAccount;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class WebviewActivity extends Activity {

	   private WebView webview;
		private Jsoperation client=null;
		private ServiceForAccount account = null;
		private String NowHtml = null; //用来标记打开哪个页面
		public String path=null; //拍摄后的存储位置
		private String result = null; //上传图片后回调的;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			// TODO Auto-generated method stub
			super.onCreate(savedInstanceState);
			setContentView(R.layout.webview);
			init();
			setNowHtml("index.html");
			webview.loadUrl("file:///android_asset/html/index.html");
		}
	    
		public String getNowHtml() {
			return NowHtml;
		}

		public void setNowHtml(String nowHtml) {
			NowHtml = nowHtml;
//			Toast.makeText(this, nowHtml, Toast.LENGTH_LONG).show();
		}

		private void init() {
			account = new ServiceForAccount(this);
			webview = (WebView) findViewById(R.id.toutput);
			client = new Jsoperation(this,webview);
			initWebView();
		}

		private void initWebView() {
			WebSettings webSettings = webview.getSettings();
			webSettings.setJavaScriptEnabled(true);
			webSettings.setSaveFormData(false);
			webSettings.setSavePassword(false);
			webSettings.setSupportZoom(false);
			webSettings.setAppCacheEnabled(true);
			webview.addJavascriptInterface(client, "client");
			/* ��ȡ���� */
			webview.setWebChromeClient(new WebChromeClient() {
				@Override
				public void onReceivedTitle(WebView view, String title) {
					super.onReceivedTitle(view, title);
					//titleView.setText(title);
				}
				@Override
				public void onProgressChanged(WebView view, int newProgress) {
					// TODO Auto-generated method stub
					super.onProgressChanged(view, newProgress);
					if(newProgress==100)
						webview.loadUrl("javascript:addNativeOK()");
				}
				
			});
			
			
			
			
			webview.setWebViewClient(new WebViewClient() {
				public boolean shouldOverrideUrlLoading(WebView view, String url) { // ��д�˷������������ҳ��������ӻ����ڵ�ǰ��webview����ת������������Ǳ�
			         if(url.indexOf(".jpg")!=-1 || url.indexOf(".jpeg")!=-1 || url.indexOf(".png")!=-1 || url.indexOf(".bmp")!=-1 || url.indexOf(".gif")!=-1
			        		 ||url.indexOf(".JPG")!=-1 || url.indexOf(".JPEG")!=-1 || url.indexOf(".PNG")!=-1 || url.indexOf(".BMP")!=-1 || url.indexOf(".GIF")!=-1)
			         {
			              Uri uri = Uri.parse(url); //url为你要链接的地址  
			    		  
//			              Intent intent =new Intent(Intent.ACTION_VIEW, uri);  
//			              intent.setDataAndType(uri, "image/*");
//			              startActivity(intent);   
			              
						Intent intent = new Intent(Intent.ACTION_VIEW, uri);  
				        intent.setData(uri);
				        startActivity(intent);  
			         }
			         else  view.loadUrl(url);
	 

					return true;
				}
			});
			
			webview.setOnLongClickListener(new WebView.OnLongClickListener() {
				@Override
				public boolean onLongClick(View v) {
					return true;
				}
			});
			webview.setDownloadListener(new DownloadListener(){
				@Override
				public void onDownloadStart(String url, String userAgent, String contentDisposition,
						String mimetype, long contentLength) {
					Uri uri = Uri.parse(url);  
					Intent intent = new Intent(Intent.ACTION_VIEW, uri);  
					startActivity(intent);
				}
			});
		}
		
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
				webview.loadUrl("javascript:goBack();");
			}else{
				
				if(NowHtml.equals("index.html"))
				{
					finish();
					overridePendingTransition(R.anim.right_in, R.anim.left_out);
				}
				else
				{
					if (webview.canGoBack()) {
						webview.goBack(); // 后退
						//webView.reload();
					} else {
						finish();
						overridePendingTransition(R.anim.right_in, R.anim.left_out);
					}
				}

			}
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
		
		private Handler handler = new Handler() {
			@Override
			public void handleMessage(Message msg) {

				OnResult(msg.what);
	
				//OnRefresh();
			}
		};
		
		@Override
		protected void onActivityResult(int requestCode, int resultCode, Intent data) {
			super.onActivityResult(requestCode, resultCode, data);
			if (resultCode == Activity.RESULT_OK) {
//				String fileName = Baseservice.getImagePath(WebviewActivity.this)
//						+"/"+ new Date().getTime() + ".jpg";
//				this.path = fileName;
//				Bundle bundle = data.getExtras();
				//压缩图像
				Bitmap bitmap = getBitmapFromUrl(path,547,754); 
				FileOutputStream b = null;
				try {
					b = new FileOutputStream(path);
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
//	        try {  
//	            ExifInterface exif = new ExifInterface(url);  
//	            String model = exif.getAttribute(ExifInterface.TAG_ORIENTATION);  
//	        } catch (IOException e) {  
//	            e.printStackTrace();  
//	        }  
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
//	        matrix.postRotate(90); /* 翻转90度 */  
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
					Log.i("ceshi","小亨上传:"+path);
					result=Baseservice.uploadPic(path);
					if(result==null)
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
		
		public void showMsg(String str) {
			Toast.makeText(this,str, Toast.LENGTH_SHORT).show();
		}
		
		private void OnResult(int flag){
			if(flag==0)
			{
				Toast.makeText(this,"上传失败", Toast.LENGTH_SHORT).show();
				webview.loadUrl("javascript:OnScreenResult('-1')");
			}
			else if(flag==1)
			{
				Toast.makeText(this,"上传成功", Toast.LENGTH_SHORT).show();
				webview.loadUrl("javascript:OnScreenResult('"+result+"')");
			}
			
		}
}
