
import * as AllComponents from './components/index';

// Vue 2.x only

let syaraUi = (Vue) => {

    if (syaraUi.installed) {
      return
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
}

export default {
  install
}

