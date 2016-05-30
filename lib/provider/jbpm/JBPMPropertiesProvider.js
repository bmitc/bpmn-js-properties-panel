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
  gatewayProps = require('./parts/GatewayProps'),
  scriptProps = require('./parts/ScriptTaskProps'),
  globalsProps = require('./parts/GlobalsProps'),
  importsProps = require('./parts/ImportsProps');

// Input/Output
var inputOutput = require('./parts/InputOutputProps'),
  inputOutputParameter = require('./parts/InputOutputParameterProps');

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: '',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  processProps(generalGroup, element, translate);
  jbpmProcessProps(generalGroup, element, translate);
  serviceTaskDelegateProps(generalGroup, element, bpmnFactory);
  userTaskProps(generalGroup, element, translate);
  scriptProps(generalGroup, element, bpmnFactory, translate);
  linkProps(generalGroup, element);
  callActivityProps(generalGroup, element, bpmnFactory);
  eventProps(generalGroup, element, bpmnFactory, elementRegistry);
  sequenceFlowProps(generalGroup, element, bpmnFactory, translate);
  gatewayProps(generalGroup, element, translate);

  return [
    generalGroup
  ];

}

function createInputOutputParametersTabGroups(element, bpmnFactory, translate) {

  var inputOutputParametersGroup = {
    id: 'input-output',
    label: '',
    entries: []
  };

  var options = inputOutput(inputOutputParametersGroup, element, bpmnFactory, null, translate);

  var inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function (element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: translate('Parameter Detail')
  };

  inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options, translate);

  return [
    inputOutputParametersGroup,
    inputOutputParameterGroup
  ];
}

function createImportsAndGlobalsTabGroups(element, bpmnFactory, translate) {

  var importsGroup = {
    id : 'imports',
    label: translate('Imports'),
    entries: []
  };
  importsProps(importsGroup, element, bpmnFactory, translate);

  var globalsGroup = {
    id : 'globals',
    label: translate('Globals'),
    entries: []
  };
  globalsProps(globalsGroup, element, bpmnFactory, translate);

  return [
    importsGroup,
    globalsGroup
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

    var inputOutputParametersTab = {
      id: 'input-output-paramters',
      label: translate('Input/Output Parameters'),
      groups: createInputOutputParametersTabGroups(element, bpmnFactory, translate)
    };

    var importsAndGlobalsTab = {
      id: "imports",
      label: translate('Imports & Globals'),
      groups: createImportsAndGlobalsTabGroups(element, bpmnFactory, translate)
    }

    return [
      generalTab,
      inputOutputParametersTab,
      importsAndGlobalsTab
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
