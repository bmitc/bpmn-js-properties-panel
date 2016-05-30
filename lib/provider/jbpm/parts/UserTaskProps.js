'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  entryFactory = require('../../../factory/EntryFactory');


module.exports = function(group, element, translate) {
  if(is(element, 'jbpm:UserTask')) {

    group.entries.push(entryFactory.textField({
      id : 'ActorId',
      description : translate('Actor of the User Task'),
      label : translate('Actor Id'),
      modelProperty : 'ActorId'
    }));

    group.entries.push(entryFactory.textField({
      id : 'RoleCodes',
      description : translate('Roles of this User Task'),
      label : translate('Role Codes'),
      modelProperty : 'RoleCodes'
    }));

    group.entries.push(entryFactory.textField({
      id : 'OrganizationLevel',
      description : translate('Organization Level'),
      label : translate('Organization Level'),
      modelProperty : 'OrganizationLevel'
    }));

    var booleanSelectOptions = [
      { value: 'false', name: translate('No') },
      { value: 'true', name: translate('Yes') }
    ];

    group.entries.push(entryFactory.selectBox({
      id : 'Multi-User',
      description : translate('Multi-User'),
      label : translate('Multi-User'),
      modelProperty : 'Multi-User',
      selectOptions: booleanSelectOptions
    }));

    group.entries.push(entryFactory.selectBox({
      id : 'Skippable',
      description : translate('Skippable'),
      label : translate('Skippable'),
      modelProperty : 'Skippable',
      selectOptions: booleanSelectOptions
    }));

    group.entries.push(entryFactory.textField({
      id : 'Priority',
      description : translate('Priority'),
      label : translate('Priority'),
      modelProperty : 'Priority'
    }));

    group.entries.push(entryFactory.textField({
      id : 'toDoUrl',
      description : translate('ToDo url for this user task'),
      label : translate('ToDo Url'),
      modelProperty : 'toDoUrl'
    }));

  }
};
