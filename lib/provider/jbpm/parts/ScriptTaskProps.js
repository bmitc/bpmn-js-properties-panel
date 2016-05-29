'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../../../factory/EntryFactory'),
    cmdHelper = require('../../../helper/CmdHelper'),
    script = require('./implementation/Script');


module.exports = function(group, element, bpmnFactory, translate) {
  var bo;

  if (is(element, 'bpmn:ScriptTask')) {
    bo = getBusinessObject(element);
  }

  if (!bo) {
    return;
  }

  var script = script('scriptFormat', 'script', false, translate);

  group.entries.push({
    id: 'script-implementation',
    description: 'Implementation for a Script.',
    label: translate('Script'),
    html: script.template,

    get: function (element) {
      return script.get(element, bo);
    },

    set: function(element, values, containerElement) {
      var properties = script.set(element, values, containerElement);

      return cmdHelper.updateProperties(element, properties);
    },

    validate: function(element, values) {
      return script.validate(element, values);
    },

    script : script,

    cssClasses: ['pp-textfield']

  });

  group.entries.push(entryFactory.textField({
    id : 'scriptResultVariable',
    description : 'Result Variable of a Service Task Script',
    label : translate('Result Variable'),
    modelProperty : 'scriptResultVariable',

    get: function(element, propertyName) {
      var boResultVariable = bo.get('jbpm:resultVariable');

      return { scriptResultVariable : boResultVariable };
    },

    set: function(element, values, containerElement) {
      return cmdHelper.updateProperties(element, {
        'jbpm:resultVariable': values.scriptResultVariable
      });
    }

  }));

};
