'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var asyncCapableHelper = require('../../helper/AsyncCapableHelper');

// bpmn properties
var processProps = require('../bpmn/parts/ProcessProps'),
    eventProps = require('../bpmn/parts/EventProps'),
    linkProps = require('../bpmn/parts/LinkProps'),
    documentationProps = require('../bpmn/parts/DocumentationProps'),
    idProps = require('../bpmn/parts/IdProps'),
    nameProps = require('../bpmn/parts/NameProps');

// jbpm properties
var serviceTaskDelegateProps = require('./parts/ServiceTaskDelegateProps'),
    userTaskProps = require('./parts/UserTaskProps'),
    asynchronousContinuationProps = require('./parts/AsynchronousContinuationProps'),
    callActivityProps = require('./parts/CallActivityProps'),
    multiInstanceProps = require('./parts/MultiInstanceLoopProps'),
    sequenceFlowProps = require('./parts/SequenceFlowProps'),
    executionListenerProps = require('./parts/ExecutionListenerProps'),
    scriptProps = require('./parts/ScriptTaskProps'),
    taskListenerProps = require('./parts/TaskListenerProps'),
    formProps = require('./parts/FormProps'),
    startEventInitiator = require('./parts/StartEventInitiator'),
    variableMapping = require('./parts/VariableMappingProps');

// Input/Output
var inputOutput = require('./parts/InputOutputProps'),
    inputOutputParameter = require('./parts/InputOutputParameterProps');

// Connector
var connectorDetails = require('./parts/ConnectorDetailProps'),
    connectorInputOutput = require('./parts/ConnectorInputOutputProps'),
    connectorInputOutputParameter = require('./parts/ConnectorInputOutputParameterProps');

// properties
var properties = require('./parts/PropertiesProps');

// job configuration
var jobConfiguration = require('./parts/JobConfigurationProps');

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    eventDefinitionHelper = require('../../helper/EventDefinitionHelper'),
    implementationTypeHelper = require('../../helper/ImplementationTypeHelper');

// helpers ////////////////////////////////////////

var isJobConfigEnabled = function(element) {
  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant'))  {
    return true;
  }

  // async behavior
  var bo = getBusinessObject(element);
  if (asyncCapableHelper.isAsyncBefore(bo) || asyncCapableHelper.isAsyncAfter(bo)) {
    return true;
  }

  // timer definition
  if (is(element, 'bpmn:Event'))  {
    return !!eventDefinitionHelper.getTimerEventDefinition(element);
  }

  return false;
};

var getInputOutputParameterLabel = function(param) {

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

  var detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  };
  serviceTaskDelegateProps(detailsGroup, element, bpmnFactory);
  userTaskProps(detailsGroup, element);
  scriptProps(detailsGroup, element, bpmnFactory);
  linkProps(detailsGroup, element);
  callActivityProps(detailsGroup, element, bpmnFactory);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry);
  sequenceFlowProps(detailsGroup, element, bpmnFactory);
  startEventInitiator(detailsGroup, element); // this must be the last element of the details group!

  var multiInstanceGroup = {
    id: 'multiInstance',
    label: translate('Multi Instance'),
    entries: []
  };
  multiInstanceProps(multiInstanceGroup, element, bpmnFactory);

  var asyncGroup = {
    id : 'asyncGroup',
    label: translate('Asynchronous Continuations'),
    entries : []
  };
  asynchronousContinuationProps(asyncGroup, element, bpmnFactory);

  var jobConfigurationGroup = {
    id : 'jobConfigurationGroup',
    label : translate('Job Configuration'),
    entries : [],
    enabled: isJobConfigEnabled
  };
  jobConfiguration(jobConfigurationGroup, element, bpmnFactory);

  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };
  documentationProps(documentationGroup, element, bpmnFactory);

  return [
    generalGroup,
    detailsGroup,
    //multiInstanceGroup,
    //asyncGroup,
    //jobConfigurationGroup,
    documentationGroup
  ];

}

function createVariablesTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var variablesGroup = {
    id : 'variables',
    label : translate('Variables'),
    entries: []
  };
  variableMapping(variablesGroup, element, bpmnFactory);

  return [
    variablesGroup
  ];
}

function createFormsTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var formGroup = {
    id : 'forms',
    label : translate('Forms'),
    entries: []
  };
  formProps(formGroup, element, bpmnFactory);

  return [
    formGroup
  ];
}

function createListenersTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var executionListenersGroup = {
    id : 'executionListeners',
    label: translate('Execution Listeners'),
    entries: []
  };
  executionListenerProps(executionListenersGroup, element, bpmnFactory);

  var taskListenersGroup = {
    id : 'taskListeners',
    label: translate('Task Listeners'),
    entries: []
  };
  taskListenerProps(taskListenersGroup, element, bpmnFactory);

  return [
    executionListenersGroup,
    taskListenersGroup
  ];
}

function createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var inputOutputGroup = {
    id: 'input-output',
    label: translate('Parameters'),
    entries: []
  };

  var options = inputOutput(inputOutputGroup, element, bpmnFactory);

  var inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
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

function createConnectorTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var connectorDetailsGroup = {
    id: 'connector-details',
    label: translate('Details'),
    entries: []
  };

  connectorDetails(connectorDetailsGroup, element, bpmnFactory);

  var connectorInputOutputGroup = {
    id: 'connector-input-output',
    label: translate('Input/Output'),
    entries: []
  };

  var options = connectorInputOutput(connectorInputOutputGroup, element, bpmnFactory);

  var connectorInputOutputParameterGroup = {
    id: 'connector-input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
      var param = options.getSelectedParameter(element, node);
      return translate(getInputOutputParameterLabel(param));
    }
  };

  connectorInputOutputParameter(connectorInputOutputParameterGroup, element, bpmnFactory, options);

  return [
    connectorDetailsGroup,
    connectorInputOutputGroup,
    connectorInputOutputParameterGroup
  ];
}

function createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate) {

  var propertiesGroup = {
    id : 'extension-elements-properties',
    label: translate('Properties'),
    entries: []
  };
  properties(propertiesGroup, element, bpmnFactory);

  return [
    propertiesGroup
  ];
}

// JBPM Properties Provider /////////////////////////////////////
function JBPMPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var variablesTab = {
      id: 'variables',
      label: translate('Variables'),
      groups: createVariablesTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var formsTab = {
      id: 'forms',
      label: translate('Forms'),
      groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var listenersTab = {
      id: 'listeners',
      label: translate('Listeners'),
      groups: createListenersTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var inputOutputTab = {
      id: 'input-output',
      label: translate('Input/Output'),
      groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var connectorTab = {
      id: 'connector',
      label: translate('Connector'),
      groups: createConnectorTabGroups(element, bpmnFactory, elementRegistry, translate),
      enabled: function(element) {
        var bo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
        return bo && implementationTypeHelper.getImplementationType(bo) === 'connector';
      }
    };

    var extensionsTab = {
      id: 'extension-elements',
      label: translate('Extensions'),
      groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate)
    };

    return [
      generalTab,
      variablesTab,
      connectorTab,
      //formsTab,
      //listenersTab,
      inputOutputTab,
      extensionsTab
    ];
  };

}

inherits(JBPMPropertiesProvider, PropertiesActivator);

module.exports = JBPMPropertiesProvider;
