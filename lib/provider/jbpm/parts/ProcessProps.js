'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  entryFactory = require('../../../factory/EntryFactory');


module.exports = function(group, element, translate) {
  if(is(element, 'jbpm:Process')) {

    group.entries.push(entryFactory.textField({
      id : 'toDoUrl',
      description : translate('ToDo url for this user task'),
      label : translate('ToDo Url'),
      modelProperty : 'toDoUrl'
    }));

  }
};
