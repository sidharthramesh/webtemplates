import {mount, createLocalVue} from '@vue/test-utils'
import VueFormulate from '@braid/vue-formulate'
import Form from '@/components/Form.vue'
import bloodPressureWithoutSnomed from '../../webtemplates/bloodPressureWithoutSnomed.json'
import bloodPressure from '../../webtemplates/bloodPressure.json'
import bloodPressureWithWeight from '../../webtemplates/bloodPressureWithWeight.json'
import {generateSchema} from '@/components/webtemplates.js'
import SnomedSearch from '@/components/SnomedSearch.vue'
let localVue = createLocalVue()
localVue.component('SnomedSearch', SnomedSearch)
localVue.use(VueFormulate, {
  library: {
    snomed: {
      classification: 'text',
      component: 'SnomedSearch'
    }
  }})
describe('Web Template Schema', () => {
  it('should generate schema', ()=>{
    generateSchema(bloodPressureWithWeight)
  })
  it('should render inputs from template', async ()=>{
    const wrapper = mount(Form, {propsData: {template: bloodPressureWithoutSnomed}, localVue})
    let inputs = wrapper.findAll('input')
    let selects = wrapper.findAll('select')
    expect(inputs.length).toEqual(5)
    expect(selects.length).toEqual(6)
  })

  it('should render inputs with snomed selector', async ()=>{
    const wrapper = mount(Form, {propsData: {template: bloodPressure}, localVue})
    let inputs = wrapper.findAll('input')
    let selects = wrapper.findAll('select')
    expect(inputs.length).toEqual(6)
    expect(selects.length).toEqual(5)
  })
})
