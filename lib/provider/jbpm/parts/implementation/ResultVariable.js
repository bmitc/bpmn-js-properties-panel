'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is;

var assign = require('lodash/object/assign');

var entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper    = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options) {

  var getBusinessObject     = options.getBusinessObject,
      hideResultVariable    = options.hideResultVariable,
      id                    = options.id || 'resultVariable';


  var resultVariableEntry = entryFactory.textField({
    id: id,
    label: 'Result Variable',
    modelProperty: 'resultVariable',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return { resultVariable: bo.get('jbpm:resultVariable') };
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element);

      var resultVariable = values.resultVariable || undefined;

      var props = {
        'jbpm:resultVariable': resultVariable
      };

      if (is(bo, 'jbpm:DmnCapable') && !resultVariable) {
        props = assign({ 'jbpm:mapDecisionResult': 'resultList' }, props);
      }

      return cmdHelper.updateBusinessObject(element, bo, props);
    },

    disabled: function(element, node) {
      if (typeof hideResultVariable === 'function') {
        return hideResultVariable.apply(resultVariableEntry, arguments);
      }
    }

  });

  return [ resultVariableEntry ];

};
