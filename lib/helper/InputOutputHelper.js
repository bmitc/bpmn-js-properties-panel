'use strict';

var ModelUtil         = require('bpmn-js/lib/util/ModelUtil'),
    is                = ModelUtil.is,
    getBusinessObject = ModelUtil.getBusinessObject;

var extensionElementsHelper = require('./ExtensionElementsHelper'),
    implementationTypeHelper = require('./ImplementationTypeHelper');

var InputOutputHelper = {};

module.exports = InputOutputHelper;

function getElements(bo, type, prop) {
  var elems = extensionElementsHelper.getExtensionElements(bo, type) || [];
  return !prop ? elems : (elems[0] || {})[prop] || [];
}

function getParameters(element, prop, insideConnector, type) {
  var inputOutput = InputOutputHelper.getInputOutput(element, insideConnector, type);
  return (inputOutput && inputOutput.get(prop)) || [];
}

/**
 * Get a inputOutput from the business object
 *
 * @param {djs.model.Base} element
 * @param  {boolean} insideConnector
 *
 * @return {ModdleElement} the inputOutput object
 */
InputOutputHelper.getInputOutput = function(element, insideConnector, type) {
  if (!insideConnector) {
    var bo = getBusinessObject(element);
    return (getElements(bo, type || 'camunda:InputOutput') || [])[0];
  }
  var connector = this.getConnector(element);
  return connector && connector.get('inputOutput');
};

/**
 * Get a connector from the business object
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement} the connector object
 */
InputOutputHelper.getConnector = function(element, type) {
  var bo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
  return bo && (getElements(bo, type || 'camunda:Connector') || [])[0];
};

/**
 * Return all input parameters existing in the business object, and
 * an empty array if none exist.
 *
 * @param  {djs.model.Base} element
 * @param  {boolean} insideConnector
 *
 * @return {Array} a list of input parameter objects
 */
InputOutputHelper.getInputParameters = function(element, insideConnector, type) {
  return getParameters.apply(this, [ element, 'inputParameters', insideConnector, type ]);
};

/**
 * Return all output parameters existing in the business object, and
 * an empty array if none exist.
 *
 * @param  {djs.model.Base} element
 * @param  {boolean} insideConnector
 *
 * @return {Array} a list of output parameter objects
 */
InputOutputHelper.getOutputParameters = function(element, insideConnector, type) {
  return getParameters.apply(this, [ element, 'outputParameters', insideConnector, type ]);
};

/**
 * Get a input parameter from the business object at given index
 *
 * @param {djs.model.Base} element
 * @param  {boolean} insideConnector
 * @param {number} idx
 *
 * @return {ModdleElement} input parameter
 */
InputOutputHelper.getInputParameter = function(element, insideConnector, idx, type) {
  return this.getInputParameters(element, insideConnector, type)[idx];
};

/**
 * Get a output parameter from the business object at given index
 *
 * @param {djs.model.Base} element
 * @param  {boolean} insideConnector
 * @param {number} idx
 *
 * @return {ModdleElement} output parameter
 */
InputOutputHelper.getOutputParameter = function(element, insideConnector, idx, type) {
  return this.getOutputParameters(element, insideConnector, type)[idx];
};

/**
 * Returns 'true' if the given element supports inputOutput
 *
 * @param {djs.model.Base} element
 * @param  {boolean} insideConnector
 *
 * @return {boolean} a boolean value
 */
InputOutputHelper.isInputOutputSupported = function(element, insideConnector) {
  var bo = getBusinessObject(element);
  return insideConnector ||
         (is(bo, 'bpmn:FlowNode') &&
         !is(bo, 'bpmn:StartEvent') &&
         !is(bo, 'bpmn:BoundaryEvent') &&
         !(is(bo, 'bpmn:SubProcess') && bo.get('triggeredByEvent')));
};

/**
 * Returns 'true' if the given element supports output parameters
 *
 * @param {djs.model.Base} element
 * @param  {boolean} insideConnector
 *
 * @return {boolean} a boolean value
 */
InputOutputHelper.areOutputParametersSupported = function(element, insideConnector) {
  var bo = getBusinessObject(element);
  return insideConnector || (!is(bo, 'bpmn:EndEvent') && !bo.loopCharacteristics);
};
