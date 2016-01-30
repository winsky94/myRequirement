package com.util;







import java.io.File;
import java.util.Date;

import com.medical.MyinfoActivity;
import com.medical.R;
import com.medical.WebActivity;
import com.medical.WebviewActivity;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class Jsoperation {
   
	private Context context = null;
	private WebView webView = null;
	private String parm = null;
	private ProgressDialog progressDialog = null;
	private Dialog loginDialog;
	private String method;
   
	
	public Jsoperation(Context context) {
		this.context = context;
	}
	
	public Jsoperation(Context context, WebView webView) {
		this.context = context;
		this.webView = webView;
	}

	public void setParm(String parm) {
		this.parm = parm;
	}

	public String getParm() {
		return parm;
	}
	

	public void showmsg(String content){
		Toast.makeText(context, content, Toast.LENGTH_SHORT).show();
	}

	/**
	 * 
	 * @param type
	 *            ;Show,Dismiss,Success,Error
	 * @param msg
	 *            :提示信息
	 * @param method
	 *            :回调函数
	 */
	public void progress(String type, String text, String method) {
		if ("Show".equals(type)) {
			progressDialog = ProgressDialog.show(context, null, null, true,
					true);
		} else {
			if (progressDialog != null && progressDialog.isShowing()) {
				progressDialog.dismiss();
			}
			if (!"Dismiss".equals(type)) {
				int resId = R.drawable.success;
				if ("Error".equals(type)) {
					resId = R.drawable.error;
				}
				Toast toast = Toast.makeText(context, text, Toast.LENGTH_SHORT);
				toast.setGravity(Gravity.CENTER, 0, 0);
				LinearLayout toastView = (LinearLayout) toast.getView();
				ImageView imageCodeProject = new ImageView(context);
				imageCodeProject.setImageResource(resId);
				toastView.addView(imageCodeProject, 0);
				toast.show();
			}
		}
		if (webView != null && method != null && method.length() > 0) {
			webView.loadUrl("javascript:" + method);

		}
	}
	
	public void MyAlert(String text,String method2) {  
		  
//	    LayoutInflater inflater = LayoutInflater.from(context);  
//	    View v = inflater.inflate(R.layout.alert, null);
	    //LinearLayout layout = (LinearLayout) v.findViewById(R.id.dialog_view);
	    loginDialog = new Dialog(context, R.style.login_dialog);
	    loginDialog.setCancelable(false);
	    loginDialog.setContentView(R.layout.alert);
	   
	    TextView textview = (TextView)loginDialog.findViewById(R.id.tipTextView);
	    textview.setText(text);
	    loginDialog.show();
	    Button btn = (Button)loginDialog.findViewById(R.id.ok);
	    btn.setOnClickListener(l);
	    method = method2;
	}
//	
	private OnClickListener l = new OnClickListener() {
		
		@Override
		public void onClick(View arg0) {
			// TODO Auto-generated method stub
			loginDialog.dismiss();
			if (webView != null && method != null && method.length() > 0) {
				webView.loadUrl("javascript:" + method);

			}
		}
	};
	
//   
//	public void ChooseDialog(){
//		  final String[] arrayStyle = new String[] { "拍照上传", "本地图片" };
//
//		  Dialog alertDialog = new AlertDialog.Builder(context).
//		    setTitle("修改头像").
//		    setIcon(R.drawable.mlm)
//		    .setItems(arrayStyle, new DialogInterface.OnClickListener() {
//		 
//		     @Override
//		     public void onClick(DialogInterface dialog, int which) {
//		         switch(which)
//		         {
//		         case 0:
//		     		if (context instanceof WebActivity) {
//		    			((WebActivity) context).capture();
//		    		}
//		        	 break;
//		         case 1:
//			     		if (context instanceof WebActivity) {
//			    			((WebActivity) context).getImageClipIntent();
//			    		}
//		        	 break;
//		         }
//		     }
//		    }).
//		    create();
//		  alertDialog.show();
//	}
//	
//	public void showError(String text){
//		Toast toast = Toast.makeText(context, text, Toast.LENGTH_SHORT);
//		toast.setGravity(Gravity.CENTER, 0, 0);
//		LinearLayout toastView = (LinearLayout) toast.getView();
//		ImageView imageCodeProject = new ImageView(context);
//		imageCodeProject.setImageResource(R.drawable.error);
//		toastView.addView(imageCodeProject, 0);
//		toast.show();
//	}
//
	
	public String getIpPort() {
		String result = Baseservice.ServerPath;
		return result;
	}
	public void goBack() {
		if (context instanceof WebviewActivity) {
			((WebviewActivity) context).goBack();
		}
		else if (context instanceof WebActivity) {
			((WebActivity) context).goBack();
		}

	}
//	
//	public void gofinish(){
//		if (context instanceof WebActivity) {
//			((WebActivity) context).gofinish();
//		}
//	}
//	
	public void open(String url, int blank) {
		Log.i("ceshi","heiheihei"+url);
		String url2 = "file:///android_asset/html/" + url;
		if (blank == 0) {
			if (context instanceof WebviewActivity) {
				((WebviewActivity) context).setNowHtml(url);
				openUrl(url2);

			}
		} else if(blank == 1) {
			Intent intent = new Intent(context, WebActivity.class);
			intent.putExtra("url", url2);
			startActivity(intent);
		} else if(blank == 3) {
			Intent intent = new Intent(context, MyinfoActivity.class);
			intent.putExtra("url", url2);
			startActivity(intent);
		}
	}

	private void openUrl(String url) {
		int index = 0;
		if ((index = url.indexOf('?')) > 0) {
			setParm(url.substring(index));
			webView.loadUrl(url.substring(0, index));
		} else {		
			webView.loadUrl(url);
		}
	}



	private void startActivity(Intent intent) {
		if (context instanceof Activity) {
			Activity a = (Activity) context;
			a.startActivity(intent);
			a.overridePendingTransition(R.anim.right_in, R.anim.left_out);
		} else {
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			context.startActivity(intent);
		}
	}
	
	public void setNameAndPass(String name,String pass){
		if(context instanceof WebviewActivity)
		{
		((WebviewActivity) context).saveGlobalInfo(ServiceForAccount.KEY_USERNAME,name);
		((WebviewActivity) context).saveGlobalInfo(ServiceForAccount.KEY_PASSWORD,pass);
		}else if(context instanceof WebActivity)
		{
			((WebActivity) context).saveGlobalInfo(ServiceForAccount.KEY_USERNAME,name);
			((WebActivity) context).saveGlobalInfo(ServiceForAccount.KEY_PASSWORD,pass);	
		}else if(context instanceof MyinfoActivity)
		{
			((MyinfoActivity) context).saveGlobalInfo(ServiceForAccount.KEY_USERNAME,name);
			((MyinfoActivity) context).saveGlobalInfo(ServiceForAccount.KEY_PASSWORD,pass);	
		}
	}
	
	public void saveGlobalInfo(String key,String value){
		if(context instanceof WebviewActivity)
		{
			((WebviewActivity) context).saveGlobalInfo(key,value);
		}
		else if(context instanceof WebActivity)
		{
			((WebActivity) context).saveGlobalInfo(key,value);
		}
		else if(context instanceof MyinfoActivity)
		{
			((MyinfoActivity) context).saveGlobalInfo(key,value);
		}
	}
	public String readGlobalInfo(String key){
		
		String value = null;
		if(context instanceof WebviewActivity )
		{
			value=((WebviewActivity) context).readGlobalInfo(key);
		}
		else if(context instanceof WebActivity )
		{
			value=((WebActivity) context).readGlobalInfo(key);
		}
		else if(context instanceof MyinfoActivity )
		{
			value=((MyinfoActivity) context).readGlobalInfo(key);
		}
		
		return value;
	}
	
	public void saveNotGlobalInfo(String key,String value){
		if(context instanceof WebviewActivity)
		{
			((WebviewActivity) context).saveNotGlobalInfo(key,value);
		}
		else if(context instanceof WebActivity)
		{
			((WebActivity) context).saveNotGlobalInfo(key,value);
		}
		else if(context instanceof MyinfoActivity)
		{
			((MyinfoActivity) context).saveNotGlobalInfo(key,value);
		}
	}
	
	public String readNotGlobalInfo(String key){
		String value = null;
		if(context instanceof WebviewActivity )
		{
			value=((WebviewActivity) context).readNotGlobalInfo(key);
		}
		else if(context instanceof WebActivity )
		{
			value=((WebActivity) context).readNotGlobalInfo(key);
		}
		else if(context instanceof MyinfoActivity )
		{
			value=((MyinfoActivity) context).readNotGlobalInfo(key);
		}
		return value;
	}
	
	public void capture(){
		Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); 
		((WebviewActivity)context).path  = Baseservice.getImagePath(context)
				+"/"+ new Date().getTime() + ".jpg";
        File out = new File(((WebviewActivity)context).path);  
        Uri uri = Uri.fromFile(out);  
        // 获取拍照后未压缩的原图片，并保存在uri路径中  
        intent.putExtra(MediaStore.EXTRA_OUTPUT, uri); 		
		
		
		((WebviewActivity)context).startActivityForResult(intent, 1);
	}
	
	public void capture1(){
		Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); 
		((WebActivity)context).filename  = Baseservice.getImagePath(context)
				+"/"+ new Date().getTime() + ".jpg";
        File out = new File(((WebActivity)context).filename);  
        Uri uri = Uri.fromFile(out);  
        // 获取拍照后未压缩的原图片，并保存在uri路径中  
        intent.putExtra(MediaStore.EXTRA_OUTPUT, uri); 
		((WebActivity)context).startActivityForResult(intent, 2);
	}
