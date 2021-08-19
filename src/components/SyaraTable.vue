<template>
  <div class="syara-table-container" >

    <!-- Table title  -->
    <div class="syara-table-title" v-if="title">
      {{title}}
    </div>

    <!-- Table : show only if header and body are correctly set    -->
    <!-- if no personal styles, class or theme are received, then use default theme  -->
    <table v-if="header && body" :class="[ myClass ? myClass :  theme]">

      <thead>

        <!-- header line  -->
        <tr v-if="header" :style=" navigatorPage.includes('Chrome/') ? 'width: calc(100% - 10px);' : 'width: calc(100% - 17px);'">

          <!-- column : for each object header in header array received  -->
          <th class="th" v-for="(column, columnIndex) in insideHeader" :key="column.id" :style="column.style">
            <!-- wrapper div for column  -->
            <div>
              <!-- column filter  -->
              <div 
              class="header-filter" 
              v-if="'filter' in column && column.filter" 
              :class="{'header-tooltip' : 'help' in column && column.help.length > 0}"
              :attr-tooltip-text="'help' in column && column.help.length ? column.help : ''"
              >
                <input type="text" v-model="column.filterText" :placeholder="column.filterPlaceholder">
              </div>
              <div class="header-empty" v-else></div>

              <!-- column text (with or without order tool)  -->
              <div class="header-text order" v-if="'asc' in column" :id="columnIndex" :class="{'head-sort': 'asc' in column}" @click="orderData(insideHeader, insideBody, columnIndex)" >
                    
                  <span>{{column.text.trim()}}</span>
                  <svg v-if="column.asc" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                  <svg v-else-if="column.asc===false" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                  <span v-else></span>
              </div>
              <div class="header-text order" v-else>
                <span>{{column.text.trim()}}</span>
              </div>
            </div>

          </th>

          <!-- line selection tool :: only if selFiel is set  :style="navigatorPage.includes('Chrome/') ? 'width:60px;padding-left:25.5px;' : 'width:60px;padding-left:13.7px;'"-->
          <th v-if="selectionField" class="th" style="width:60px;" >
            <!-- wrapper div for column  -->
            <div>
              <!-- empty : no filter header  -->
              <div class="header-empty" ></div>

              <!-- checkbox / selection header  -->
              <div class="header-text"> 

                <svg v-if="selectTotal" @click="checkTotal(false)"
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" viewBox="0 0 24 24" 
                width="24px" 
                fill="#3A4859">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg v-else @click="checkTotal(true)"
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 0 24 24" 
                width="24px" 
                fill="#3A4859">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>

              </div> 
            </div>
          </th>

        </tr>

      </thead>

      <tbody  :style=" bodyHeight ? 'height:'+bodyHeight+'px;' : 'height: auto;' ">

        <!-- if loading is informed as true  -->
        <template v-if="bodyLoading">
          <div style="margin-top: 20px;" v-html="bodyLoadingText"></div>
        </template>
        <template v-else>
          <!-- If body is set correctly :: show lines -->
          <template v-if="body">

            <!-- table line in v-for (loop) -->
            <tr v-for="(line, indexLine) in finalBodyData" :key="indexLine" @click="lineClick ? clickLink(lineClick, line) : null" :style="lineClick ? 'cursor: pointer;' : ''">

              <td v-for="column in insideHeader" :key="column.id" :class="{'td-hover':column.asc!=null}" :style="column.style">
                <!-- text and action for each cell in line  -->
                <template v-if="'actions' in column && column.actions.length > 0">
                  <div class="syara-table-actions-container">
                    <div v-for="(action, actionIndex) in column.actions" :key="actionIndex" class="syara-table-actions"  @click="clickLink(action.callback, line)">
                      <span class="syara-table-actions-info" v-if="'info' in action">{{line[action.info]}}</span>
                      <div class="syara-table-actions-icon" v-if="'icon' in action" v-html="action.icon"></div>
                      <div class="syara-table-actions-icon" v-if="'mdIcon' in action">
                        <span class="material-icons" :class="('mdIconSize' in action) ? `md-${action.mdIconSize}` : null">{{action.mdIcon}}</span>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="'labels' in column && column.labels.length > 0">
                  <div class="syara-table-labels-container">

                    <div v-for="(label, labelIndex) in column.labels" :key="labelIndex" class="syara-table-labels"  >
                      
                      <template v-if="('byIndex' in label || 'tooltipText' in label) && 'mapValues' in label">
                        <!-- show text by id in label itself  -->
                        <span 
                        v-if="label.byIndex && ('tooltipText' in label === false || label.tooltipText === false)" 
                        class="syara-table-label-index" 
                        :style="label.mapValues && `${line[label.field]}` in label.mapValues && 'color' in label.mapValues[line[label.field]] ? `background-color:${label.mapValues[line[label.field]].color};color:${fontColorFix(label.mapValues[line[label.field]].color)}`: ''"
                        >
                        {{label.mapValues && `${line[label.field]}` in label.mapValues ? label.mapValues[line[label.field]].text : ' '}}
                        </span>
                        <!-- text tooltip only  -->
                        <span 
                        v-else-if="label.byIndex && label.tooltipText" 
                        class="syara-table-label-index" 
                        :class="label.mapValues ? 'tooltip-host': null" 
                        :tool-tip-attr="label.mapValues && `${line[label.field]}` in label.mapValues  ? label.mapValues[line[label.field]].text : ' '">
                        {{line[label.field]}}
                        </span>

                      </template>
                      <!-- show only the value of field  -->
                      <span v-else :style="'color' in label ? `background-color: ${label.color}`: null">{{line[label.field]}}</span>

                    </div>
                  </div>
                </template>

                <!-- text for each cell in line  -->
                <template v-else>{{line[column.field]}}</template>

              </td>
              

              <!-- line selection tool :: only if selFiel is set  -->
              <td v-if="selectionField" style="width:60px;">

                <!-- placeholder for suitable icons :: using google svg icons-->
                <svg v-if="line.SYARA_SEL" @click="selectLine(line)"
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" viewBox="0 0 24 24" 
                width="24px" 
                fill="#3A4859">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg v-else @click="selectLine(line)"
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 0 24 24" 
                width="24px" 
                fill="#3A4859">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>

              </td>

            </tr>
          </template>

          <!-- Message for exhibition when there is no data  -->
          <template v-else>
            <tr>
              <td>{{bodyErrorText}}</td>
            </tr>
          </template>
        </template>
      </tbody>

      <tfoot>

        <tr>

          <th :colspan="header.length">

            <div class="footer-line">

              <!-- Table footer text  -->
              <div class="footer-text" v-html="footerTextComputed">
              </div>

              <!-- Pagination tools :: if pageLimit is set  -->
              <div class="footer-pages" v-if="pageLimit">

                <!-- Pagination commands ::: only show if pages amount is bigger than 4 and current page is not the first  -->
                <template v-if="pages.length > 4 && pageCurrent.index > 0">

                  <!-- first page  -->
                  <div class="page"  @click="firstPage">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="18px" 
                    viewBox="0 0 24 24" 
                    width="18px" 
                    fill="#3A4859">
                      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
                      <path d="M24 24H0V0h24v24z" fill="none"/>
                    </svg>
                  </div>
                  <!-- previous page  -->
                  <div class="page"  @click="prevPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#3A4859"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  </div>

                </template>

                <!-- Pages  -->

                <!-- if page amount is less than 10 pages  -->
                <template v-if="pagesIndex.length < 10">
                  <div class="page" :class="{'page-sel': pageCurrent.index === indexPage}" v-for="(page, indexPage) in pages" :key="indexPage" @click="changePage(indexPage)">
                    {{(indexPage+1)}}
                    <div class="itens-sel" v-if="page.selected > 0"></div>
                  </div>
                </template>
                <!-- page amount bigger than or equal to 10 pages  -->
                <template v-else>

                  <div v-for="(pageNumber, pageIndex) in visiblePagination" :key="pageIndex">
                    
                    <div v-if="pageNumber !== '...'" class="page" :class="{'page-sel': pageCurrent.index === pageNumber}"   @click="changePage(pageNumber)" >
                      {{(pageNumber+1)}}
                      <div class="itens-sel" v-if="pages[pageNumber].selected > 0"></div>
                    </div>

                    <div v-else class="page-dots" >
                      ...
                    </div>  
                 
                  </div>
                  
                </template>

                <!-- Pagination commands ::: only show if pages amount is bigger than 4 and current page is not the last  -->
                <template v-if="pages.length > 4 && pageCurrent.index < (pages.length - 1)">
                  <!-- next page  -->
                  <div class="page"  @click="nextPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#3A4859"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg> 
                  </div>
                  <!-- last page  -->
                  <div class="page"  @click="lastPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#3A4859"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg> 
                  </div>
                </template>
                

              </div>

            </div>
            
          </th>

        </tr>
        
      </tfoot>

    </table>

    <div v-else class="syara-table-no-data">
      {{headerErrorText}}
    </div>

  </div>
