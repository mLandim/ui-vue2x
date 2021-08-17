<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div class="table-container">
      <SyTable 
      :header="tHeader" 
      :body="tBody" 
      :pageLimit="40" 
      :bodyHeight="600" 
      :selectionField="true" 
      :bodyLoading="loading"
      :labelsList="tooltipList"
      @selectedLines="selectedItens=$event" 
      @callbackFunctions="manageCallbackFunctions($event)" />

      <!-- :lineClick="'lineClickCallback'" -->
  </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
   data() {
    return {
    
      tHeader: [
        {text: 'Id', field: 'id', filter: true, asc: true},
        {text: 'Album Id', field: 'albumId', filter: true },
        {text: 'Title', field: 'title', filter: true },
        {text: 'Url', field: 'url', filter: true},
        {text: 'Thumb', field: 'thumbnailUrl', filter: true},
        {text: 'Actions', actions:[
          {
            callback:'testReturnFunction', 
            info: 'id', 
            mdIcon: 'attach_file',
            mdIconSize: 18 
            
            // icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>'
          },
          {
            callback:'testReturnFunction2', 
            info: 'id', 
            mdIcon: 'message',
            mdIconSize: 18
          },
          
        ] 
        },
        {
          text: 'Labels',
          labels: [
            {field: 'albumId', byIndex:true}
          ]
        },
        {
          text: 'Labels 2',
          labels: [
            {field: 'thumbnailUrl', color: '#FEB21E'}
          ]
        }

      ],

      tBody: [
        {name: 'Nome Primeiro', age: 23},
        {name: 'Nome Segundo', age: 7}
      ],

      selectedItens: [],
      loading: false,
      
      tooltipList: {
        1: 'test 1 just ot see if this could work',
        2: 'test 2',
        3: 'test 3',
        4: 'test 4'
      }

    }
  },
  created(){

    // https://jsonplaceholder.typicode.com/photos
    // https://jsonplaceholder.typicode.com/comments
    this.getDataAxios()

  },
  methods: {

    async getDataAxios(){
      this.loading = true
      let response = await axios.get('https://jsonplaceholder.typicode.com/photos')
      this.tBody = response.data
      this.loading = false
    },

    manageCallbackFunctions(event) {
      console.log('manageCallbackFunctions')
      console.log(event)
      this[event[0]](event[1])
    },

    testReturnFunction(e){
      console.log('testReturnFunction')
      console.log(e)

    },

    testReturnFunction2(e){
      console.log('testReturnFunction2')
      console.log(e)

    },

    lineClickCallback(e){
      console.log('lineClickCallback')
      console.log(e)

    },


  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.table-container {
  font-size: 11px;
}
</style>
