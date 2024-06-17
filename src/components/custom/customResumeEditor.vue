<template>
  <section class="customResumeEditor-wrapper">
    <div id="rich-editor"
				@oncut="oncut"
				 @onpaste="onparse"
         @input="onInput"
         @keypress="onKeyPress"
         @keydown.enter="onEnter"
         @keydown="onBackSpace"
         @keyup="onKeyup"
         @blur="onBlur"
				 @paste="onPaste"
         v-model="inputVal"
         ref="editor"
         @click="onClick"
         :contenteditable="!readOnly">
    </div>
  </section>
  <!-- onpaste="return false" -->
  <!-- @paste="onPaste" -->
</template>
<script>
import {getCursorNode, getLineNode, isCursorAtLineEnd, moveCursorToEndOfNode} from "@/utils/selection";

export default {
  name: 'customResumeEditor',
  inject: ['isActivated'],
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    lock: Function,
    value: String,
    blurDisabled: Boolean
  },
  data() {
    return {
      range: null,
      currentRow: null,
      rowStr: '',
      previousData: null,
      padding: 0,
      inputVal: '',
      currentValue: ''
    }
  },
  mounted() {
    this.$refs.editor.innerHTML += '<div></div>'
    if (this.value) {
      this.initValue(this.value)
    }
    this.currentValue = this.$refs.editor.innerText
  },
  computed:{
    isQuickActivated(){
      //return this.isActivated()  // 因为传递过来是个引用类型的函数 
      return true

    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.reset()
      }
      this.initValue(val)
    },
    isQuickActivated(val) {
      if(val) {
        console.log(this.$parent.$parent)
        this.$parent.$parent.getRenderData()
			}
		}
  },
  methods: {
    reset() {
      this.$refs.editor.innerHTML = '<div></div>'
    },
    onClick(e) {
      if (e.target !== this.$refs.editor) {
        let items = this.formatToItems([e.target]).filter(val => val.rawText && val.rawText.trim())
        const val = items[0]
        const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])--\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002)/
        const reg2 = /^([1-9]\d{3}.(0[1-9]|1[0-2])--[1-9]\d{3}.(0[1-9]|1[0-2])\u2002\u2002)/
        const regExp = new RegExp(reg)
        const regExp2 = new RegExp(reg2)
        if (!regExp.test(val.rawText) && !regExp2.test(val.rawText)) {
          setTimeout(() => {
            this.$notify.error({
              title: '简历格式错误',
              message: `"${val.rawText}"处格式错误,无法锁定!`,
              duration: 1000 * 10,
            });
          }, 100)
          this.insertErrorHTML(val)
          return
        }
        // this.$emit('lock', val.rawText)
        this.$emit('input', this.$refs.editor.innerText)
      }

    },
    onBackSpace(e) {
      if (e.keyCode === 8) {
        let prev = window.getSelection().anchorNode.previousElementSibling
        let isLocked = prev && prev.getAttribute('locked')
        if (isLocked === "true") {
          e.preventDefault()
        }
      }
    },
    onBlur() {
      // if (!this.valid()) return
      //去除每条简历多出的空格
      const domList = this.$refs.editor.children
      for (let i = 0; i < domList.length; i++) {
        const val = domList[i]
        const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])--)/
        const reg2 = /^([1-9]\d{3}.(0[1-9]|1[0-2])--[1-9]\d{3}.(0[1-9]|1[0-2]))/
        const regExp = new RegExp(reg)
        const regExp2 = new RegExp(reg2)
        if (regExp2.test(val.innerText)) {
          const dateStr = val.innerText.substr(0, 16)
          const contentStr = val.innerText.substr(16).trim()
          val.innerHTML = `${dateStr}&ensp;&ensp;${contentStr}`
          val.style.textIndent = '-9em'
          val.style.paddingLeft = '9em'
        } else if (regExp.test(val.innerText)) {
          const dateStr = val.innerText.substr(0, 9)
          const contentStr = val.innerText.substr(9).trim()
          val.innerHTML = `${dateStr}&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;${contentStr}`
          val.style.textIndent = '-9em'
          val.style.paddingLeft = '9em'
        } else {
          val.style.textIndent = '0'
          val.style.paddingLeft = '9em'
        }
      }
      this.$nextTick(() => {
        this.currentValue = this.$refs.editor.innerText
        if (!this.blurDisabled) {
          this.updateVal()
        }
        if(this.valid()) {
          this.$emit('blur', this.$refs.editor.innerText)
				}
      })
    },
    onKeyPress(e) {
      if (e.code === 'Space') {
        e.preventDefault()
        document.execCommand('insertHTML', false, '&ensp;')
      }
    },
    formatToItems(domList = this.$refs.editor.children) {
      let groupList = []
      let tempGroup = []
      for (let i = 0; i <= domList.length; i++) {
        if (tempGroup.length && i >= domList.length) {
          groupList.push({
            index: i - 1,
            tempGroup
          })
          continue
        }
        if (domList[i]) {
          let result = window.getComputedStyle(domList[i], null);
          if (result.textIndent != '0px') {
            if (tempGroup.length) {
              groupList.push({
                index: i - tempGroup.length,
                tempGroup
              })
            }
            tempGroup = [domList[i]]
          } else if (result.textIndent == '0px') {
            tempGroup.push(domList[i])
          }
        }
      }
      groupList.forEach(val => {
        val.rawText = val.tempGroup.map(item => item.innerText).join('')
      })
      return groupList
    },
    insertErrorHTML(val) {
      val.tempGroup.forEach(item => {
        let str = `<span style="border-bottom: 1px dashed red;">${item.innerText}</span>`
        // item.innerHTML = `<div>${str}</div>`
        item.innerHTML = str
      })
    },
    valid(arr = this.formatToItems().filter(val => val.rawText && val.rawText.trim()), single) {
      let error = [];
      arr.forEach((val, index) => {
        const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])--\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002)/
        const reg2 = /^([1-9]\d{3}.(0[1-9]|1[0-2])--[1-9]\d{3}.(0[1-9]|1[0-2])\u2002\u2002)/
        const regExp = new RegExp(reg)
        const regExp2 = new RegExp(reg2)

        if ((arr.length <= 1) && !regExp.test(val.rawText)) {
          // if(single)
          error.push(`"${val.rawText}"处格式错误!`)
          this.insertErrorHTML(val)
        } else if (!regExp.test(val.rawText) && index >= arr.length - 1) {
          error.push(`"${val.rawText}"处格式错误!`)
          this.insertErrorHTML(val)
        } else if (!regExp2.test(val.rawText) && arr.length > 1 && index < arr.length - 1) {
          error.push(`"${val.rawText}"处格式错误!`)
          this.insertErrorHTML(val)
        }
        if ((arr.length <= 1) && regExp2.test(val.rawText)) {
          let result = val.rawText.replace(reg2, '')
          if (!result || !result.trim()) {
            error.push(`"${val.rawText}"处简历内容不能为空！`)
            this.insertErrorHTML(val)
          }
        } else if (regExp.test(val.rawText) && index >= arr.length - 1 && !regExp2.test(val.rawText)) {
          let result = val.rawText.replace(reg, '')
          if (!result || !result.trim()) {
            error.push(`"${val.rawText}"处简历内容不能为空！`)
            this.insertErrorHTML(val)
          }
        } else if (regExp2.test(val.rawText)) {
          let result = val.rawText.replace(reg2, '')
          if (!result || !result.trim()) {
            error.push(`"${val.rawText}"处简历内容不能为空！`)
            this.insertErrorHTML(val)
          }
        }
        // if (!error.length) {
        let [startDate, endDate] = val.rawText.substr(0, 18).trim().split('--')
        val.startDate = startDate
        val.endDate = endDate
        let startDateNumber = this.$moment(val.startDate).valueOf()
        let endDateNumber = this.$moment(val.endDate).valueOf()
        if (index >= arr.length - 1) {
        }
        if (startDateNumber > new Date().getTime()) {
          error.push(`"${val.rawText}"处开始时间不得晚于当前时间！`)
          this.insertErrorHTML(val)
        } else if (endDateNumber > new Date().getTime()) {
          error.push(`"${val.rawText}"处结束时间不得晚于当前时间！`)
          this.insertErrorHTML(val)
        } else if (endDateNumber < startDateNumber) {
          error.push(`"${val.rawText}"处结束时间不得早于开始时间！`)
          this.insertErrorHTML(val)
        } else if (arr[index - 1]) {
          let date = this.$moment(val.startDate).valueOf()
          // if (startDateNumber !== this.$moment(arr[index - 1].endDate).valueOf()) {
          if (this.$moment(startDateNumber).format('YYYY')!=this.$moment(arr[index - 1].endDate).format('YYYY')) {
            error.push(`"${val.rawText}"处请保证简历的连续性！`)
            this.insertErrorHTML(val)
          }

          // }
        }
        // }
      })
      if (error.length) {
        // error.forEach(val => {
        //   setTimeout(() => {
        //     this.$notify.error({
        //       title: '简历格式错误',
        //       message: val,
        //       duration: 6000
        //     });
        //   }, 100)
        // })

        this.$notify.error({
          title: '简历格式错误',
          dangerouslyUseHTMLString: true,
          // message: error.map((val, index) => `${index + 1}${val}`).join('<br/>'),
          message: error.map((val, index) => `<span class="errorNum">${index + 1}</span>${val}`).join('<br/>'),
          duration: 1000 * 10
        });

      }
      return !error.length
    },
    onInput(e) {
      let result = window.getSelection()
      const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])(--))/
      const regExp = new RegExp(reg)
      let dom = result.focusNode.parentElement
      if (dom === this.$refs.editor) {
        return
      } else if (dom.parentElement.localName === 'span') {
        dom = dom.parentElement.localName === 'span' ? dom.parentElement.parentElement : dom.parentElement
      } else if (dom.localName === 'span') {
        dom = dom.parentElement
      }
      if (!dom.previousElementSibling) {
        return
      } else if (!dom.previousElementSibling.innerText.trim()) {
        return
      }
      if (regExp.test(dom.textContent) && dom.textContent) {
        dom.style.textIndent = '-9em'
        dom.style.paddingLeft = '9em'
      } else {
        dom.style.textIndent = '0'
        dom.style.paddingLeft = '9em'
      }

    },
    updateVal() {
      this.$emit('input', this.$refs.editor.innerText)
    },
	onparse(val){
		debugger
	},
	oncut(val){
		debugger
	},
    onKeyup(e) {
      if (e.keyCode == 8 && !this.$refs.editor.innerText.trim()) {
        this.$nextTick(() => {
          this.$refs.editor.innerHTML = '<div></div>'
        })
      }
      //firefox兼容
      if (navigator.userAgent.indexOf("Gecko/") > 0) {
        if (e.keyCode === 8 || e.keyCode === 17) {
          setTimeout(() => {
            let result = window.getSelection()
            result.focusNode
            result.focusNode.data
            if (result.focusNode.data) {
              let dom = result.focusNode.parentElement
              dom.removeAttribute('style')
            }
          }, 0)
        }
      }
      setTimeout(() => {
        let selection = window.getSelection();
        let node = selection.anchorNode
        let offset = selection.anchorOffset
        let rows = this.$refs.editor.children
        for (let i = 0; i < rows.length; i++) {
          let span = rows[i].querySelectorAll('span')
          if (span.length) {
            for (let j = 0; j < span.length; j++) {
              span[j].removeAttribute('style')
            }
          }
        }
      }, 0)
    },
    onEnter() {
		// 匹配时间 xxxx.xx--xxxx.xx
      /*const regTime = /\d{4}.\d{2}--\d{4}\.\d{2}/
      const regExpTime = new RegExp(regTime)
			let nextTime = undefined
      // 获得鼠标所在行节点
      const lineNode = getCursorNode()
      // 如果光标在该该行末尾
      if(isCursorAtLineEnd()) {
        console.log('true')
        //获得回车前所在行的文本
        const text = lineNode.innerText
        console.log({text})
				// 如果文本 匹配到了时间 就获得时间的后者
        const matchTime = text.match(regExpTime)
        console.log(matchTime)
       	if(matchTime && matchTime[0]) {
					 nextTime = matchTime[0].split("--")[1]
          console.log(nextTime)
				}
      }*/

      setTimeout(() => {
				/*if(nextTime) {
          const netNode = getCursorNode()
          netNode.innerText = nextTime + '--'
          moveCursorToEndOfNode(netNode)
					// 清空上次的时间
					nextTime = undefined
				}*/
        let result = window.getSelection()
        const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])(--))/
        const regExp = new RegExp(reg)
        if (regExp.test(result.focusNode.data)) {
          return
        }
        if (result.anchorNode.parentElement && result.anchorNode.parentElement.localName === 'span') {
          let div = result.anchorNode.parentElement.parentElement
          div.innerHTML = div.innerHTML.replace('<span>', '')
          div.innerHTML = div.innerHTML.replace('</span>', '')
          div.style.textIndent = '0'
          div.style.paddingLeft = '9em'
          return
        }
        if (result.focusNode.data && result.focusNode.data.trim()) {
          let dom = result.focusNode.parentElement

          dom.style.textIndent = '0'
          dom.style.paddingLeft = '9em'
        } else {
          let dom = result.focusNode
          dom.style.textIndent = '-9em'
          dom.style.paddingLeft = '9em'
        }
      }, 50)
    },
    onPaste(e) {
      setTimeout(() =>{
        this.initValue(this.$refs.editor.innerText)
			},100)

      // 去空后有文本且不是全选
 /*     let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      let isSelectAll = range.commonAncestorContainer === this.$refs.editor || (range.commonAncestorContainer.data && range.endOffset >= range.commonAncestorContainer.data.length)
      if (this.$refs.editor.innerText && this.$refs.editor.innerText.trim() && !isSelectAll) {
        return
      }
      let pastedText;
      if (window.clipboardData && window.clipboardData.getData) { // IE
        pastedText = window.clipboardData.getData('Text');
      } else if (e.clipboardData && e.clipboardData.getData) {
        pastedText = e.clipboardData.getData('text/plain');
      }*/
      //firefox兼容
      // if (navigator.userAgent.indexOf("Gecko/") > 0) {
      // e.preventDefault()
      // this.initValue(pastedText)

      // }
      // e.preventDefault()
      // let pastedText;
      // if (window.clipboardData && window.clipboardData.getData) { // IE
      //   pastedText = window.clipboardData.getData('Text');
      // } else if (e.clipboardData && e.clipboardData.getData) {
      //   pastedText = e.clipboardData.getData('text/plain');
      // }
      // this.$refs.editor.innerHTML = pastedText
    },
    initValue(pastedText) {
	  	let text = pastedText.trim();
      if (!pastedText&&text) return
      let arr = pastedText.split('\n')
      let lockedSum = 0
      let domList = arr.map((val, i) => {
        let result = val.replace(/[\s]/g, "&ensp;")
        // result = result.replace(/&n/g,"&#10;")
        // result = result.replace(/&n/g,"&#13;")
        // result = result.replace(/&n/g,"<br>")
        let index = result.lastIndexOf('&ensp;')
        if ((result.length - 6) === index) {
          result = result.substr(0, index)
        }
        if (this.lock && this.lock(result)) {
          // if (i === 0) {
          lockedSum++
          return `<div contenteditable="false" locked="true">${result}</div>`
        }
        const reg = /^([1-9]\d{3}.(0[1-9]|1[0-2])(--))/
        const regExp = new RegExp(reg)
        if (!regExp.test(result)) {
          return `<div style="text-indent: 0;padding-left: 9em" class="lockHide">${result}</div>`
        }
        return `<div>${result}</div>`
      })
      if (lockedSum >= domList.length) {
        domList.push(`<div></div>`)
      }
      this.$refs.editor.innerHTML = domList.join('')
    },
  }
}
</script>

