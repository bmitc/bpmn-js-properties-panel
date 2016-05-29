'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var elementHelper = require('../../../../helper/ElementHelper'),
    extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper'),
    inputOutputHelper = require('../../../../helper/InputOutputHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

var extensionElementsEntry = require('./ExtensionElements');


function getInputOutput(element, insideConnector) {
  return inputOutputHelper.getInputOutput(element, insideConnector, 'jbpm:InputOutput');
}

function getConnector(element) {
  return inputOutputHelper.getConnector(element, 'jbpm:InputOutput');
}

function getInputParameters(element, insideConnector) {
  return inputOutputHelper.getInputParameters(element, insideConnector, 'jbpm:InputOutput');
}

function getOutputParameters(element, insideConnector) {
  return inputOutputHelper.getOutputParameters(element, insideConnector, 'jbpm:InputOutput');
}

function getInputParameter(element, insideConnector, idx) {
  return inputOutputHelper.getInputParameter(element, insideConnector, idx, 'jbpm:InputOutput');
}

function getOutputParameter(element, insideConnector, idx) {
  return inputOutputHelper.getOutputParameter(element, insideConnector, idx, 'jbpm:InputOutput');
}


function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}

function createInputOutput(parent, bpmnFactory, properties) {
  return createElement('jbpm:InputOutput', parent, bpmnFactory, properties);
}

function createParameter(type, parent, bpmnFactory, properties) {
  return createElement(type, parent, bpmnFactory, properties);
}


function ensureInputOutputSupported(element, insideConnector) {
  return inputOutputHelper.isInputOutputSupported(element, insideConnector);
}

function ensureOutparameterSupported(element, insideConnector) {
  return inputOutputHelper.areOutputParametersSupported(element, insideConnector);
}

module.exports = function(element, bpmnFactory, options, translate) {

  options = options || {};

  var insideConnector = !!options.insideConnector,
      idPrefix        = options.idPrefix || '';

  var getSelected = function(element, node) {
    var selection = (inputEntry && inputEntry.getSelected(element, node)) || { idx: -1 };

    var parameter = getInputParameter(element, insideConnector, selection.idx);
    if (!parameter && outputEntry) {
      selection = outputEntry.getSelected(element, node);
      parameter = getOutputParameter(element, insideConnector, selection.idx);
    }
    return parameter;
  };

  var result = {
    getSelectedParameter: getSelected
  };

  var entries = result.entries = [];

  if (!ensureInputOutputSupported(element)) {
    return result;
  }

  var newElement = function(type, prop, factory) {

    return function(element, extensionElements, value) {
      var commands = [];

      var inputOutput = getInputOutput(element, insideConnector);
      if (!inputOutput) {
        var parent = !insideConnector ? extensionElements : getConnector(element);
        inputOutput = createInputOutput(parent, bpmnFactory, {
          inputParameters: [],
          outputParameters: []
        });

        if (!insideConnector) {
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [ inputOutput ],
            []
          ));
        }
        else {
          commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
        }
      }

      var newElem = createParameter(type, inputOutput, bpmnFactory, { name: value });
      commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [ newElem ]));

      return commands;
    };
  };

  var removeElement = function(getter, prop, otherProp) {
    return function(element, extensionElements, value, idx) {
      var inputOutput = getInputOutput(element, insideConnector);
      var parameter = getter(element, insideConnector, idx);

      var commands = [];
      commands.push(cmdHelper.removeElementsFromList(element, inputOutput, prop, null, [ parameter ]));

      var firstLength = inputOutput.get(prop).length-1;
      var secondLength = (inputOutput.get(otherProp) || []).length;

      if (!firstLength && !secondLength) {

        if (!insideConnector) {
          commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, inputOutput));
        }
        else {
          var connector = getConnector(element);
          commands.push(cmdHelper.updateBusinessObject(element, connector, { inputOutput: undefined }));
        }

      }

      return commands;
    };
  };

  var setOptionLabelValue = function(getter) {
    return function(element, node, option, property, value, idx) {
      var parameter = getter(element, insideConnector, idx);

      option.text = (value || '') + (parameter.value ? ' : ' + parameter.value : '');
    };
  };


  // input parameters ///////////////////////////////////////////////////////////////

  var inputEntry = extensionElementsEntry(element, bpmnFactory, {
    id: idPrefix + 'inputs',
    label: translate('Input Parameters'),
    modelProperty: 'name',
    prefix: 'Input',
    resizable: true,

    createExtensionElement: newElement('jbpm:InputParameter', 'inputParameters'),
    removeExtensionElement: removeElement(getInputParameter, 'inputParameters', 'outputParameters'),

    getExtensionElements: function(element) {
      return getInputParameters(element, insideConnector);
    },

    onSelectionChange: function(element, node, event, scope) {
      outputEntry && outputEntry.deselect(element, node);
    },

    setOptionLabelValue: setOptionLabelValue(getInputParameter)

  });
  entries.push(inputEntry);


  // output parameters ///////////////////////////////////////////////////////

  if (ensureOutparameterSupported(element, insideConnector)) {
    var outputEntry = extensionElementsEntry(element, bpmnFactory, {
      id: idPrefix + 'outputs',
      label: translate('Output Parameters'),
      modelProperty: 'name',
      prefix: 'Output',
      resizable: true,

      createExtensionElement: newElement('jbpm:OutputParameter', 'outputParameters'),
      removeExtensionElement: removeElement(getOutputParameter, 'outputParameters', 'inputParameters'),

      getExtensionElements: function(element) {
        return getOutputParameters(element, insideConnector);
      },

      onSelectionChange: function(element, node, event, scope) {
        inputEntry.deselect(element, node);
      },

      setOptionLabelValue: setOptionLabelValue(getOutputParameter)

    });
    entries.push(outputEntry);
  }

  return result;

};
