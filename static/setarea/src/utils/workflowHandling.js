// utils/workflowHandling.js

import { areas } from '../setarea.js'

let twoWayWorkflowJSON, threeWayWorkflowJSON, fourWayWorkflowJSON, fiveWayWorkflowJSON

/**
 * Loads the workflow JSON files.
 */
async function loadWorkflowFiles () {
  try {
    const fourWayResponse = await fetch('4way-conditional-workflow.json')
    const fiveWayResponse = await fetch('5way-conditional-workflow.json')
    const twoWayResponse = await fetch('2way-conditional-workflow.json')
    const threeWayResponse = await fetch('3way-conditional-workflow.json')

    if (!fourWayResponse.ok || !fiveWayResponse.ok || !twoWayResponse.ok || !threeWayResponse.ok) {
      throw new Error('Failed to load one or more workflow files.')
    }

    twoWayWorkflowJSON = await twoWayResponse.json()
    threeWayWorkflowJSON = await threeWayResponse.json()
    fourWayWorkflowJSON = await fourWayResponse.json()
    fiveWayWorkflowJSON = await fiveWayResponse.json()
  } catch (error) {
    console.error('Error loading workflow files:', error)
  }
}

/**
 * Generates a random float within the specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} A random float within the specified range.
 */
function getRandomFloat (min, max) {
  return Math.random() * (max - min) + min
}

function updateConditioningSetAreaNodes (workflowJSON, numAreas, areas) {
  const conditioningSetAreaNodes = workflowJSON.nodes.filter(
    (node) => node.type === 'ConditioningSetArea'
  )

  for (let i = 0; i < numAreas; i++) {
    const area = areas[i]
    const width = parseInt(area.style.width)
    const height = parseInt(area.style.height)
    const x = parseInt(area.style.left)
    const y = parseInt(area.style.top)

    if (conditioningSetAreaNodes[i]) {
      conditioningSetAreaNodes[i].widgets_values = [width, height, x, y]
    }
  }
}

function updateInterpolatePredictionsNodes (workflowJSON) {
  const enableScaleBRandomization = document.getElementById('enableScaleBRandomization').checked
  const scaleBMin = parseFloat(document.getElementById('scaleBMin').value)
  const scaleBMax = parseFloat(document.getElementById('scaleBMax').value)

  const interpolatePredictionsNodes = workflowJSON.nodes.filter(
    (node) => node.type === 'InterpolatePredictions'
  )

  if (enableScaleBRandomization) {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[0] = getRandomFloat(scaleBMin, scaleBMax)
    })
  } else {
    interpolatePredictionsNodes.forEach((node) => {
      node.widgets_values[0] = getRandomFloat(0.6, 0.8)
    })
  }
}

function updateCharacteristicGuidancePredictionNodes (workflowJSON) {
  const characteristicGuidancePredictionNodes = workflowJSON.nodes.filter(
    (node) => node.type === 'CharacteristicGuidancePrediction'
  )

  const enableLogStepRandomization = document.getElementById('enableLogStepRandomization').checked
  const logStepMin = parseFloat(document.getElementById('logStepMin').value)
  const logStepMax = parseFloat(document.getElementById('logStepMax').value)

  const enableLogToleranceRandomization = document.getElementById('enableLogToleranceRandomization').checked
  const logToleranceMin = parseFloat(document.getElementById('logToleranceMin').value)
  const logToleranceMax = parseFloat(document.getElementById('logToleranceMax').value)

  const enableKeepToleranceRandomization = document.getElementById('enableKeepToleranceRandomization').checked
  const keepToleranceMin = parseInt(document.getElementById('keepToleranceMin').value)
  const keepToleranceMax = parseInt(document.getElementById('keepToleranceMax').value)

  characteristicGuidancePredictionNodes.forEach((node) => {
    if (enableLogStepRandomization) {
      node.widgets_values[2] = getRandomFloat(logStepMin, logStepMax)
    }

    if (enableLogToleranceRandomization) {
      node.widgets_values[3] = getRandomFloat(logToleranceMin, logToleranceMax)
    }

    if (enableKeepToleranceRandomization) {
      node.widgets_values[4] = Math.floor(getRandomFloat(keepToleranceMin, keepToleranceMax))
    }
  })
}

function handleWorkflowData (shouldExport) {
  const numAreas = areas.length
  if (numAreas === 2 || numAreas === 3 || numAreas === 4 || numAreas === 5) {
    const workflowJSON =
      numAreas === 2
        ? { ...twoWayWorkflowJSON }
        : numAreas === 3
          ? { ...threeWayWorkflowJSON }
          : numAreas === 4
            ? { ...fourWayWorkflowJSON }
            : { ...fiveWayWorkflowJSON }

    // Update the ConditioningSetArea nodes
    updateConditioningSetAreaNodes(workflowJSON, numAreas, areas)

    // Update the InterpolatePredictions nodes
    updateInterpolatePredictionsNodes(workflowJSON)

    // Update the CharacteristicGuidancePrediction nodes
    updateCharacteristicGuidancePredictionNodes(workflowJSON)

    const workflowData = JSON.stringify(workflowJSON, null, 2)

    if (shouldExport) {
      const workflowName = `${numAreas}way-conditional-workflow.json`
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(workflowData)
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', workflowName)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } else {
      navigator.clipboard
        .writeText(workflowData)
        .then(() => {
          alert(`${numAreas}way-conditional-workflow.json copied to clipboard`)
        })
        .catch((err) => {
          console.error('Failed to copy workflow data: ', err)
        })
    }
  } else {
    const action = shouldExport ? 'export' : 'copy'
    alert(`Please select 2, 3, 4, or 5 areas to ${action} workflow data.`)
  }
}

function copyToClipboard () {
  handleWorkflowData(false)
}

function exportToWorkflow () {
  handleWorkflowData(true)
}

export { handleWorkflowData, copyToClipboard, exportToWorkflow, updateCharacteristicGuidancePredictionNodes, updateConditioningSetAreaNodes, updateInterpolatePredictionsNodes, loadWorkflowFiles }