<style type="text/scss" lang="scss">
.customResumeEditor-wrapper {
  width: 100%;
  // height: 100%;

  #rich-editor {
    letter-spacing: 0;
    /*margin: 0 auto;*/
    width: 100%;
    height: 100%;
    //min-height: 200px;
    //padding: 10px;
    text-align: left;
    outline: none;
    font-size: 16px;
    //box-sizing: border-box;
    ///*text-align: center;font-size:14px;width: 2px;*/
    //line-height: 23px;
    //word-spacing: -4.5px;
    font-family: SimSun;
  }
  #rich-editor > .lockHide {
    &:before{
      content: '';
    }
  }
  #rich-editor > div {
    padding-left: 9em;
    text-indent: -9em;
    min-height: 10px;
    pointer-events: none;
    position: relative;
    pointer-events: none;
    line-height: 1.5;

    //&:before {
    //  content: "\e6e4";
    //  font-family: element-icons !important;
    //  cursor: pointer;
    //  pointer-events: auto;
    //  color: #99a9bf;
    //
    //  position: absolute;
    //  left: calc(8em - 7px);
    //  z-index: 2;
    //}

    &:after {
      content: '';
      width: 30px;
      position: absolute;
      height: 100%;
      left: -30px;
      top: 0;
      z-index: 1;
    }

    &[locked=true]:after {
      background: #e5e5e570;
    }


    &[locked=true] {
      user-select: none;
      background: #e5e5e570;

      &::before {
        content: "\e6e5";
        color: #E6A23C;
      }
    }
  }
}

.errorNum {
  display: inline-block;
  background-color: #F56C6C;
  border-radius: 18px;
  line-height: 14px;
  padding: 2px 5px;
  color: #fff;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
