
				当initial-scale=1时ie不会随屏幕旋转而变换 所以需要加上width=device-width
<meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1, user-scable=no">
				理想视口	移动端上布局视口视觉视口不一样，所以禁止缩放


TB做法
根据设计稿设置html的FS后，设计稿元素尺寸除以根FS;
WY做法
根据设计稿设置html的FS后，设计稿元素尺寸除以100;