</template>

<script>
import {v4 as uuidv4 } from 'uuid'

export default {
    name:'SyTable',
    props:{
      // Table's title
      title: {
        type: String,
        required: false,
        default: null
      },
      // Array of object with configuration for each column of table
      header: {
        type: Array,
        required: false,
        default: null
        
      },
      // text shown when no properties are set
      headerErrorText: {
        type: String,
        required: false,
        default: 'Sorry! No properties received.'
      },
      // Array of object that must be shown
      body: {
        type: Array,
        required: false,
        default: null
      },
      // tbody height in case of overflow-y
      bodyHeight: {
        type: Number,
        required: false,
        default: null
      },
      // text shown when there is no data 
      bodyErrorText: {
        type: String,
        required: false,
        default: 'Sorry! No data to show here...'
      },
      bodyLoading: {
        type: Boolean,
        required: false,
        default: false
      },
      bodyLoadingText: {
        type: String,
        required: false,
        default: 'Fetching data, please wait...'
      },
      // style theme for table - default is syara-light
      theme: {
        type: String,
        required: false,
        default: 'syara-light'
      },
      // class name of personal style - has priority over theme
      myClass: {
        type: String,
        required: false,
        default: null
      },
      // text at footer
      footerText: {
        type: String,
        required: false,
        default: 'Showing __LINES__ of __MAXLINES__'
      },
      // set pagination limit tool for the table pages 
      pageLimit: {
        type: Number,
        required: false,
        default: null
      },
      // Set selection tools
      selectionField: {
        type: Boolean,
        required: false,
        default: null
      },
      // Sum field : TODO
      sumField: {
        type: String,
        required: false,
        default: null
      },
      // Callback function when line is clicked 
      lineClick: {
        type: String,
        required: false,
        default: null
      },
      

    },
    data() {

      return {

        // Default options of every column
        templateHeaderColumn: {
          id: uuidv4(),
          text: '',
          filter: false,
          filterText: '',
          filterPlaceholder: 'Filter...',
          field: null,
          textAlign: 'center',
          style: {},
          asc: null,
          actions: []

        },

        // Copy of header prop that alow modifications and adjustments
        insideHeader:[],
        insideBody:[],
        
        // map of types to functions while filtering
        mapTypes:{
          number: 'filterNumber',
          string: 'filterString'
        },

        // pagination system
        pagesIndex: [],
        pages: [{data:[], selected: 0}],
        pageCurrentIndex: 0,
        
        // select system
        selectedLinesCounter: 0,
        selectedLinesSumValue: 0,
        selArray: [],
        selectTotal: false,

        navigatorPage: null


      }

    },
    computed: {

   
      filteredBody: function() {
        return this.filterBody(this.insideBody)
      },

      finalBodyData: function() {

        if(this.pageLimit) {
          return this.pageCurrent.data
        } else {
          return this.filteredBody
        }

      },

      footerTextComputed: function () {

        let returnText = this.footerText

        const mapStringFooter = {
          '__LINES__': this.filteredBody.length,
          '__MAXLINES__': this.insideBody.length,
          '__FROM__': this.pageLimit ? this.pageLimit * this.pageCurrent.index + 1 : this.pageCurrent.index + 1,
          '__TO__': this.pageLimit && this.pageCurrent.index < this.pagesIndex.slice(-1) ?  this.pageLimit * this.pageCurrent.index + this.pageLimit : this.filteredBody.length,
          '__SELECTED__': this.selArray.length,
          '__SELECTED_SUM_VALUE__': this.selectedLinesSumValue.toFixed(2),
        }

        for (let placeholder in mapStringFooter) {
          if (returnText.includes(placeholder)) {
            returnText = returnText.replace(placeholder, mapStringFooter[placeholder])
          }
        }

        return returnText

      },

      visiblePagination: function() {

        let result = []
        if (this.pagesIndex.length > 10) {
          if (this.pageCurrent.index <= 5){
            result = [...this.pagesIndex.slice(0,7), '...', ...this.pagesIndex.slice(-2)]
          } else if (this.pagesIndex.slice(-6).includes(this.pageCurrent.index)) {
            result = [...this.pagesIndex.slice(0,2), '...', ...this.pagesIndex.slice(-7)]
          } else {
            result = [0, '...', ...this.pagesIndex.slice((this.pageCurrent.index -2),(this.pageCurrent.index + 2)), '...',...this.pagesIndex.slice(-1)]
          }

        } else {
          result = this.pagesIndex
        } 

        return result

      },

      pageCurrent: function() {
        if (typeof this.pages[this.pageCurrentIndex] !== 'undefined') {
          return {index: this.pageCurrentIndex, data: this.pages[this.pageCurrentIndex].data}
        } else {
          this.firstPage()
          return {index: 0, data: this.pages[0].data}
        }
       
      }


    },
    watch: {
      // if body change :: setupBody again
      body() {
        this.setupBody()
      }
    },
    created() {
      this.setupHeader()
      this.setupBody()
      this.navigatorPage = navigator.userAgent
      
    },
    methods:{

      fontColorFix(backgroundColor) {

        // if (this.value === 0) return '#3A4859'

        if (backgroundColor.charAt(0) !== '#' ) return '#FFFFFF'

        let hex1 = backgroundColor.substr(1,2)
        let hex2 = backgroundColor.substr(3,2)
        let hex3 = backgroundColor.substr(5,2)

        let dec1 = parseInt(hex1, 16)
        let dec2 = parseInt(hex2, 16)
        let dec3 = parseInt(hex3, 16)

        let sumAve = dec1 + dec2 + dec3

        return (sumAve > 400) ? '#3A4859' : '#FFFFFF'

      },
      // Prepare header and body

      setupHeader(){
        const headerLen = this.header.length
        for (let index = 0; index < headerLen; index++) {
          const element = this.header[index];
          'id' in element ? this.templateHeaderColumn.id = element.id : this.templateHeaderColumn.id = uuidv4()
          const newElement = {...this.templateHeaderColumn, ...element}
          this.insideHeader.push(newElement)

        }
      },

      setupBody() {
        let resultArray  = [...this.body]
        console.log('setupBody')
        if (this.selectionField) {
          let counter = 1
          for (let line of resultArray) {
            line['SYARA_ID_LINE'] = counter
            line['SYARA_SEL'] = false
            counter++
          }
        }
        // return resultArray
        this.insideBody = resultArray

      },

      // Pagination tools

      changePage(pageIndex){
        console.log('changePage')
        this.pageCurrentIndex = pageIndex
      },

      nextPage(){

        let currentIndex = this.pageCurrent.index
        if (currentIndex < this.pages.length - 1) {
          this.pageCurrentIndex = currentIndex + 1
        } 

      },

      prevPage(){

        let currentIndex = this.pageCurrent.index
        if (currentIndex > 0) {
          this.pageCurrentIndex = currentIndex - 1
        } 

      },

      firstPage(){
        this.pageCurrentIndex = 0
      },

      lastPage(){
        this.pageCurrentIndex = this.pages.length - 1
      },

      // Selection tools
      
      // Check / Uncheck all lines -  ok
      checkTotal(checked) {
        // console.log(`checkTotal :: ${checked}`)
        // if select all lines
        if (checked) {
          this.selArray = []
          this.selectTotal = true
          for (let line of this.filteredBody) {
            line.SYARA_SEL = true
            this.selArray.push(line)
            this.selectedLinesCounter++
            if (this.sumField) {
              this.selectedLinesSumValue += parseFloat(line[this.sumField])
            }
          }
          if (this.pageLimit) {
            for(let pIndex of this.pagesIndex) {
              this.pages[pIndex].selected = this.pageLimit
            }
          }
        } else {

          this.selectTotal = false
          for (let line of this.filteredBody) {
            line.SYARA_SEL = false
          }
          this.selectedLinesCounter = 0
          this.selArray = []
          if (this.sumField) {
            this.selectedLinesSumValue = 0
          }
          if(this.pageLimit) {
            for(let pIndex of this.pagesIndex) {
              this.pages[pIndex].selected = 0
            }
          }


        }

        this.$emit('selectedLines', [...this.selArray])

      },
      
      // Check / uncheck line received - ok
      selectLine(line){

        // console.log(line)
        let id = line.SYARA_ID_LINE 
        if(line.SYARA_SEL === false){
          // console.log('selectLine SYARA_SEL === false')
          line.SYARA_SEL = true
          this.selArray.push(line)
          this.selectedLinesCounter += 1
          if (this.sumField) {
              this.selectedLinesSumValue += parseFloat(line[this.sumField]);
          }   
          if (this.pageLimit) {
            this.pages[this.pageCurrentIndex].selected += 1
          }
          
        }else{

          // console.log('selectLine SYARA_SEL === true')
          line.SYARA_SEL = false
          this.selectedLinesCounter -= 1
          if(this.sumField){
              this.selectedLinesSumValue -= parseFloat(line[this.sumField]);
          }
          for (var index = 0; index < this.selArray.length; index++) {
              var element = this.selArray[index];
              if( element.SYARA_ID_LINE === id){
                  this.selArray.splice(index, 1)
                  break
              }
          }
          if (this.pageLimit) {
            this.pages[this.pageCurrentIndex].selected -= 1
          }
        }

        this.$emit('selectedLines', [...this.selArray])
          
      
      },

      // Filter tools

      mapFunctionFilter(type, filterValue, fieldValue) {
        // console.log('mapFunctionFilter')
        let superFunction =  this.mapTypes[type]
        return this[superFunction](filterValue, fieldValue)
      },

      biggerThan(filter, target){
        return target > filter ? true : false
      },
      lessThen(filter, target){
        return target < filter ? true : false
      },
      notEqual(filter, target){
        return filter !== target ? true : false
      },

      filterNumber(filter, target){

        // console.log('filterNumber')
        // console.log(`${filter} x ${target}`)

        let mapSymbols = {
          '>': 'biggerThan',
          '<': 'lessThen',
          '!': 'notEqual'
        }
        
        let expression =  isNaN(parseInt(filter)) ? true : false
        if (expression) {
          let symbol = filter.charAt(0) in mapSymbols ? filter.charAt(0) : null
          // console.log(`::: ${symbol}`)
          if (symbol) {
            let intFilter = parseInt(filter.replace(symbol, ''))
            return this[mapSymbols[symbol]](intFilter, parseInt(target))
          } else {
            return false
          }
        } else {
          if (parseInt(filter) === parseInt(target)) {
            return true
          } else {
            return false
          }
        }
      },

      filterString(filter, target){
        if (filter.charAt(0) === '!') {
          return target.toString().toUpperCase().includes(filter.toString().replace('!', '').toUpperCase()) === false
        } else {
          return target.toString().toUpperCase().includes(filter.toString().toUpperCase())
        }
        
      },

      filterBody(bodyReceived) {

        const filters = {}
        for (let column of this.insideHeader) {
          if (column.filter && column.filterText.length > 0) {
            filters[column.field] = ('type' in column) ?  {value: column.filterText, type: column.type} : {value: column.filterText}
          }
        }

        // console.log(filters)

        const newBody = bodyReceived.filter(line => {

          // console.log(line)

          let lineCheck = []

          for (let filter in filters) {
            // console.log(filter)
            // console.log(`${typeof line[filter]} x ${'type' in filters[filter] ?  filters[filter].type : null}`)
            let typeFilter = 'type' in filters[filter] ?  filters[filter].type : typeof line[filter]
            // console.log(typeFilter)
            lineCheck.push(this.mapFunctionFilter(typeFilter, filters[filter].value, line[filter]))
            
          }

          // console.log(lineCheck)
         
          return !lineCheck.includes(false) 

        })

        // return this.setPages(newBody)
        this.setPages(newBody)
        return newBody
      },

      setPages(filteredBody) {

        try {

          if (this.pageLimit) {
        
            console.log('setPages')
            this.pagesIndex = []
            this.pages = []
            let limit = this.pageLimit
            let totalLines = filteredBody.length

            if (totalLines <= limit) {
              this.pages.push({data:filteredBody, selected: 0})
              this.pagesIndex.push(0)
            } else {
              let countPages = Math.ceil(totalLines / limit)
              let counterInit = 0
              let counterEnd = limit
              for (let indexPages = 0; indexPages < countPages - 1; indexPages++) {
                this.pagesIndex.push(indexPages)
                this.pages.push({data:filteredBody.slice(counterInit, counterEnd), selected: filteredBody.slice(counterInit, counterEnd).filter(item => item.SYARA_SEL).length})
                // if (indexPages === 0) {
                //     // this.pageCurrent = {index: 0, data: this.pages[0].data}
                // }
                counterInit = counterEnd
                counterEnd += limit 
              }
              this.pages.push({data:filteredBody.slice(counterInit), selected: filteredBody.slice(counterInit).filter(item => item.SYARA_SEL).length})
              this.pagesIndex.push(this.pagesIndex.length)
            }
          }

        } catch (error) {
          console.log(error)
        }

      },

      // Order tools

      async applyOrder(objectReceived, orderAsc, property){
        
        objectReceived.sort(function(obj1, obj2){
          if(orderAsc){
            if (obj1[property] < obj2[property]){
                return -1
            }else if (obj1[property] > obj2[property]){
                return 1
            }else{
                return 0
            }
          }else{
            if (obj1[property] < obj2[property]){
                return 1
            }else if (obj1[property] > obj2[property]){
                return -1
            }else{
                return 0
            } 
          }  
        })

      },

      async orderData(theadProp, tbodyData, targetIndex){
          try {
            // console.log(event)
            let colData = 'field'
            // let targetIndex = event.target.id
            // console.log(targetIndex)
            
            for (let columnKey in theadProp) {
              let column = theadProp[columnKey]
              if(columnKey==targetIndex){
                column.asc = column.asc ? !column.asc : true 
                if ('fieldOrder' in column) {
                  colData = 'fieldOrder';
                }
              } else {
                column.asc = null
              }
            }
            let orderAsc = theadProp[targetIndex].asc
            let propertyOrder = theadProp[targetIndex][colData]
            await this.applyOrder(tbodyData, orderAsc, propertyOrder)
          } catch (error) {
            console.log(error)
          }

      },


      // Callback action 

      clickLink(callbackFunction, line){
          console.log('Syara Table > clickLink')
          if (callbackFunction && line) {
            this.$emit('callbackFunctions', [callbackFunction, line])
          } 
          // else {
          //   console.log('Error: No callback function defined or line empty')
          // }
          
      },

    }

}
</script>


