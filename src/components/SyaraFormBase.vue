<template>
    <div class="ml-floating-form">

        <div class="mask" @click="closeForm"></div>
        
        <div class="container-ml-floating-form" :style="`width:${width}`">

            <!-- Form title  -->
            <div class="form-title">
                <span>{{dataForm.title}}</span>
                 <b-badge variant="light" class="ico"  @click="closeForm" >
                    <font-awesome-icon size="lg" :icon="['fas', 'times']"  />
                </b-badge>
            </div>

            <!-- Form Body  -->
            <div class="form-body">

                <!-- form information  -->
                <div class="form-info" v-if="dataForm.info" v-html="dataForm.info">
                </div>

                <!-- each line  -->
                <div class="form-line" :class="{'form-line-border' : dataForm.lineBorder}" v-for="(line, indexLines) in dataForm.gridLines" :key="indexLines">
                    
                    <!-- each field in line  -->
                    <template v-for="(field, index) in line" >

                        <!-- container input  -->
                        <div :key="index" class="form-field" :style="`width:${field.width};`"  @mouseleave="helpShow=null">
                            
                            <!-- label and help  -->
                            <label :for="`input-id-${index}`">
                                <span>{{field.label}}</span>
                                <span class="input-required-ico" v-if="field.required" >*</span>
                                <!-- <span class="input-help-ico" v-if="field.help" @mouseover="helpShow=index" >?</span> -->
                                <span class="input-help-ico" v-if="field.help"  :id="'popover-help-'+index" >?</span>
                               
                            </label>

                            <!-- Boolean: Checkbox  -->
                            <div class="input-checkbox" v-if="field.type === 'boolean'" >
                                <font-awesome-icon  :icon="['far', 'check-square']" size="lg" v-if="field.value" @click="field.value = 0" />
                                <font-awesome-icon  :icon="['far', 'square']" size="lg" v-else  @click="field.value = 1"/>
                                <!-- <input  type="checkbox" id="checkbox" v-model="field.value"> -->
                            </div>

                            <!-- Select  -->
                            <div 
                            v-else-if="field.type === 'select'"
                            class="input-select" 
                            :class="{ 'input-normal': errors.includes(index) === false,  'input-error' : errors.includes(index) }" 
                            @click="(selectOptionsShow === index) ? selectOptionsShow=null :selectOptionsShow=index"
                            @mouseleave="selectOptionsShow=null"
                            >
                                <!-- :value="isArray(field.options) ? field.value : field.options[field.value]"  -->
                                <input 
                                type="text" 
                                :id="`select-input-id-${index}`"
                                :ref="`select-input-id-${index}`" 
                                v-model="field.value"
                                
                                :maxlength="(field.maxlength) ? field.maxlength: null"
                                @blur="(field.validation) ? fieldValidation(index, field, field.validation) : emptyFunction"
                                readonly
                                
                                >
                                <div class="input-select-mask">
                                
                                    <template v-if="field.value.length > 0 || typeof field.value == 'number'">
                                        <span class="select-show" v-if="field.valueType && field.valueType == 'value'">{{field.value}}</span>
                                        <span class="select-show" v-else>{{field.options[field.value]}}</span>
                                    </template>
                                    <span class="select-show" v-else>{{field.show ? field.show : ''}}</span>

                                    <span class="input-select-arrow">
                                        <font-awesome-icon  :icon="['fas', 'angle-up']" size="lg" v-if="selectOptionsShow === index"  />
                                        <font-awesome-icon  :icon="['fas', 'angle-down']" size="lg" v-else  />
                                    </span>

                               </div>

                                <div class="select-absolute-options" v-show="selectOptionsShow === index">
                                    <!-- if type of options is Array  -->
                                    <template v-if="isArray(field.options)">
                                        <div 
                                        class="options-itens" 
                                        v-for="(opt, indexOpt) in field.options" :key="indexOpt" 
                                        @click="updateSelect(field, indexOpt, opt)"
                                        >
                                            {{opt}}
                                        </div>

                                    </template>
                                    <!-- if it is an Object -->
                                    <template v-else>
                                        <div 
                                        class="options-itens" 
                                        v-for="(opt, indexOpt) in field.options" :key="indexOpt" 
                                        @click="updateSelect(field, indexOpt, opt)"
                                        >
                                            {{opt}}
                                        </div>
                                    </template>
                                    
                                </div>

                            </div>

                            <!-- Pills -->
                            <div class="input-pills" v-else-if="field.type === 'pills'">
                                
                                <div class="pill-select-all" @click="selectAllPills(field)">
                                    <font-awesome-icon :icon="['fas', 'check-square']" size="lg"  fixed-width v-if="checkSelectedAll(field) === true"  />
                                    <font-awesome-icon :icon="['far', 'square']" size="lg"  fixed-width v-else  />
                                    <span >Selecionar Todos</span>
                                </div>

                                <div class="pills-container">
                                    <div class="pill-option"
                                    :class="{'pill-selected' : checkSelectedPill(field, pill) === true }" 
                                    :style="( typeof field.options[pill] ==='object' && 'color' in field.options[pill]) ? `background-color:${field.options[pill].color}; color:${fontColorFix(field.options[pill].color)};`  : ''" 
                                    v-for="pill in Object.keys(field.options)" 
                                    :key="pill" 
                                    @click="updatePillsValue(field, pill)"
                                    >
                                        <font-awesome-icon :icon="['fas', 'check-square']" size="lg"  fixed-width v-if="checkSelectedPill(field, pill) === true"  />
                                        <font-awesome-icon :icon="['far', 'square']" size="lg"  fixed-width v-else  />
                                        <span v-if="typeof field.options[pill] ==='object' && 'text' in field.options[pill]">{{field.options[pill].text}}</span>
                                    </div>
                                </div>
                                
                            </div>

                            <!-- textarea  -->
                            <div class="input-mask-textarea" :class="{ 'input-normal': errors.includes(index) === false,  'input-error' : errors.includes(index) }" v-else-if="field.type === 'textarea'">
                                <textarea 
                                v-if="field.type === 'textarea'" 
                                :id="`input-id-${index}`" 
                                v-model="field.value" 
                                :placeholder="field.placeholder"
                                :maxlength="field.maxlength"
                                @blur="(field.validation) ? fieldValidation(index, field, field.validation) : emptyFunction"
                                ></textarea>

                            </div>

                            <!-- Input text and Number  -->
                            <div class="input-mask" :class="{ 'input-normal': errors.includes(index) === false,  'input-error' : errors.includes(index) }" v-else>
                                
                                <input 
                                v-if="field.type === 'text'" 
                                type="text" 
                                :id="`input-id-${index}`" 
                                v-model="field.value" 
                                :placeholder="field.placeholder"
                                :maxlength="(field.maxlength) ? field.maxlength: null"
                                @blur="(field.validation) ? fieldValidation(index, field, field.validation) : emptyFunction"
                                >

                                <input 
                                v-if="field.type === 'number'" 
                                type="text" 
                                :id="`input-id-${index}`" 
                                v-model="field.value" 
                                :placeholder="field.placeholder"
                                :maxlength="(field.maxlength) ? field.maxlength: null"
                                @keypress="isNumber($event)"
                                @blur="(field.validation) ? fieldValidation(index, field, field.validation) : emptyFunction"
                                >

                                <!-- v-mask="dateMask"  -->
                                <input 
                                v-if="field.type === 'date'" 
                                
                                :id="`input-id-${index}`" 
                                v-model="field.value" 
                                placeholder="dd/mm/aaaa"
                                maxlength="10"
                                @blur="(field.validation) ? fieldValidation(index, field, field.validation) : emptyFunction"
                                >
                                <!-- <b-form-datepicker style="height:100%;"
                                v-if="field.type === 'date'" 
                                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                                locale="pt"
                                size='sm'
                                v-model="field.value" 
                                ></b-form-datepicker> -->
                                
                                
                            </div>
                            <div class="textarea-limit-length" v-show="field.type === 'textarea'">
                                Restam {{ field.maxlength - field.value.length }} caracteres
                            </div>


                            <!-- Errors and Info / Help  -->
                            <transition name="fade">
                            <div class="input-error-text" v-show="errors.includes(index)">
                                {{field.error}}
                            </div>
                            </transition>
                            <transition name="fade">

                                <!-- <div class="input-help-text" v-show="field.help && helpShow===index" v-html="field.help"> 
                                    <span v-if="field.required" style="margin-bottom:6px;"><b>Obrigatório</b></span>
                                    {{field.help}}
                                </div> -->

                                <b-popover :target="'popover-help-'+index" triggers="hover" placement="top">
                                    <template #title>{{field.label}}</template>
                                    <div v-if="field.required" style="margin-bottom:6px;"><b>* Campo Obrigatório</b></div>
                                    <div v-html="field.help"></div>
                                </b-popover>


                            </transition>
                          

                        </div>

                    </template>

                </div>




            </div>

            <!-- Commands  -->
            <div class="form-commands-mock"></div>
            <div class="form-commands">

                <!-- result from command  -->
                <div class="commands-result">
                    <span v-if="result.context" :class="`context-${result.context}`">
                        {{result.text}}
                    </span>

                </div>

                <!-- buttons commands  -->
                <div class="commands-buttons">

                    <template v-if="result.context !== 'hold' ">

                        <!-- cancel  -->
                        <Botao
                        :texto="dataForm.closeContext.text" :tipo="'neutro'" 
                        :size="'sz-normal'" 
                        :icone="['fas', 'times']"  
                        :mr="'mr-1'"
                        @clicar="closeForm()"  ></Botao>

                        <!-- reset  -->
                        <Botao v-if="dataForm.resetContext"
                        :texto="dataForm.resetContext.text" :tipo="'perigo'" 
                        :size="'sz-normal'" 
                        :icone="['fas', 'trash']"  
                        :mr="'mr-4'"
                        @clicar="reset()"  ></Botao>

                        <!-- ok  -->
                        <Botao
                        :texto="dataForm.okContext.text" :tipo="'principal'" 
                        :size="'sz-normal'" 
                        :icone="['fas', 'check']"  
                        :mr="'mr-0'"
                        @clicar="ok()"  ></Botao>

                    </template>
                    
                </div>

            </div>

        </div>

    </div>

