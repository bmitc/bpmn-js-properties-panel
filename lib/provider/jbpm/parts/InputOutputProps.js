'use strict';

var inputOutput = require('./implementation/InputOutput');

module.exports = function(group, element, bpmnFactory, options, translate) {

  var inputOutputEntry = inputOutput(element, bpmnFactory, options, translate);

  group.entries = group.entries.concat(inputOutputEntry.entries);

  return {
    getSelectedParameter: inputOutputEntry.getSelectedParameter
  };

};