<style scoped>

/******************************************************

Material Icons

******************************************************/
@import '~material-design-icons/iconfont/material-icons.css';
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}

.material-icons.md-16 { font-size: 16px; }
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/******************************************************

system controls

******************************************************/
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555; 
}


/******************************************************

fonts

******************************************************/
@font-face { 
    font-family: 'Futura Bold';
    src: url('../assets/fonts/futurab.woff'); 
}
@font-face { 
    font-family: 'Futura Normal';
    src: url('../assets/fonts/futuran.woff'); 
}

.syara-table-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-family: 'Futura Normal', Helvetica, Arial, sans-serif;

}

.invisible-set-pages {
  display: none;
}

.syara-table-container > table {
  position: relative;
  width: 100%;
}

table {
  text-align: center;
  max-width: 100%;
}

table thead tr th {
  padding: 3px;
}
table tbody tr td {
  padding: 3px;
  word-wrap: break-word;
}




.header-filter {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 6px 3px;
  box-sizing: border-box;
}
.header-filter input {
  width: 100%;
}

.footer-line {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}

.syara-table-actions-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.syara-table-actions {
  position: relative;
  display: flex;
  /* gap: 4px; */
  justify-content: center;
  align-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 3px;
}
.syara-table-actions:hover span {
  color: #00B5E5;
}
.syara-table-actions:hover svg {
  fill: #00B5E5;
}