</template>

<script>

/**
 * @author Marcelo Landim
 * @date 16/04/2021
 * @version 0.2.0
 * 
 * 
 */

// import {mapGetters, mapActions} from 'vuex'
import Botao from '@/components/UI/SyaraButton.vue'
// import Aguarde from '@/components/UI/Aguarde.vue'
// import AwesomeMask from 'awesome-mask'

export default {
    name: 'SyFormBase',
    components: {
        Botao,
        // Aguarde
    },
    directives:{
        // 'mask':AwesomeMask
    },
    props: {

        /**
         * Width of the form in px ou %
         * @default 70%
         * @example '70%', '300px'
         */
        width: {
            type: String,
            required: false,
            default: '70%'
        },
        /**
         * Object with all controls of the form
         */
        dataForm: {
            type: Object,
            required: true
        },
       



    },
    data() {
        return {
            dateMask: '99/99/9999',
           
            result: {
                context: null,
                text: ''
            },

            errors: [],
            helpShow: null,
            selectOptionsShow: null,

            allPillsSelected: false

        }
    },
    computed: {

        dataMirror: function () {

            return this.dataForm
        }
        
    },
    methods: {

        updateSelect(field, key, value){

            if (field.valueType && field.valueType == 'value') {
                field.value = value
                 
            } else {
                field.value = key
            }

            field.show = value

        },

        selectAllPills(field){
            let separator = field.valueSeparator || ','
            let newValue = field.value.length > 0 ? field.value.split(separator) : []
            if(newValue.length >= 1) {
                this.allPillsSelected = false
                field.value = ''
                
            } else {
            
                for (let op in field.options) {
                    let currentValue = op
                    if (field.valueType && field.valueType == 'value') {
                        currentValue = field.options[op].text
                    } 
                    // if (newValue.includes(currentValue)) {
                    // } else {
                    //     newValue.push(currentValue)
                    // }
                    if (newValue.includes(currentValue) === false) {
                        newValue.push(currentValue)
                    }
                }
                this.allPillsSelected = true
                field.value = newValue.join(separator)

            }
        },

        checkSelectedAll(field) {
            let separator = field.valueSeparator || ','
            
            let newValue = field.value.length > 0 ? field.value.split(separator) : []
            if (newValue.length === Object.keys(field.options).length) {
                return true
            } else {
                return false
            }
        },

        checkSelectedPill(field, key) {
            let separator = field.valueSeparator || ','
            let receivedValue = key
            if (field.valueType && field.valueType == 'value') {
                receivedValue = field.options[key].text
            } 

            let newValue = field.value.length > 0 ? field.value.split(separator) : []
            if (newValue.includes(receivedValue)) {
                return true
            } else {
                return false
            }

        },
        updatePillsValue(field, key) {
            let separator = field.valueSeparator || ','
            let receivedValue = key
            if (field.valueType && field.valueType == 'value') {
                receivedValue = field.options[key].text
            } 

            let newValue = field.value.length > 0 ? field.value.split(separator) : []
            if (newValue.includes(receivedValue)) {
                newValue.splice(newValue.indexOf(receivedValue), 1)
            } else {
                newValue.push(receivedValue)
            }
            field.value = newValue.join(separator)
        },

        isArray(item) {
            return item instanceof Array
        },

        closeForm() {
            this.dataForm.closeContext.action()
        },

        async reset() {

            let resp = confirm('Os dados deste formulário serão apagados. Deseja continuar?')
            console.log(resp)
            if(resp) {
                this.result = {context: 'hold', text: 'Aguarde...'}
                this.result = await this.dataForm.resetContext.action(this.dataForm.fields)
            }
           

        },

        async ok() {
            console.log('ok')

            this.result = {context: 'hold', text: 'Aguarde...'}
            // console.log('fields')
            // console.log(this.dataForm.fields)
            // check validations 
            for(let line of this.dataForm.gridLines) {
                for (let fieldKey in line ) {
                    // console.log(`${fieldKey} >> ${this.dataForm.fields[fieldKey].validation}`)
                    if(line[fieldKey].validation) {
                        // console.log(`${fieldKey} >> validation ok`)
                        await this.fieldValidation(fieldKey, line[fieldKey], line[fieldKey].validation)
                    } else {
                        // console.log(`${fieldKey} >> validation não`)
                        await this.fieldValidation(fieldKey, line[fieldKey], null)
                    }
                }

            }
            

            if (this.errors.length > 0) {
                this.result = {context: 'error', text: 'Corrija os erros de validação no formulário'}
            } else {
                this.result = await this.dataForm.okContext.action(this.dataForm.gridLines)
            }
            
            

        },

        async fieldValidation(index, field, validationFunction) {

            console.log('fieldValidation')
            let result = null 
            let checkRequired = true
            let requiredText = 'Campo obrigatório'

            // Se o chave requiredFields for setada :: verifica se existe o objeto tem chave impose 
            // e define texto padrão com chave requiredText (se existir) ou valor padrão
            if(this.dataForm.requiredFields){
                // Se tiver chave impose :: checkRequired assume o valor de impose
                if(this.dataForm.requiredFields.impose){
                    checkRequired = this.dataForm.requiredFields.impose
                } 

                requiredText = this.dataForm.requiredFields.requiredText || 'Campo obrigatório'
            } 

            // checkRequired for verdadeiro :: avalia campo
            if (checkRequired) {
                if (field.required && field.value === '') {
                    result = {
                        error: requiredText
                    }
                }
            }

            // se existe uma função de validação e resultado de required for null
            if (validationFunction && result == null) {
                result = await validationFunction(field.value)
            }
            

            console.log(result)
            // Atualiza lista de erros se result !== null
            if (result) {
                // acrescenta chave error ao campo
                field.error = result.error
                // Inclui o campo na lista de erros
                this.errors.indexOf(index) === -1 ? this.errors.push(index) : null
               
            } else {
                //
                delete field.error
                this.errors.indexOf(index) !== -1 ? this.errors.splice(this.errors.indexOf(index), 1) : null
            }

            console.log(index)
            console.log(this.errors)


        },

        isNumber(evt) {
            evt = (evt) ? evt : window.event
            var charCode = (evt.which) ? evt.which : evt.keyCode
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault()
            } else {
                return true
            }
        },

        filteredOptions(field, index) {

            // let valueFilter = document.getElementById(`select-input-id-${index}`).value
            let returnedObject = {}
            let valueObject = this.$refs[`select-input-id-${index}`]
            if(valueObject) {

                let valueFilter = this.$refs[`select-input-id-${index}`][0].value
                console.log(valueFilter)
                
                for (let item in field.options) {
                    if ( field.options[item].toLowerCase().includes(index.toLowerCase())) {
                        returnedObject[item] = field.options[item]
                    }
                }

                return returnedObject

            } else {

                return field.options
            }
          
            

        },

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

        emptyFunction() {

        }
        
    },

}
</script>

