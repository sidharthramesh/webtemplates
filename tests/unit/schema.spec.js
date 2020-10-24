import {generateSchema} from '@/components/webtemplates.js'
import json from '../../Blood pressure template.json'
describe('Web Template Schema', () => {
  it('should render blood pressure template', () => {
    let schema = generateSchema(json)
    console.log(schema)
  })
})
