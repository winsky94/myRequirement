package com.medical;




import android.app.Application;
import android.app.Service;
import android.os.Vibrator;
import android.util.Log;
import android.widget.TextView;

public class LocationApplication extends Application {

	
	@Override
	public void onCreate() {
		super.onCreate();
		//mVibrator =(Vibrator)getApplicationContext().getSystemService(Service.VIBRATOR_SERVICE);
		Log.i("ceshi","应用开始");
		
		//push
		

	}

	
	
//	public void logMsg(String str) {
//		try {
//			if (mLocationResult != null)
//				mLocationResult.setText(str);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
}
