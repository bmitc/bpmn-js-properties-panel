'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  extensionElementsHelper = require('../../../helper/ExtensionElementsHelper'),
  elementHelper = require('../../../helper/ElementHelper'),
  cmdHelper = require('../../../helper/CmdHelper'),
  entryfactory = require('../../../factory/EntryFactory'),
  forEach = require('lodash/collection/forEach');

module.exports = function (group, element, bpmnFactory, translate) {
  var bo;

  if (is(element, 'bpmn:Process')) {
    bo = getBusinessObject(element);
  }

  if (!bo) {
    return;
  }

  function getParent(element, node) {
    var bo = getBusinessObject(element);
    return bo.extensionElements;
  }

  function createParent(element) {
    var bo = getBusinessObject(element);
    var parent = elementHelper.createElement('bpmn:ExtensionElements', {values: []}, bo, bpmnFactory);
    var cmd = cmdHelper.updateProperties(element, {extensionElements: parent});
    return {
      cmd: cmd,
      parent: parent
    };
  }

  var DEFAULT_PROPERTIES = [
    'identifier',
    'type'
  ];

  group.entries.push(entryfactory.table({
    id: 'globals',
    modelProperties: DEFAULT_PROPERTIES,
    labels: [translate('Identifier'), translate('Type')],
    addLabel: translate('Add Global'),
    getElements: function (element, node) {
      return extensionElementsHelper.getExtensionElements(bo, 'drools:Global');
    },
    addElement: function (element, node) {
      var commands = [],
        parent = getParent(element, node);

      if (!parent) {
        var result = createParent(element);
        parent = result.parent;
        commands.push(result.cmd);
      }

      var propertyProps = {};
      forEach(DEFAULT_PROPERTIES, function (prop) {
        propertyProps[prop] = undefined;
      });

      var globalElement = elementHelper.createElement('drools:Global', propertyProps, parent, bpmnFactory);
      commands.push(cmdHelper.addElementsTolist(element, parent, 'values', [globalElement]));

      return commands;
    },
    updateElement: function (element, value, node, idx) {
      var property = extensionElementsHelper.getExtensionElements(bo, 'drools:Global')[idx];

      forEach(DEFAULT_PROPERTIES, function (prop) {
        value[prop] = value[prop] || undefined;
      });

      return cmdHelper.updateBusinessObject(element, property, value);
    },
    validate: function (element, value, node, idx) {
      var validationError = {};
      var hasError = false;
      forEach(DEFAULT_PROPERTIES, function (prop) {
        if (!value[prop]) {
          validationError[prop] = translate('Value of [' + prop + '] must be not empty and unique.');
          hasError = true;
        }
      });
      
      if (hasError) {
        // return validationError;
      }
    },
    removeElement: function (element, node, idx) {
      var commands = [],
        parent = getParent(element, node),
        currentProperty = extensionElementsHelper.getExtensionElements(bo, 'drools:Global')[idx];

      commands.push(cmdHelper.removeElementsFromList(element, parent, 'values', null, [currentProperty]));

      return commands;
    }
  }));
}
