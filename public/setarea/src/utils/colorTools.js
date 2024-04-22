/**
 * Returns a random RGBA color.
 * @returns {string} A string representing a random RGBA color.
 */
function getRandomRGBAColor () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  // Set alpha value to 0.5
  const a = 0.5
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export default getRandomRGBAColor
