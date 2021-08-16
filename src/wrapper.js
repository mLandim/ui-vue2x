import * as AllComponents from './components/index';


// Function executed by Vue.use()
function syaraUi(Vue) {

  if (syaraUi.installed) {
    return;
  }
  
  syaraUi.installed = true;
  
  Object.entries(AllComponents).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });

}

// Different identification for named and default exports
const install = syaraUi

// Module definition for Vue.use()
const plugin = {
  install,
};

//  Auto-install when Vue is located (browser <script>)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

const SyaraUiComponents = {}
let ui = function (){
  Object.entries(AllComponents).forEach(([componentName, component]) => {
    // Vue.component(componentName, component);
    SyaraUiComponents[componentName] = {
      install: function(Vue) {
        Vue.component(componentName, component)
      }
    }
  });
}();

// Named export
export { syaraUi, SyaraUiComponents };

export default {
  install
}