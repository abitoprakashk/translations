/* eslint-disable */
export function routeLines(gMap) {
  // This is base design of the route lines
  const lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 2,
  }

  function createRouteLines(places, customLine = null, lineColor = '#000000') {
    const routePaths = []
    const linePath = new google.maps.Polyline({
      path: places,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 0,
      strokeWeight: 1,
      icons: [
        {
          icon: customLine || lineSymbol,
          offset: '0',
          repeat: '20px',
        },
      ],
    })
    linePath.setMap(gMap)
    routePaths.push(linePath)
    return routePaths
  }

  function clearRouteLines(routePaths) {
    if (routePaths?.length > 0) {
      routePaths.forEach((line) => {
        line.setMap(null)
      })
    }
    return routePaths
  }

  return {createRouteLines, clearRouteLines}
}