//	
//	
//	public void BackRefresh(String info_json){
//		if(context instanceof WebActivity){
//			((WebActivity)context).BackRefresh(info_json);
//		}
//	}
//	
//	public void confirm(String title, String text, final String method) {
//		Dialog dialog = new AlertDialog.Builder(context)
//				.setTitle(title)
//				.setMessage(text)
//				// 设置内容
//				.setPositiveButton("确定",// 设置确定按钮
//						new DialogInterface.OnClickListener() {
//							@Override
//							public void onClick(DialogInterface dialog,
//									int which) {
//								if (webView != null) {
//									webView.loadUrl("javascript:" + method);
//								}
//							}
//						})
//				.setNegativeButton("取消", new DialogInterface.OnClickListener() {
//					public void onClick(DialogInterface dialog, int whichButton) {
//						// 点击"取消"按钮之后退出程序
//					}
//				}).create();// 创建
//		// 显示对话框
//		dialog.setCanceledOnTouchOutside(false);
//		dialog.show();
//	}
//	
////	public void Exit(){
////		if(context instanceof WebActivity)
////			((WebActivity) context).ExitApp();
////	}
////	
//   public void creatDateDialog(int Year, int month,int day,int hour,int minute,boolean flag_show_timedialg){
//		if(context instanceof WebActivity)
//			((WebActivity) context).creatDateDialog(Year, month, day,hour,minute,flag_show_timedialg);
//   }
////   
////   public void shortcut(){
////	   if(context instanceof mainActivity)
////		   ((mainActivity) context).shortcut();  
////   }
////   
////	public String getVerName() {
////		return Config.getVerName(context, InitActivity.packageName);
////	}
////   
////   public void pay(){
////	   if(context instanceof WebActivity)
////		   ((WebActivity) context).pay();  
////   }
////   
////   public void openShaixuan(){
////	   if(context instanceof Web_NoTopActivity)
////	   {
////		   ((Web_NoTopActivity) context).openSX(); 
////	   }
////   }
////   
////   public void createDateTimeDialog(int year,int month,int date,int hour,int minute){
////	   if(context instanceof WebActivity)
////		   ((WebActivity) context).createDateTimeDialog(year,month,date,hour,minute);
////   }
//  
//	public void preventParentTouchEvent(){
//		   if(context instanceof MainActivity)
//		   {
//			   ((MainActivity) context).preventParentTouchEvent();
//		   }
//	}
	
	//调用安卓软键盘，打开界面时自动弹出
	public void softInputOpen(){
		InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);  
		imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);  
	}
	
	
}
