const shapes = []
export function addShapes(map, shape) {
  let polygon
  switch (shape.type) {
    case 'circle': {
      // eslint-disable-next-line
      polygon = new google.maps.Circle({
        center: shape.center,
        map: map,
        radius: shape.radius, //in meters
        fillColor: '#65B66D',
        fillOpacity: 0.2,
        strokeColor: '#65B66D',
        strokeWeight: 1,
      })
      break
    }
  }
  shapes.push(polygon)
}

export function clearShapes() {
  shapes.forEach((polygon) => {
    polygon.setMap(null)
  })
  shapes.length = 0
}