<style scoped> 
@font-face { 
    font-family: 'Futura Bold';
    src: url('../assets/fonts/futurab.woff'); 
}
@font-face { 
    font-family: 'Futura Normal';
    src: url('../assets/fonts/futuran.woff'); 
}

    .ml-floating-form {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        
        top: 0;
        right: 0;
        height: 100vh;
        width: 100vw;
        z-index: 50;

    }

    .mask {
        position: fixed;
        display: block;
        top: 0;
        right: 0;
        height: 100vh;
        width: 100vw;
        background: #48586C;
        opacity: 0.6;
        z-index: 60;
    }

    .ico {
        cursor: pointer;
    }

    .container-ml-floating-form{
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        /* width: 70%; */
        height: auto;
        min-height: 200px;
        max-height: calc(100vh - 40px);
        background: #FFFFFF;
        border-radius: 8px;
        z-index: 70;
        box-sizing: border-box;
        overflow: visible;
    }

    .form-title{
        display: flex;
        position: relative;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 10px;
        border-bottom:1px solid #EFF5F6;
        color: #3A4859;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        box-sizing: border-box;
    }

    .form-title span {
        display: flex;
        position: relative;
        align-content: center;
    }

    .form-body {
        display: flex;
        position: relative;
        flex-direction: column;
        width: 100%;
        height: auto;
        max-height: 610px;
        overflow-y: auto;
        padding: 30px 10px;
        box-sizing: border-box;
        /* overflow: visible; */
    }

    .form-info{
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: center;
        margin:0 6px;
        margin-bottom: 30px;
        padding-bottom: 30px;
        background: #EFF5F6;
        font-size: 0.750rem;
        border-radius: 6px;
        padding: 6px;
        color: #48586C;
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
    }

    .form-line {
        display: flex;
        position: relative;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        
    }

    .form-line-border{
        border-bottom: 1px solid #EFF5F6;
    }

    .form-field{
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 3px 6px;
        overflow: visible;
    }
    .textarea-limit-length{
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
        font-size: 0.650rem;
        color: #5F758F;
        padding-left: 6px;
    }
    .input-error-text {
        display: flex;
        position: relative;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        background-color: #fff2f2;
        color:#ff0000;
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
        height: auto;
        width: 100%;
        padding: 3px 6px;
        font-size: 11px;
        border-left: 1px solid #ff6262;
        margin-top: 2px;
        border-radius: 6px;
    }
    .input-help-text {
        display: flex;
        position: absolute;
        bottom: 100%;
        left:3px;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #EFF5F6;
        color:#3A4859;
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
        min-height: 20px;
        height: auto;
        line-height: 20px;
        word-wrap:normal;
        width: calc(100% - 6px);
        padding: 8px;
        font-size: 12px;
        border-left: 1px solid #B3C7CB;
        margin-top: 2px;
        border-radius: 6px;
        transition: opacity 0.3s;
        
        
    }

    .input-help-text span {
        padding: 4px 0;
    }
    .input-help-text div {
        padding: 4px 0;
    }

    .form-field label {
        display: flex;
        position: relative;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        margin-bottom: 2px;
        font-size: 12px;
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
        color: #48586C;
        padding-left: 5px;
    }

    .input-required-ico{
        display: flex;
        position: relative;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin: 0 3px;
        width: 18px;
        height: 18px;
        /* background: #D0E0E3; */
        color: #ff0000;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        /* border-radius: 50%; */
        cursor: pointer;
        
    }

    .input-help-ico{
        display: flex;
        position: relative;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin: 0 3px;
        width: 18px;
        height: 18px;
        font-size: 10px;
        background: #D0E0E3;
        /* border: 1px solid #D0E0E3; */
        color: #3A4859;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        border-radius: 50px;
        cursor: pointer;
        
    }
    .input-help-ico:hover{
        background: #EFF5F6;
    }

    .input-help-ico:hover \ .input-help-text {
        display: flex;
    }

   

    .form-field .input-select{
        display: flex;
        justify-content: space-between;
        position: relative;
        width: 100%;
        padding: 2px 0;
        border-radius: 5px;
        overflow: visible;
        height: 30px;
    }

    .input-select-mask{
        display: flex;
        justify-content: space-between;
        align-content: center;
        background-color: #ffffff;
        width: 100%;
        z-index: 80;
    }

  
    .select-show {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin-left: 5px;
    }

    .input-select-arrow {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin-right: 5px;
    }

    .select-absolute-options{
        display: flex;
        position: absolute;
        flex-direction: column;
        border-bottom: 1px solid #B3C7CB;
        border-left: 1px solid #B3C7CB;
        border-right: 1px solid #B3C7CB;
        min-height: 40px;
        width: calc(100% + 2px);
        top: 20px;
        left: -1px;
        background: #FFFFFF;
        z-index: 70;
        padding: 4px;
        border-radius: 5px;
        cursor: pointer;
        
    }

    .options-itens:hover{
        background: #deeaed;
    }

    .form-field .input-checkbox {
        display: flex;
        position: relative;
        width: 100%;
        padding: 2px;
        padding-left: 5px;
        cursor: pointer;
    }

    .form-field .input-mask {
        display: flex;
        position: relative;
        width: 100%;
        padding: 2px;
        border-radius: 5px;
        height: 30px;
    }

    .form-field .input-mask-textarea {
        display: flex;
        position: relative;
        width: 100%;
        padding: 2px;
        border-radius: 5px;
        height: 60px;
    }

    

    .input-normal{
        border: 1px solid #B3C7CB;
        color: #5F758F;
        
    }

    .input-error{
        border: 1px solid #ff0000;
        color: #ff0000;
    }

    .input-mask input {
        border: 0;
        outline: none;
        width: calc(100% - 4px);
        font-size: 12px;
    }

    .input-select input {
        border: 0;
        outline: none;
        /* width: calc(100% - 18px); */
        width: 0px;
        display: none;
        font-size: 12px;
    }

    /* .input-mask input:focus .input-mask {
        box-shadow: ;
    } */

    .input-mask-textarea textarea {
        border: 0;
        outline: none;
        width: calc(100% - 4px);
        max-height: 60px;
        resize: none;
        font-size: 12px;
    }

    /* .form-field input[type=checkbox] {
        padding-left: 5px;
    } */

    .pills-container{
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        height: auto;
        width: 100%;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #D0E0E3;
    }

    .pill-option {
        position: relative;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        background: #EFF5F6;
        margin: 4px;
        border-radius: 6px;
        padding:4px 6px; 
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid #EFF5F6;
    }

    .pill-selected {
        border: 1px solid #3A4859;
        box-sizing: border-box;
    }

    .pill-option span {
        margin-left: 3px;
    }

    .pill-select-all {
        position: relative;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        background: #EFF5F6;
        margin: 4px;
        border-radius: 6px;
        padding:4px 6px; 
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid #EFF5F6;
    }

    .pill-select-all span {
        margin-left: 3px;
    }


   

    .form-commands{
        display: flex;
        position: absolute;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 60px;
        padding: 10px;
        border-top:1px solid #EFF5F6;
        /* background: #FFFFFF; */
        color: #3A4859;
        font-family: 'Futura Bold', Helvetica, Arial, sans-serif;
        box-sizing: border-box;
    }

    .commands-result span{
        display: flex;
        position: relative;
        border-radius: 6px;
        padding: 8px;
        font-family: 'Futura Normal', Helvetica, Arial, sans-serif;
        font-size: 12px;
    }

    .context-success{
        background-color: #f9ffd6;
        color:#829605;
    }

    .context-error{
        background-color: #fff2f2;
        color:#ff0000;
    }

    .context-hold{
        background-color: #EFF5F6;
        color:#5F758F;
    }


    .commands-buttons {
        display: flex;
        position: relative;
    }

    .form-commands-mock{
        display: flex;
        position: relative;
        width: 100%;
        height: 69px;
        padding: 10px;
        box-sizing: border-box;
    }


    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
       
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        
    }

</style>