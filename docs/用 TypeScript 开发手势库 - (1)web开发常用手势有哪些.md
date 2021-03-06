# 用typescript开发手势库 - (1)web开发常用手势有哪些?

## 这只是个开头
说在最前面,本文是一个系列文章的开头, 这个系列里我会讲如何用**typescript**开发一款支持**pc**和**手机端**的手势库[any-touch](https://github.com/383514580/any-touch), 以及通过jest让你的代码测试覆盖率100%.

![https://github.com/383514580/any-touch](https://segmentfault.com/img/bVbp3B0?w=936&h=246)

## 往期目录
[用 TypeScript 开发手势库 - (2)web开发常用手势有哪些?](https://juejin.im/post/5c939c956fb9a0710a1bc90c)

[用 TypeScript 开发手势库 - (3)统一化Mouse和Touch事件](https://juejin.im/post/5c979cd56fb9a070f8407363)

## 今天我们先不写代码
今天的文章里我们先不讲代码, 我们讲一下都有哪些手势以及手势的逻辑, 理解了逻辑再写代码就简单了.

## 感谢一定要写在最前面
1.  感谢开源的[hammer.js](https://github.com/hammerjs/hammer.js/), 是他让我学会了很多手势方面的知识.

2. 还要感谢写这篇文章的作者,[文章地址](https://segmentfault.com/a/1190000007448808#articleHeader1), 文章详细介绍了关于旋转和缩放手势变化的计算.

## 那么常用手势有哪些?
回到正题, 常见的手势有: **tap(点击)** \ **press(按住)** \ **拖拽(pan)** \ **划过(swipe)** \ **捏合缩放(pinch)** \ **旋转(rotate)**, 所有的手势在移动端其实都是通过**touch事件的不同触发时机**而区分出的(pc端是mouseup/mousemove/mousedown, 关于如何通过鼠标识别手势, 后面的文章会有单独的章节).

这里有个[demo](https://383514580.github.io/any-touch/example/), 我把所有的手势识别放在了里面.

## tap(点击)
众所周知, 移动端的click有300ms延迟(浏览器延迟300ms为了识别双击操作, 因为移动端浏览器默认双击可以缩放页面), 为了避免"点击穿透"我们创建了tap事件, 同时通过preventDefault来禁止click触发. tap在**touchend**阶段触发, 说下识别tap的必要条件: 
1. 触发一次touchstart和touchend.
2. touchstart和touchend的坐标之间的距离不能超过2px.
3. touchstart触发后,250ms内必须触发touchend, 不然会被识别成press.

## doubletap(双击)
2次连续的tap(单击)触发双击, 双击的原理如下: 每次tap后并不触发tap, 而是等待300ms看是否有双击触发, 如果没有那么2次tap依次触发, 否则触发双击,单击不触发. (关于多击更细的原理, 后面我会单独通过源码解析), 必要条件:
1. 2次点击之间不能超过300ms.
2. 2次点击的距离不能超过9px.

## press(按)
按住屏幕不放, 一段时间后触发press时间,触发press后, 离开触点, 触发pressup事件, 识别的必要条件如下:
1. touchstart和touchmove之间的距离不能超过9px.
2. 即便触点不离开屏幕, 251ms后也会触发press. 这个251ms对应tap的必要条件第3条.

## pan(拖拽)
(1指或多指)按住屏幕不离开, 每一次移动都会触发pan. 举几个例子:
1. 轮播效果的拖拽切换, 这个拖拽动作就是pan.
2. 抽屉(draw)组件的拖拽显示更多内容.
3. 选项卡(tabs)组件的拖拽显示更多选项卡.
pan是组件开发中最常用的手势.

## swipe(划)
(1指或多指)按住屏幕快速滑动, 当手指离开屏幕的一瞬间, 触发swipe. 必要条件如下: 
1. 滑动超过一定距离(如10px).
2. 滑动速度足够快(大于0.3px/ms).
轮播组件的用swipe来表示"切换下一幕".

## pinch(啮合)
2指及以上按住屏幕, 让2个手指之间的距离发生变化, 通过距离的变化来表示pinch是放大开始缩小.
常见于gallery组件, 用来放大/缩小图片.

## rotate(旋转)
2指及以上按住屏幕, 通过2指连接形成的直线和坐标系的x轴的夹角的变化而触发rotate. 常用于图片处理, 用来旋转图片.

## 源码
上面关于手势识别的具体逻辑可以看我的仓库, 地址: https://github.com/383514580/any-touch/tree/master/src/recognitions

## 未完待续
本次先讲这么多, 后面的文章具体要讲什么看大家的回复想听什么, 期待大家的回复, 本人热爱前端, 但能力有限, 有讲的不对的请大家多多指点.

## 相关概念解释

### 点击穿透
当A/B两个层上下z轴重叠，上层的A点击后消失或移开，并且B元素本身有默认click事件（如a标签）或绑定了click事件。在这种情况下，点击A/B重叠的部分，就会出现点透的现象.