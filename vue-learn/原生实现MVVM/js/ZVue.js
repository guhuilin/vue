class ZVue{
	constructor(options){
		this.$options = options  // zvue中的el, data, methods
		this.$el = document.querySelector(options['el'])
		Object.keys(options['data']).forEach(key => {
			let value = options['data'][key]
			if(Array.isArray(value)){
				options['data'][key] = this._toNewArray(key, value)  // 数组需要变异
			}
		})
		this.$data = options['data']  // // ZVue数据集合
		this.$methods = options['methods']  // ZVue方法集合
		this._template = {} // id-template映射表
		this._render = {} // data—render映射表
		this._all_directive = ['v-bind', 'v-model', 'v-click', 'v-for']  // 需要解析的指令
		this._observer(this.$data)  // 扫描所有ZVue数据并劫持
		this._complie(this.$el)  // 扫描所有el的dom指令
	}

	// 实例数组变异及注入回调函数，回调函数在变异方法的切面调用，是动态的具名函数
	// 负责更新data里的相应的数组，触发该数组的set钩子去刷新DOM
	_toNewArray(f_name, arr){
		// 实例具名回调函数
		window.eval("var callback = function "+f_name+" (args, k){console.log('数组发生变化...');callback.vm.$data[k] = [...args]}")
		callback.vm = this  // 给回调函数注入静态变量——ZVue的指针
		return new NewArray(arr, callback)  // 注入回调函数
	}

	// 属性劫持到变化，通知相应的watcher对象刷新view
	_defineProperty(obj, key, value, deep){
		Object.defineProperty(obj, key, {
			enumerable: true,
	  		configurable: true,
	  		get: () => value,
	  		set: newVal => {
	  			console.log(`${key}进入了set钩子 `)
	  			if(newVal !== value){
	  				// 劫持到数据变化后，执行映射表相应的DOM刷新函数
	  				value = Array.isArray(newVal) ? this._toNewArray(key, newVal) : newVal
	  				if(Number(key) >= 0){
	  					// 数组元素变化，需要深度调用一层的映射表中的watcher对象刷新
	  					this._render[deep][key]['_renders'].forEach(watcher => watcher.update())
	  				}else{
	  					// 平级元素变化，直接调用映射表中的watcher对象刷新
						this._render[key]['_renders'].forEach(watcher => watcher.update())  								
	  				}
	  			}
	  		}
		})
	}

	// 深度遍历所有属性，维护render映射表，并分派劫持监听
	_observer(obj, deep){
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				let value = obj[key]
				if(typeof value !== 'function'){
					if(Array.isArray(value)){
						this._render[key] = {_renders: []}  // 该层的data-render表
						this._observer(value, key)  // 深度一层遍历属性并劫持监听
						this._defineProperty(obj, key, value)
						continue
					}
					if(deep){
						this._render[deep][key] = {_renders: []}  // 数组项的data-render初始化
					}else{
						this._render[key] = {_renders: []}  // 普通值的data-render初始化
					}
					this._defineProperty(obj, key, value, deep)  // 劫持监听该属性
				}
			}	
		}
	}

	// 深度遍历dom结构的所有指令，维护template映射表，分派到各自的解析函数
	_complie(root){
		let nodes = root.children
		for(let i = 0; i < nodes.length; i++){
			let curNode = nodes[i]
			this._maintainTemplate(curNode)  // 动态维护id-template映射表
			if(curNode.children.length){
				this._complie(curNode)
			}else{
				if(curNode.hasAttribute('v-model')){
					this._parsing_v_model(curNode)
				}
				if(curNode.hasAttribute('v-bind')){
					this._parsing_v_bind(curNode)
				}
				if(curNode.hasAttribute('v-click')){
				 	this._parsing_v_click(curNode)
				}
				if(curNode.hasAttribute('v-for')){
					this._parsing_v_for(curNode)
				}
			}
		}
	}

	// 解析v-model指令
	_parsing_v_model(curNode){
		let attrVal = curNode.getAttribute('v-model')
		curNode.removeAttribute('v-model')
		this._render[attrVal]._renders.push(
			new Watcher('input', curNode, this, attrVal, 'value')
		)
	 	curNode.addEventListener('input', () => {
	 		// 双向绑定，更新实例中data中对应属性的值为dom的实际值
	 		this.$data[attrVal] = curNode.value
	 	})
	}

	// 解析v-click指令
	_parsing_v_click(curNode){
		let attrVal = curNode.getAttribute('v-click')
		curNode.removeAttribute('v-click')
	 	curNode.addEventListener('click', e => {
	 		let fn_name = attrVal.split('(')[0]  // 获得方法名字
	 		let fn_params = [] 
			if(/.*\((.*?)\)$/.test(attrVal)){
				fn_params = RegExp.$1.split(',')  // 获得方法的参数列表
			}
			// 需要向上检测当前的dom是否是循环生成的，如果是则需要动态更新参数列表为数组的索引和值
	 		let template_for_id = curNode.parentNode.getAttribute('v-data')
	 		if(template_for_id){
	 			let vforVal = this._template[template_for_id].match(/v-for=\"(.*?)\"/)[1]  // 得到v-for指令
	 			let [attrProps, attrName] = vforVal.replace(/\s+/g, '').split('in') // 解析x in y
				let indexKey = '', valueKey = ''
				if(/.*\((.*?)\)$/.test(attrProps)){
					[indexKey, valueKey] = [...RegExp.$1.split(',')]
				}
				let curNodeIdx = 0, targetDom = e.target
		 		while(targetDom = targetDom.previousElementSibling){
		 			curNodeIdx++  // 获得当前dom在父级的索引
		 		}
		 		// 动态更新参数列表为数组的索引和值
				fn_params.forEach((param, idx) => {
					param = param.replace(/\s+/g, '')
					if(param === indexKey){fn_params[idx] = curNodeIdx}
					if(param === valueKey){fn_params[idx] = this.$data[attrName][curNodeIdx]}
				})
	 		}
	 		this.$methods[fn_name].apply(this.$data, fn_params)  // 传入参数列表，调用真实方法
	 	})
	}

	// 解析v-bind指令
	_parsing_v_bind(curNode){
		let attrVal = curNode.getAttribute('v-bind')
		curNode.removeAttribute('v-bind')
		this._render[attrVal]._renders.push(
 			new Watcher('text', curNode, this, attrVal, 'innerHTML')
 		)
	}

	// 解析v-for指令——循环生成n个动态dom
	_parsing_v_for(curNode){
		let attrVal = curNode.getAttribute('v-for')
		curNode.removeAttribute('v-for')
		let parentNode = curNode.parentNode
		let [attrProps, attrName] = attrVal.replace(/\s+/g, '').split('in') // 解析x in y
		let indexKey = '', valueKey = ''
		if(/.*\((.*?)\)$/.test(attrProps)){
			[indexKey, valueKey] = [...RegExp.$1.split(',')]  // 得到数组项的索引和数值的表达式
		}
		let replaces = {idx: indexKey ? indexKey : null, val: valueKey ? valueKey : attrProps}
		// 给列表父dom绑定列表类型的watcher对象，负责动态删除/添加dom
		this._render[attrName]._renders.push(
			new Watcher('list', parentNode, this, attrName, 'innerHTML', 0, replaces)
		)
	}

	// 给生成的动态dom绑定watcher对象
	_parsing_v_for_item(parentNode, attrName, replaces){
		let nodes = parentNode.children
		for(let idx = 0; idx < nodes.length; idx++){
			this._render[attrName][idx]._renders.push(
				new Watcher('text', nodes[idx], this, attrName, 'innerHTML', idx, replaces)
			)
			// 如果新的dom存在v-click指令，需要解析该指令
			if(nodes[idx].hasAttribute('v-click')){
				this._parsing_v_click(nodes[idx])
			}
		}
	}

	// 动态维护删除data—render的映射表
	_deleteArrayWatcher(attrName, idx){
		delete this._render[attrName][idx]
	}

	// 动态维护id-template映射表
	_maintainTemplate(curNode){
		// 遍历当前dom是否包含指令，包含则给dom标记唯一标志，并维护id-template映射表
		for(let i = 0; i<this._all_directive.length; i++){
			if(curNode.hasAttribute(this._all_directive[i])){
				let id = Math.random().toString(36).substr(2)
				curNode.removeAttribute('v-data')
				this._template[id] = curNode.outerHTML  // 维护id-template映射表
				if(this._all_directive[i] === 'v-for'){
					curNode.parentNode.setAttribute('v-data', id)  // 循环dom标记唯一标志
				}else{
					curNode.setAttribute('v-data', id)  // dom标记唯一标志
				}		
			}
		}
	}
}

