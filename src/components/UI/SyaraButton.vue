<template>
    
        <div class="s-btn" :class="[tipo, size, mr]" :style="stl" @click="clicar" >
            <font-awesome-icon v-if="icone" :icon="icone" fixed-width />
            {{texto}}
        </div>
    
</template>

<script>
export default {
    name:'SyaraButton',
    props:{
        texto: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            default: 'neutro'
        },
        size:{
            type: String,
            default: 'sz-normal'
        },
        mr:{
            type: String,
            default: 'mr-1'
        },
        icone: {
            type: Array,
            required: false
        },
        stl: {
            type: String,
            required: false
        }
       
    },
    methods:{
        clicar(){
            this.$emit('clicar')
        }
    }
}
</script>

<style scoped>

@font-face { 
    font-family: 'Futura Bold';
    src: url('../../assets/fonts/futurab.woff'); 
}
@font-face { 
    font-family: 'Futura Normal';
    src: url('../../assets/fonts/futuran.woff'); 
}
   
    .s-btn{
        display: inline-block;
        position: relative;
        width: auto;
        cursor: pointer;
        transition: background-color 0.6s, color 0.6s, border 0.6s;
        box-sizing: border-box;
    }

    /* configuração de tamanho */
    .sz-normal{
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        padding: 0 10px;
    }

    .sz-sm{
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        padding: 0 5px;
    }

    .sz-lg{
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        padding: 0 15px;
    }
    .sz-2x{
        height: 60px;
        line-height: 60px;
        font-size: 22px;
        padding: 0 15px;
    }

    /* margens (right) */
    .mr-0{
        margin-right: 0px;
    }

    .mr-1{
        margin-right: 10px;
    }

    .mr-2{
        margin-right: 20px;
    }

    /* estilo principal */
    .principal{
        background-color: #F39200;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        border: 1px solid #F39200;
        color:#ffffff;
        
        text-align: center;
    }
    .principal:hover{
        background-color: #F9B000;
        border: 1px solid #F9B000;
    }

    /* estilo principal */
    .perigo{
        background-color: #F9765E;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        border: 1px solid #F9765E;
        color:#ffffff;
        
        text-align: center;
    }
    .perigo:hover{
        background-color: #FC8A76;
        border: 1px solid #FC8A76;
    }

    /* estilo neutro */
    .neutro{
        background-color: #ffffff;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        border: 1px solid #54BBAB;
        color:#48586C;
        text-align: center;
    }
    .neutro:hover{
        background-color: #0071CF;
        border: 1px solid #0071CF;
        color:#FFFFFF;
    }

     /* estilo neutro */
    .confirmar{
        background-color: #A1B911;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        border: 1px solid #A1B911;
        color:#ffffff;
        text-align: center;
    }
    .confirmar:hover{
        background-color: #AFCA0B;
        border: 1px solid #AFCA0B;
        color:#FFFFFF;
    }

</style>
