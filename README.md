# 快速上手

### 启动流程
1. idea下载项目
2. npm install 下载项目依赖（注意下载时获取npm权限）
> 问题：ChromeDriver installation failed Error with http(s) request: Error: read ECONNRESET
> 解决办法：npm install -g chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver

3. npm start 运行，运行完成后输入localhost:8601可以访问
4. npm run build 发布生产环境代码

### 关键文件及修改配置项**
- 积木块中文：node_modules\scratch-blocks\dist\vertical.js
- 界面中文修改：src代码查找替换，部分查找不到的会放在node_modules\scratch-l10n\locales\gui-msgs.js，修改en部分


### 约定
1. @study注解表示学习过程中自己的理解，如：
/**
 * @study redux
 * Store 就是保存数据的地方，整个应用只能有一个 Store。
 * createStore用来生成Store，由redux提供
 */


### git拉取代码操作

步骤：1、配置上游项目地址。即将你 fork 的项目的地址给配置到自己的项目上。比如我 fork 了一个项目，原项目是
wabish/fork-demo.git，我的项目就是 cobish/fork-demo.git。使用以下命令来配置。
➜ git remote add upstream https://github.com/LLK/scratch-gui.git

然后可以查看一下配置状况，很好，上游项目的地址已经被加进来了。
➜ git remote -v
origin  git@github.com:cobish/fork-demo.git (fetch)
origin  git@github.com:cobish/fork-demo.git (push)
upstream    https://github.com/wabish/fork-demo.git (fetch)
upstream    https://github.com/wabish/fork-demo.git (push)
2、获取上游项目更新。使用 fetch 命令更新，fetch 后会被存储在一个本地分支 upstream/master 上。
➜ git fetch upstream
3、合并到本地分支。切换到 master 分支，合并 upstream/master 分支。
➜ git merge upstream/master
如果提示： fatal: refusing to merge unrelated histories
git merge upstream/develop --allow-unrelated-histories

4、提交推送。根据自己情况提交推送自己项目的代码。➜ git push origin master
由于项目已经配置了上游项目的地址，所以如果 fork 的项目再次更新，重复步骤 2、3、4即可。

### 其他git基本操作
1. 查看远程分支
git branch -a
2. 删除本地分支及远程分支
git branch -d henan
git push origin :henan
3. 忽略git配置文件
git rm -rf --cached .idea
4. 推送本地分支到线上
git push origin 分支名称
### 基本认识
#### React
组件生命周期
> 每个React组件在加载时都有特定的生命周期，在此期间不同的方法会被执行。 下面简单介绍React组件的生命周期：
- componentWillMount   该方法会在组件render之前执行，并且永远只执行一次。
- componentDidMount   该方法会在组件加载完毕之后立即执行。此时，组件已经完成了DOM结构的渲染， 并可以通过 this.getDOMNode() 方法来访问。
- componentWillReceiveProps  组件接收到一个新的prop时会被执行，且该方法在初始render时不会被调用。
- shouldComponentUpdate  在组件接收到新的props或state时被执行。
- componentWillUpdate  在组件接收到新的props或者state但还没有render时被执行。 在初始化时不会被执行。
- componentDidUpdate  在组件完成更新后立即执行。在初始化时不会被执行。 一般会在组件完成更新后被使用。
- componentWillUnMount  在组件从DOM中unmount后立即执行。该方法主要用来执行一些必要的清理任务。



#### Redux
**Redux 的适用场景：多交互、多数据源**
- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

**Redux 的设计思想**
- Web 应用是一个状态机，视图与状态是一一对应的
- 所有的状态，保存在一个对象里面

**Store**
- Store 就是保存数据的地方，整个应用只能有一个 Store。
- createStore用来生成Store，由redux提供

**State**
- Store对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。
当前时刻的 State，可以通过store.getState()拿到。
- Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。

**Action**
- State 的变化，会导致 View 的变化。Action用于view发出通知State发生变化。
- Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。

**Reducer**
- Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。
Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。



#### React-Redux
**UI组件**
- React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）
- UI组件的特征
>    1. 只负责 UI 的呈现，不带有任何业务逻辑
>    2. 没有状态（即不使用this.state这个变量）
>    3. 所有数据都由参数（this.props）提供
>    4. 不使用任何 Redux 的 API

**容器组件**
- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑
- 特征
>    1. 负责管理数据和业务逻辑，不负责 UI 的呈现
>    2. 带有内部状态
>    3. 使用 Redux 的 API

- 既有UI又有业务逻辑组件：外面是一个容器组件，里面包了一个UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。

**语法**
- connect()
> React-Redux 提供connect方法，用于从 UI 组件生成容器组件。
> 参数
1. 输入逻辑：外部的数据（即state对象）如何转换为 UI 组件的参数
2. 输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

```
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,  //负责输入逻辑，即将state映射到 UI 组件的参数（props）
  mapDispatchToProps   //负责输出逻辑，即将用户对 UI 组件的操作映射成 Action
)(TodoList)
```

- mapStateToProps()
> mapStateToProps是一个函数。建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系。
> 作为函数，mapStateToProps执行后应该返回一个对象，里面的每一个键值对就是一个映射。
> mapStateToProps会订阅 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。mapStateToProps的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。

```
const mapStateToProps = state => ({
    currentLocale: state.intl.locale
});
```

- mapDispatchToProps()
> mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射。
> 如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数。

```
const mapDispatchToProps = dispatch => ({
    onChange: e => {
        e.preventDefault();
        dispatch(updateIntl(e.target.value));
    }
});
```

- Provider 组件
> Provider在根组件外面包了一层，react-redux提供该组件用来让所有的子组件默认都可以拿到state对象

```
const AppStateHOC = function (WrappedComponent) {
    const AppStateWrapper = ({...props}) => (
        <Provider store={store}>
            <IntlProvider>
                <WrappedComponent {...props} />
            </IntlProvider>
        </Provider>
    );
    return AppStateWrapper;
};
```
