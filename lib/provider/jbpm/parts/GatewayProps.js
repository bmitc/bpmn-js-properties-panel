'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  entryFactory = require('../../../factory/EntryFactory');


module.exports = function(group, element, translate) {
  if (is(element, 'bpmn:EventBasedGateway')
    || is(element, 'bpmn:ComplexGateway')
    || is(element, 'bpmn:ExclusiveGateway')
    || is(element, 'bpmn:InclusiveGateway')
    || is(element, 'bpmn:ParallelGateway')) {

    group.entries.push(entryFactory.selectBox({
      id : 'gatewayDirection',
      description : translate('Gateway Direction'),
      label : translate('Gateway Direction'),
      modelProperty : 'gatewayDirection',
      selectOptions : [
        {name: translate('Diverging'), value: 'Diverging'},
        {name: translate('Converging'), value: 'Converging'},
        {name: translate('Mixed'), value: 'Mixed'},
        {name: translate('Unspecified'), value: 'Unspecified'}
      ]
    }));

  }

};
