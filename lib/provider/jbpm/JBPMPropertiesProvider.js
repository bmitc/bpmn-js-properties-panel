'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

// bpmn properties
var processProps = require('../bpmn/parts/ProcessProps'),
  eventProps = require('../bpmn/parts/EventProps'),
  linkProps = require('../bpmn/parts/LinkProps'),
  idProps = require('../bpmn/parts/IdProps'),
  nameProps = require('../bpmn/parts/NameProps');

// jbpm properties
var jbpmProcessProps = require('./parts/ProcessProps'),
  serviceTaskDelegateProps = require('./parts/ServiceTaskDelegateProps'),
  userTaskProps = require('./parts/UserTaskProps'),
  callActivityProps = require('./parts/CallActivityProps'),
  sequenceFlowProps = require('./parts/SequenceFlowProps'),
  scriptProps = require('./parts/ScriptTaskProps'),
  startEventInitiator = require('./parts/StartEventInitiator');

// Input/Output
var inputOutput = require('./parts/InputOutputProps'),
  inputOutputParameter = require('./parts/InputOutputParameterProps');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var getInputOutputParameterLabel = function (param) {

  if (is(param, 'jbpm:InputParameter')) {
    return 'Input Parameter';
  }

  if (is(param, 'jbpm:OutputParameter')) {
    return 'Output Parameter';
  }

  return '';
};

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  processProps(generalGroup, element, translate);
  jbpmProcessProps(generalGroup, element, translate);
  serviceTaskDelegateProps(generalGroup, element, bpmnFactory);
  userTaskProps(generalGroup, element, translate);
  scriptProps(generalGroup, element, bpmnFactory);
  linkProps(generalGroup, element);
  callActivityProps(generalGroup, element, bpmnFactory);
  eventProps(generalGroup, element, bpmnFactory, elementRegistry);
  sequenceFlowProps(generalGroup, element, bpmnFactory);
  startEventInitiator(generalGroup, element); // this must be the last element of the details group!

  return [
    generalGroup
  ];

}

function createInputOutputTabGroups(element, bpmnFactory, translate) {

  var inputOutputGroup = {
    id: 'input-output',
    label: translate('Parameters'),
    entries: []
  };

  var options = inputOutput(inputOutputGroup, element, bpmnFactory);

  var inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function (element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function (element, node) {
      var param = options.getSelectedParameter(element, node);
      return getInputOutputParameterLabel(param);
    }
  };

  inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options);

  return [
    inputOutputGroup,
    inputOutputParameterGroup
  ];
}

// JBPM Properties Provider /////////////////////////////////////


/**
 * A properties provider for Jbpm related properties.
 *
 * @param {EventBus} eventBus
 * @param {BpmnFactory} bpmnFactory
 * @param {ElementRegistry} elementRegistry
 * @param {ElementTemplates} elementTemplates
 * @param {Translate} translate
 */
function JBPMPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(
        element, bpmnFactory,
        elementRegistry, translate)
    };

    var inputOutputTab = {
      id: 'input-output',
      label: translate('Input/Output'),
      groups: createInputOutputTabGroups(element, bpmnFactory, translate)
    };

    return [
      generalTab,
      inputOutputTab
    ];
  };

}

JBPMPropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'elementRegistry',
  'translate'
];

inherits(JBPMPropertiesProvider, PropertiesActivator);

module.exports = JBPMPropertiesProvider;