// 负责更新视图
class Watcher{
	constructor(name, dom, vm, vmDataVal, domAttr, index, replaces, template){
		this.name = name  // render类型判断
		this.dom = dom  // 绑定的dom元素
		this.vm = vm  // 指向ZVue的指针
		this.vmDataVal = vmDataVal  // ZVue中的Data对应的数值属性或对象属性
		this.domAttr = domAttr  // dom的更新属性值，如vale,innerHTML等
		this.index = index  // 数组的当前索引
		this.replaces = replaces // 原dom的innerHTML里替换插值表达式的key{idx,val}
		this.update()
	}
	// 根据dom字符串，动态组装出包含标签、类名、内容以及自定义指令的dom模板
	getTemplateDom(domStr){
		let tagName = domStr.match(/<\/(.*?)\>/)[1]  // 解析出dom的标签
		let className = domStr.match(/class=\"(.*?)\"/)[1]  // 解析出dom的class
		let content = domStr.match(/>(.*?)</)[1]  // 解析出dom的内容模板
		let v_attr = domStr.match(/(v-.+?)=\"(.*?)\"/g)  // 解析出dom所有的v-*指令
		let tempDom = document.createElement(tagName)
		tempDom.className = className
		tempDom.innerHTML = content
		for(let i = 0;i < v_attr.length; i++){
			let [k, v] = [...v_attr[i].split('=')]
			tempDom.setAttribute(k, v.replace(/\"/g, ''))  // 动态赋值v-*指令
		}
		return tempDom
	}
	// 动态批量删除dom，并同步维护data—render映射表
	deleteBatchDom(){
		let nodes = this.dom.children
		let len = nodes.length
		for(let i = 0; i < len; i++){
			this.dom.removeChild(nodes[0])
			this.vm._deleteArrayWatcher(this.vmDataVal, i)  // 同步维护data—render映射表
		}
	}
	// 动态批量添加dom，并同步劫持监听新的属性值以及解析新指令
	addBatchDom(){
		let domStr = this.vm._template[this.dom.getAttribute('v-data')]
		let _copyDom = this.getTemplateDom(domStr)
		let vmData = this.vm.$data[this.vmDataVal]
		let nodes = this.dom.children
		for(let i = 0; i < vmData.length; i++){
			let _cloneNode = _copyDom.cloneNode(true)
			_cloneNode.innerHTML = _copyDom.innerHTML
			if(i >= 0){_cloneNode.removeAttribute('v-for')}
			this.dom.appendChild(_cloneNode)
		}
		this.vm._observer(vmData, this.vmDataVal)  // 同步劫持监听新的属性值
		this.vm._parsing_v_for_item(this.dom, this.vmDataVal, this.replaces)  // 同步解析新指令
	}
	// 更新数组类型的视图片段
	update_Array(vmData){
		// 如果render属于迭代数组列表，则动态批量删除/添加dom
		if(this.name === 'list'){
			this.deleteBatchDom()  // 动态批量删除dom
			this.addBatchDom()  // 动态批量添加dom
		}
		// 如果render属于数组项，则更新dom中的值
		else if(this.name === 'text'){
			let idx_temp = `{{${this.replaces['idx']}}}`  // 插值表达式中的索引真实值
			let value_temp = `{{${this.replaces['val']}}}`  // 插值表达式中的数值真实值
			let domStr = this.vm._template[this.dom.parentNode.getAttribute('v-data')]
			this.dom[this.domAttr] = domStr.match(/>(.*?)</)[1]  // 初始化dom的值为模板中的插值表达式
			// 替换插值表达式
			this.dom[this.domAttr] = this.dom[this.domAttr].
					replace(value_temp, vmData[this.index]).
					replace(idx_temp, this.index)
		}
	}
	// 更新普通标签中的视图片段
	update_Text(vmData){
		this.dom[this.domAttr] = vmData
	}
	// set钩子来触发，负责通知该属性对应的更新函数来刷新视图
	update(){
		let vmData = this.vm.$data[this.vmDataVal]
		if(Array.isArray(vmData)){
			this.update_Array(vmData)  // 如果是数组类型，调用数组的更新方法
		}else{
			this.update_Text(vmData)
		}
		console.log('_render', this.vm._render)
		console.log('data', this.vm.$data)
	}
}
// 重载数组的变异方法
class NewArray extends Array{
	constructor(){
		if(arguments.length === 1){return super()}  // 产生中间数组会再进入构造方法
		let args = arguments[0]  // 原数组
		args.length === 1 ? super(args[0].toString()) : super(...args)
		this.callback = arguments[1]  // 注入回调具名函数
	}
	push(...args){
		super.push(...args) 
		this.callback(this, this.callback.name)  // 切面调用具名回调函数
	}
	pop(){
		super.pop() 
		this.callback(this, this.callback.name)
	}
	splice(...args){
		super.splice(...args)
		this.callback(this, this.callback.name)
	}
}

