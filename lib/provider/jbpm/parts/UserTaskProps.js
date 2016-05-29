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
      id : 'GroupId',
      description : translate('Group for this User Task'),
      label : translate('Group Id'),
      modelProperty : 'GroupId'
    }));

    group.entries.push(entryFactory.textField({
      id : 'Content',
      description : translate('Content'),
      label : translate('Content'),
      modelProperty : 'Content'
    }));

    group.entries.push(entryFactory.textField({
      id : 'Comment',
      description : translate('Comment'),
      label : translate('Comment'),
      modelProperty : 'Comment'
    }));

    group.entries.push(entryFactory.textField({
      id : 'Skippable',
      description : translate('Skippable'),
      label : translate('Skippable'),
      modelProperty : 'Skippable'
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
