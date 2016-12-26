#移动端布局参考
* <a href="https://github.com/imochen/hotcss">hotcss</a>
* <a href="https://github.com/amfe/lib-flexible">lib-flexible</a>

##淘宝做法
根据设计稿设置html的FontSize后，设计稿元素尺寸除以根FontSize;
##网易做法
根据设计稿设置html的FontSize后，设计稿元素尺寸除以100;

当initial-scale=1时ie不会随屏幕旋转而变换 所以需要加上width=device-width
`<meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1, user-scable=no"/>`