.syara-table-actions-info {
  margin-right: 3px;
}
.syara-table-actions-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.syara-table-actions-icon:hover svg {
  fill: #00B5E5;
}

.syara-table-actions-icon:hover span {
  color: #00B5E5;
}

.syara-table-actions:hover svg {
  fill: #00B5E5;
  
}

.syara-table-actions-icon svg:hover {
  fill: #00B5E5;
  
}

.syara-table-labels-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.syara-table-labels span{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 3px 6px;
  border-radius: 6px;
  background: #3A4859;
  color: #ffffff;
  margin: 0 2px;
  word-wrap: break-word;
  word-break: break-all;
}


.syara-table-label-index {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 3px 6px;
  border-radius: 6px;
  background: #3A4859;
  color: #ffffff;
  margin: 0 2px;
  word-wrap: break-word;
  word-break: break-all;
}


.tooltip-host::after {
  display: none;
  transition: display 0.2s;
}

/* table tbody tr td .syara-table-labels:hover .tooltip-host::after {
  content: attr(tool-tip-attr);
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 60px;
  width: auto;
  background: #3A4859;
  border-radius: 6px;
  color: #ffffff;
  padding: 4px 8px;
  opacity: 0.9;
  z-index: 10;
}

table tbody tr td .syara-table-labels:hover .tooltip-host::before {
    content:'';
    display:block;
    width:0;
    height:0;
    position: absolute;
    border-top: 8px solid #3A4859 ;
    border-bottom: 8px solid transparent  ;
    border-right: 8px solid transparent ;
    border-left: 8px solid transparent ;
    opacity: 0.9; 
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
} */
/* :first-of-type */
table tbody tr td .syara-table-labels:hover .tooltip-host::after {
  content: attr(tool-tip-attr);
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  clear: both;
  top: calc(103% + 16px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 60px;
  width: auto;
  height: auto;
  background: #3A4859;
  border-radius: 6px;
  color: #ffffff;
  padding: 4px 8px;
  opacity: 0.9;
  z-index: 10;
}

table tbody tr td .syara-table-labels:hover .tooltip-host::before  {
  content:'';
  display:block;
  width:0;
  height:0;
  position: absolute;
  border-top: 8px solid transparent ;
  border-bottom: 8px solid #3A4859   ;
  border-right: 8px solid transparent ;
  border-left: 8px solid transparent ;
  opacity: 0.9; 
  top: 103%;
  left: 50%;
  transform: translateX(-50%);
}

.header-tooltip{
  position: relative;
}

.header-tooltip:hover::after{
  content: attr(attr-tooltip-text);
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  width: auto;
  background: #3A4859;
  border-radius: 6px;
  color: #ffffff;
  padding: 4px 8px;
  opacity: 0.9;
  z-index: 10;
}
.header-tooltip:hover::before {
    content:'';
    display:block;
    width:0;
    height:0;
    position: absolute;
    border-top: 8px solid #3A4859 ;
    border-bottom: 8px solid transparent  ;
    border-right: 8px solid transparent ;
    border-left: 8px solid transparent ;
    opacity: 0.9; 
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
} 


.footer-pages {

  position: relative;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  max-width: 400px;
  overflow-x: hidden;

}


/******************************************************

syara-table-syara-light

******************************************************/
/* @import '../assets/styles/the-syara-table-syara-light.css'; */

/******************************************************

syara theme light

******************************************************/

.syara-table-title {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    color:#3A4859;
    padding: 0 2px;
    width: 100%;
    font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
    font-size: 1.550em;
    font-weight: 800;
    margin-bottom: 10px;
    box-sizing: border-box;

}

.syara-light{
    width: 100%;
    border: 0;
    margin:auto;
    border-spacing: 0;
    font-size: 1em;
    background-color: #ffffff;
    
}

/******************************************************

thead styles

******************************************************/

.syara-light > thead > tr{

    height: 30px;
    max-height: auto;
    font-size: 1em;
    
}

.syara-light > thead > tr > th.th{
    position: relative;
    cursor: pointer;
    text-align: center;
    color:#3A4859;
    font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
    height: 100%;
}

.syara-light > thead > tr > th.th > div {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    height: 100%;
    padding: 0 3px;
    box-sizing: border-box;
}

.syara-light > thead > tr > th.th > div > .no-filter{
    display: block;
    position: relative;
    text-align: center;
    height: 24px;
    line-height: 24px;
    padding: 3px 5px;
}

.syara-light > thead > tr > th.th > div > .header-filter{
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    border: 1px solid #D0E0E3;
    border-radius: 4px;
    text-align: center;
    cursor: text;
    height: 24px;
    line-height: 24px;
    width: 100%;
    padding: 2px 1px;
    margin-bottom: 5px;
    font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
    
}
.syara-light > thead > tr > th.th > div > .header-empty{
    display: block;
    position: relative;
    text-align: center;
    cursor: text;
    height: 24px;
    line-height: 24px;
    padding: 2px 5px;
    font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
    
}
.syara-light > thead > tr > th.th > div > .filtro-checkbox{
    display: block;
    position: relative;
    border-radius: 4px;
    text-align: center;
    cursor: text;
    height: 26px;
    line-height: 26px;
    padding: 3px;
    
}
.syara-light > thead > tr > th.th > div > .header-filter > input{
    display: block;
    position: relative;
    width: calc(100% - 3px);
    border: 0;
    outline: none;
    height: 16px;
    
}

.syara-light > thead > tr > th.th > div > .header-text{
    
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    font-size: 1em;
    width: 100%;
}

.syara-light > thead > tr > th.th > div > .header-text span {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.syara-light > thead > tr > th.th-maior{
    width: 14%;
}
.syara-light > thead > tr > th.th-maior2{
    width: 10%;
}
.syara-light > thead > tr > th.th-maior3{
    width: 12%;
}
.syara-light > thead > tr > th.th:hover{
    color: #006699;

}
.syara-light thead tr {
    display: table;
    
    table-layout: fixed;
}



/******************************************************

tbody styles

******************************************************/

.syara-light > tbody{
    display: block;
    border-top: 1px solid #D0E0E3;
    overflow-y: scroll;
}

.syara-light  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}


.syara-light > tbody > tr > td{

    
    min-height: 30px;
    max-height: auto;
    max-width: 300px;
    /* overflow: hidden; */
    /* word-wrap: break-word; */
    padding: 10px 3px;
    font-size: 1em;
}

.syara-light > tbody > tr:nth-child(2n) > td {
    background-color: #EFF5F6;
}


.syara-light > tbody > tr > td .acoes {
    position: relative;
    display: inline-block;
    width: auto;
    margin-right: 10px;
}
.syara-light > tbody > tr > td .acoes span{
    margin-right: 5px;
}

.syara-light tbody tr.tr-x td{
    color: #ff0000;
}
.syara-light tbody tr td.td-hover{
    background-color: #EFF5F6;
    
}
.syara-light > tbody > tr:nth-child(2n) > td.td-hover {
    background-color: #deeaed;
}

.syara-light > tbody > tr > td.td-maior{
    width: 14%;
}
.syara-light > tbody > tr > td.td-maior2{
    width: 10%;
}
.syara-light > tbody > tr > td.td-maior3{
    width: 12%;
}
.syara-light > tbody > tr:hover > td{
    background-color: #cceeff;
    
}

.syara-light > tbody > tr.sel > td{
    background-color: #99ffcc;
    color:#00994d;
    cursor: pointer;
}

.lights-container{
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.lights{
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    
    border-radius: 50px;
    width: 30px;
    height: 30px;
    
}


.syara-light > tfoot{
    display: block;
    height: 30px;
    background-color: #D0E0E3;
    border-top: 1px solid #B3C7CB;
    box-sizing: border-box;
}

.syara-light > tfoot tr{
    display: table;
    height: 28px;
    width: 100%;
    background-color: #D0E0E3;
    box-sizing: border-box;
}

.footer-text {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    font-weight: 400;
    font-size: 1.250em;
    gap: 4px;
}

.linhas-selecionadas{
    display: inline-block;
    position: relative;
    height: 26px;
    line-height: 24px;
    width: auto;
    text-align: center;
    background: #ffffff;
    border: 1px solid #B3C7CB;
    border-radius: 3px;
    margin: 0 5px;
    padding: 0 5px;
    
}

.pages{
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
   

}

.pages span{
    
    margin-right: 2px;
}

.page{
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    position: relative;
    height: 24px;
    line-height: 24px;
    font-size: 11px;
    width: 24px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #B3C7CB;
    border-radius: 50px;
    margin: 0 1px;
    cursor: pointer;

}

.page-dots {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    position: relative;
    height: 24px;
    line-height: 24px;
    width: 24px;
    text-align: center;

}

.page .itens-sel{
    position: absolute;
    display: block;
    height: 6px;
    width: 6px;
    top: -1px;
    right: -1px;
    background: #00B5E5;
    border-radius: 50px;
    border: 1px solid #ffffff;
}

.page-sel{
    font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
    background: #48586C;
    color:#FFFFFF;/*#3A4859*/
    border: 1px solid #3A4859;
    
}


.page:hover{
    background: #EFF5F6;
    color:#3A4859;
    
    
}


.icone{
    cursor: pointer;
    color:#2277aa;

}

.icone:hover{
    color:#081d2b;
}

.icone-alt{
    cursor: pointer;
    color:#00cc66;

}

.icone-alt:hover{
    color:#00331a;
}
.invisivel{
    font-size: 1px;
}


/******************************************************

syara-table-syara-dark :: TODO

******************************************************/
.syara-dark {
  background: #000000;
  color: #ffffff;
}

</style>