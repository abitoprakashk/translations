import {useEffect} from 'react'

export default function GetVerloop(props) {
  const isPremium = props.isPremium
  const verloop = () => {
    if (isPremium) {
      ;(function (w, d, s, u) {
        w.Verloop = function (c) {
          w.Verloop._.push(c)
        }
        w.Verloop._ = []
        w.Verloop.url = u
        var h = d.getElementsByTagName(s)[0],
          j = d.createElement(s)
        j.async = true
        j.src = 'https://teachmint.verloop.io/livechat/script.min.js'
        h.parentNode.insertBefore(j, h)
      })(window, document, 'script', 'https://teachmint.verloop.io/livechat')

      window.Verloop(function () {
        this.setRecipe('dL4m6hWHGhMpZzMDa')
      })
    }
  }
  useEffect(() => {
    verloop()
  }, [isPremium])

  return verloop
}
