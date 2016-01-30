// +----------------------------------------------------------------------
// | ZYSOFT [ MAKE IT OPEN ]
// +----------------------------------------------------------------------
// | Copyright (c) 20015 NJPT All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zy_cwind <391321232@qq.com>
// +----------------------------------------------------------------------

/**
 * 构造函数
 * 转盘的半径根据 canvas 自动调整
 *
 * @param d 初始化参数
 *        d.color 栏目文字颜色
 *        d.font 栏目字体
 *        d.p 指针图片
 *        d.background 背景图片
 *        d.items 栏目
 *        d.speed 转动的速度
 *        d.padding 绘制原盘时的边距
 *
 */
Turntable = function(d) {
    // 绘制参数
    this.mContext= d.canvas.getContext("2d");
    this.mRadius = Math.min(d.canvas.width,d.canvas.height) / 2;
    this.mDiv    = d.items.length;
    this.mItems  = d.items;
    this.mPadding= d.padding || 0;
    this.mColor  = d.color || "#F00";
    this.mFont   = d.font  || "16px sans-serif";
    this.mT      = 0;
    // 加载图片
    this.mBackground=new  Image();
    this.mBackground.src = d.background;
    this.mP=new Image();
    this.mP.src = d.p;
    // 运动参数
    this.mAngle = 0;
    this.mState = 0;
    this.mSpeed = d.speed || Math.PI/25;
    this.mIndex = 0;
    this.mN     = 0;
    this.mIntId =setInterval(function(thiz) {thiz.step.call(thiz);},  40,this);
    // 状态回调
    this.mOnFinish = {"l":function(){}};
}

/**
 * 转盘色表
 *
 */
Turntable.glColor  = ["#FDE7BB", "#FFA200"];

/**
 * 开始转动
 * 在点击事件中设置状态为开始转动
 *
 */
Turntable.prototype.exec =function() {
    if (!this.mState)
        return this.mState = 1;
}

/**
 * 设置结果
 * 在获取到服务器返回的结果时设置
 *
 * @param index 转盘上栏目的序号
 * @param thiz 调用者指针，回调时会修改 this 指针为调用者
 * @param listener 回调函数无参数
 *
 */
Turntable.prototype.resp =function(index, thiz, listener) {
    if (this.mState ==1) {
        this.mIndex = index;
        this.mOnFinish= {"t" :thiz, "l" : listener};
        this.mState = 2;
    }
}

/**
 * 在当前角度绘制转盘
 *
 */
Turntable.prototype.draw =function() {
    // 绘制背景
    this.mContext.clearRect(0, 0,2*this.mRadius,2*this.mRadius);
    this.mContext.drawImage(this.mBackground,this.mT<4? 0:this.mBackground.width/2, 0,this.mBackground.width  / 2,this.mBackground.height, 0,0,2*this.mRadius,2*this.mRadius);
    // 绘制转盘
    this.mContext.save();
    this.mContext.translate(this.mRadius, this.mRadius);
    this.mContext.rotate(this.mAngle);
    {
        var dg = 2*Math.PI/ this.mDiv;
        for (var i = 0; i < this.mDiv; i++) {
            this.mContext.beginPath();
            this.mContext.moveTo(0,0);
            this.mContext.lineTo(0,-this.mRadius + this.mPadding);
            this.mContext.arc(0, 0, this.mRadius - this.mPadding,-Math.PI / 2,  -Math.PI  /2 +dg,false);
            this.mContext.lineTo(0,0);
            this.mContext.closePath();
            this.mContext.fillStyle = Turntable.glColor[i % Turntable.glColor.length];
            this.mContext.fill();
            // 绘制栏目
            {
                this.mContext.save();
                this.mContext.rotate(dg/2);
                this.mContext.translate(0 ,-3*this.mRadius/4);
                this.mContext.textBaseline="top";
                this.mContext.textAlign=   "center";
                this.mContext.font =this.mFont;
                this.mContext.fillStyle=this.mColor;
                this.mContext.fillText(this.mItems[i], 0, 0);
                this.mContext.restore();
            }
            this.mContext.rotate(-dg);
        }
    }
    this.mContext.restore();
    // 绘制指针
    this.mContext.drawImage(this.mP, 0,0,this.mP.width,this.mP.height,0,0,2*this.mRadius,2*this.mRadius);
}

/**
 * 请求未完成时匀速转动，否则匀速到目标项目，速度递减至0，转动1圈
 *
 */
Turntable.prototype.step =function() {
    switch( this.mState) {
    case 2:
    {
        var t =(this.mIndex- 0.5)  * 360 /this.mDiv;
        if( Math.abs((parseInt(this.mAngle*180/Math.PI) % 360) - (t < 0? t +360 :  t))*Math.PI/180<=this.mSpeed) {
            this.mState  =3;
            break;
        }
    }
    case 1:
        // 旋转
        this.mAngle+=this.mSpeed;
        this.mT=++this.mT%9;
        break;
    case 3:
        // 减速;
        if (this.mN <4*Math.PI/this.mSpeed) {
            this.mAngle+= this.mSpeed - this.mN++ * this.mSpeed* this.mSpeed/ (4* Math.PI  - this.mSpeed);
            this.mT++;
            this.mT%=9;
        } else {
            this.mState  =0;
            this.mN =0;
            this.mOnFinish.l.call(this.mOnFinish.t);
        }
        break;
    }
    this.draw();
}
