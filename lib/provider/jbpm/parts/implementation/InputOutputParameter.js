'use strict';

var inputOutputHelper = require('../../../../helper/InputOutputHelper'),
    cmdHelper = require('../../../../helper/CmdHelper'),
    utils = require('../../../../Utils');

var entryFactory = require('../../../../factory/EntryFactory');

function ensureInputOutputSupported(element, insideConnector) {
  return inputOutputHelper.isInputOutputSupported(element, insideConnector);
}

module.exports = function(element, bpmnFactory, options, translate) {

  options = options || {};

  var insideConnector = !!options.insideConnector,
      idPrefix        = options.idPrefix || '';

  var getSelected = options.getSelectedParameter;

  if (!ensureInputOutputSupported(element, insideConnector)) {
    return [];
  }

  var entries = [];

  var isSelected = function(element, node) {
    return getSelected(element, node);
  };


  // parameter name ////////////////////////////////////////////////////////

  entries.push(entryFactory.validationAwareTextField({
    id: idPrefix + 'parameterName',
    label: translate('Name'),
    modelProperty: 'name',

    getProperty: function(element, node) {
      return (getSelected(element, node) || {}).name;
    },

    setProperty: function(element, values, node) {
      var param = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    validate: function(element, values, node) {
      var bo = getSelected(element, node);

      var validation = {};
      if (bo) {
        var nameValue = values.name;

        if (nameValue) {
          if (utils.containsSpace(nameValue)) {
            validation.name = 'Name must not contain spaces';
          }
        }
        else {
          validation.name = 'Parameter must have a name';
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }
  }));

  // parameter value ///////////////////////////////////////////////////////

  entries.push(entryFactory.textArea({
    id : idPrefix + 'parameterType-text',
    label : translate('Value'),
    modelProperty: 'value',
    get: function(element, node) {
      return {
        value: (getSelected(element, node) || {}).value
      };
    },

    set: function(element, values, node) {
      var param = getSelected(element, node);
      values.value = values.value || undefined;
      return cmdHelper.updateBusinessObject(element, param, values);
    },

    show: function(element, node) {
      var bo = getSelected(element, node);
      return bo && !bo.definition;
    }

  }));

  return entries;

};
