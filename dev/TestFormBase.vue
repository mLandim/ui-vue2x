<template>
  <div class="test-page">

    <SyFormBase  v-if="dataForm"
    :dataForm="dataForm"
    ></SyFormBase>

  </div>

</template>

<script>
export default {
    name: 'test-page',
    data() {
        return {
            dataForm: null,
        }
    },
    created() {
        this.openForm()
    },
    methods:{

        openForm(){

            let self = this

            let itemNovaRotina = {
                
                // aberto: true,
                title: 'Nova Rotina',
                fieldLines: 5,
                info: ``,
                lineBorder: false,
                gridLines: [
                    {
                        COORD:{
                            required: true,
                            type:'select',
                            options: { 0:'a', 1: 'b'},
                            label: 'Bloco',
                            valueType: 'value',
                            value: '7723',
                            width: '10%',
                        },
                        ORIGEM_TABELA: {
                            required: true,
                            type:'select',
                            options: { 0:'a', 1: 'b'},
                            label: 'Origem dos Registros',
                            valueType: 'value',
                            value: 'SIMDR',
                            width: '20%',
                        },
                    },
                    {
                       
                        NOME_CATEGORIA: {
                           
                            required: true,
                            type:'text',
                            label: 'Nome da Rotina',
                            value: '',
                            placeholder: 'Indique um nome que facilite a identificação da Rotina',
                            width: '40%',
                            
                        },
                        DESCRICAO: {
                           
                            required: false,
                            type:'textarea',
                            label: 'Descrição da Rotina',
                            value: '',
                            placeholder: 'Máx 300 caracteres',
                            maxlength: 300,
                            width: '60%',
                            
                        },

                        

                        
                    },
                   
                    {
                       
                        SUBCONTA: {

                            required: false,
                            type:'textarea',
                            label: 'Subconta',
                            value: '',
                            placeholder: 'Máx 250 caracteres',
                            maxlength: 250,
                            width: '25%',
                            help: `
                            <div style="margin-bottom:4px;">Lista de Subcontas.</div>
                            <div style="margin-bottom:4px;">As Subcontas devem ser separadas com <b>vírgula (,)</b></div>
                            `

                           
                            
                        },

                        PRODUTO: {
                            required: false,
                            type:'textarea',
                            label: 'Produto',
                            value: '',
                            placeholder: 'Máx 250 caracteres',
                            maxlength: 250,
                            width: '25%',
                            help: `
                            <div style="margin-bottom:4px;">Lista de Produtos.</div>
                            <div style="margin-bottom:4px;">Os Produtos devem ser separados com <b>vírgula (,)</b></div>
                            `

                          
                            
                        },

                        OL: {
                            required: false,
                            type:'textarea',
                            label: 'OL',
                            value: '',
                            placeholder: 'Máx 250 caracteres',
                            maxlength: 250,
                            width: '25%',
                            help: `
                            <div style="margin-bottom:4px;">Lista de OL.</div>
                            <div style="margin-bottom:4px;">As OL devem ser separadas com <b>vírgula (,)</b></div>
                            `

                           
                            
                        },

                        EVENTO: {

                            required: false,
                            type:'textarea',
                            label: 'Evento',
                            value: '',
                            placeholder: 'Máx 250 caracteres',
                            maxlength: 250,
                            width: '25%',
                            help: `
                            <div style="margin-bottom:4px;">Lista de Eventos.</div>
                            <div style="margin-bottom:4px;">Os Eventos devem ser separados com <b>vírgula (,)</b></div>
                            `


                           
                            
                        },

                       

                    },
                    {
                       
                        SL:{
                            line: 2,
                            required: false,
                            type:'select',
                            options: ['', 1, 2],
                            label: 'SL',
                            value: '',
                            width: '5%',
                            
                            
                        },

                    },
                    {
               
                        VALOR_MINIMO: {
                            line: 3,
                            required: false,
                            type:'number',
                            label: 'Valor Mínimo',
                            value: '',
                            placeholder: '',
                            maxlength: 10,
                            width: '16%',
                            help: `
                            <div style="">Use <b>ponto (.)</b> como separador de casas decimais</div>
                            `
                            
                        },

                        VALOR_MAXIMO: {
                            line: 3,
                            required: false,
                            type:'number',
                            label: 'Valor Máximo',
                            value: '',
                            placeholder: '',
                            maxlength: 10,
                            width: '16%',
                            help: `
                            <div style="">Use <b>ponto (.)</b> como separador de casas decimais</div>
                            `
                            
                        },

                        VALOR_ABS: {
                            line: 3,
                            required: false,
                            type:'text',
                            label: 'Valor em Módulo',
                            value: '',
                            placeholder: '',
                            maxlength: 10,
                            width: '16%',
                            help: `
                            <div style="margin-bottom:5px">Use <b>ponto (.)</b> como separador de casas decimais</div>
                            <div style="margin-bottom:5px">Use os modificadores <b>>=</b> ou <b><=</b> antes do valor para alterar o resultado retornado.</div>
                            <div style="margin-bottom:5px">Exemplos:</div>
                            <div style="margin-bottom:5px">
                            <ul>
                            <li> Informar <b>>=59.50</b> vai recuperar da tabela os registros com valor maior ou igual a 59.50 (em módulo)</li>
                            <li> Informar <b><=59.50</b> vai recuperar da tabela os registros com valor menor ou igual a 59.50 (em módulo)</li>
                            <li> Informar <b>apenas 59.50</b> vai recuperar da tabela os registros com valor igual a 59.50 (em módulo)</li>
                            </ul>
                            </div>
                            <div style="">Não use espaços na expressão</div>
                            `
                            
                        },
                        
                    },
                    {
                            
                        DATA_MINIMO: {
                            line: 4,
                            required: false,
                            type:'date',
                            label: 'Data Limite Mínimo',
                            value: '',
                            placeholder: '',
                            maxlength: 10,
                            width: '20%',
                            
                        },

                        DATA_MAXIMO: {
                            line: 4,
                            required: false,
                            type:'date',
                            label: 'Data Limite Máximo',
                            value: '',
                            placeholder: '',
                            maxlength: 10,
                            width: '20%',
                            
                        },

                        
                    },
                    {
                            
                        VISIBILIDADE: {
                            line: 5,
                            required: false,
                            type:'textarea',
                            label: 'Visibilidade',
                            value: '*',
                            placeholder: 'Máx 300 caracteres',
                            maxlength: 300,
                            width: '37%',
                            help: `
                            <div style="margin-bottom:4px;">Lista com as matrículas dos operadores com permissão para visualizar a rotina.</div>
                            <div style="margin-bottom:4px;">As matrículas devem ser separadas com vírgula (<b>,</b>)</div>
                            <div style="margin-bottom:4px;">O valor padrão (<b>*</b>) indica que todos poderão visualizar a rotina.</div>
                            `
                            
                        },
                        CAIXAS_POSTAIS: {
                            line: 5,
                            required: false,
                            type:'textarea',
                            label: 'Caixas Postais',
                            value: '',
                            placeholder: 'Máx 300 caracteres',
                            maxlength: 300,
                            width: '37%',
                            help: `
                            <div style="margin-bottom:4px;">Lista de caixas postais disponíveis para uso na versão aplicativo desta página (caso tenha sido disponibilizado).</div>
                            <div style="margin-bottom:4px;">As caixas postais devem ser separadas com vírgula (<b>,</b>)</div>
                            `
                            
                        }

                    },
                    {
                        USA_RESPONSAVEL:{
                            label: 'Usa coluna RESPONSÁVEL',
                            required: false,
                            type:'select',
                            options: ['NAO', 'SIM'],
                            valueType: 'key',
                            value: 0,
                            width: '20%',
                            help: `
                            <div style="margin-bottom:4px;">Coluna na tabela de registros que permite designar empregados para cada registro</div>
                            `
                            
                            
                        },
                        RESPONSAVEL_LISTA: {
                            required: false,
                            type:'textarea',
                            label: 'Lista de empregados para designação na coluna RESPONSÁVEL',
                            value: '',
                            placeholder: 'Máx 300 caracteres',
                            maxlength: 300,
                            width: '80%',
                            help: `
                            <div style="margin-bottom:4px;">Lista empregados disponíveis para a mecânica de designação de empregado responsável por cada registro.</div>
                            <div style="margin-bottom:4px;">Não é obrigatório informar o nome completo ou matrícula, apenas use um nome que ajude na identificação do empregado. Os nomes devem ser separadas com vírgula </div>
                            `
                            
                        }
                    },
                    {

                        STATUS_LISTA: {
                            required: false,
                            type:'pills',
                            options: { 0:'a', 1: 'b'},
                            label: 'Lista de Status disponíveis',
                            valueType: 'key',
                            value: '',
                            width: '40%',
                            help: `
                            <div style="margin-bottom:4px;">Lista com as opções de Status para uso na tabela de registros</div>
                            `
                        },
                        CATEGORIA_LISTA: {
                            required: false,
                            type:'pills',
                            options: { 0:'a', 1: 'b'},
                            label: 'Lista de Categorias disponíveis',
                            valueType: 'key',
                            value: '',
                            width: '60%',
                            help: `
                            <div style="margin-bottom:4px;">Lista com as opções de Categorias para uso na tabela de registros</div>
                            `
                        }

                    }
                ],

                closeContext: {
                    text: 'Cancelar',
                    action: () => {
                        console.log('closeContext')
                        console.log(this)
                        console.log(self)
                        this.dataForm = null
                     
                        // self.$store.dispatch( 'setFormNovaRotina',  {aberto: false} )

                    }

                },

                okContext: {
                    text: 'Gravar Nova Rotina',
                    // action: async function(dados) {
                    action: async (dados) => {

                        let resultadoFinal = null
                        console.log('okContext')
                        
                        try {

                            let item = {
                                nova: true,
                                PAGINA: self.appInfo.pagina
                            }
                            for(let line of dados) {
                                for (let keyDados in line){
                                    item[keyDados] = line[keyDados].value
                                }
                            }

                            
                            
 
                            let resposta = await this.$requestCors('POST', self.$proxy+'rotinas/', item)
                            console.log(resposta)
                            if(resposta.status === 200) {

                                if(resposta.data.RESULTADO === 1){
                                    resultadoFinal = {
                                        context: 'success',
                                        text: resposta.data.RESULTADO_TEXTO
                                    }
                                    this.getRotinas()
                                  
     
                                } else {

                                   resultadoFinal = {
                                        context: 'error',
                                        text: resposta.data.RESULTADO_TEXTO
                                    }

                                }
                            } else {

                                resultadoFinal = {
                                    context: 'error',
                                    text: `Erro na requisição. Resposta: ${resposta.status}`
                                }

                            }    
                            
                        } catch (error) {

                            resultadoFinal = {
                                context: 'error',
                                text: error.data
                            }

                        }
                       
                        return resultadoFinal
                        

                    }
                }


            }

            this.dataForm = itemNovaRotina
            
        },
    }

}
</script>

<style>

</style>