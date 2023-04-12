// import {t} from 'i18next'
export default (editor) => {
  const openDialog = () =>
    editor.windowManager.open({
      title: 'Image Editing',
      describe: 'image-panel',
      body: {
        type: 'panel',
        items: [
          {
            type: 'label', // component type
            label: 'Set Corner',
            items: [],
          },
          {
            type: 'slider', // component type
            name: 'radius', // identifier
            label: 'Radius',
            min: 0, // minimum value
            max: 50,
          },
          {
            type: 'label', // component type
            label: '‎',
            items: [],
          },
          {
            type: 'label', // component type
            label: 'Set Border Styling', // text for the group label
            items: [
              {
                type: 'grid', // component type
                columns: 2, // number of columns
                items: [
                  {
                    type: 'input', // component type
                    name: 'borderThickness', // identifier
                    label: 'Thickness',
                    min: 0, // minimum value
                    max: 20,
                    placeholder: '5',
                  },
                  {
                    type: 'colorinput', // component type
                    name: 'borderColor', // identifier
                    label: 'Colour',
                  },
                ], // array of panel components
              },
            ], // array of panel components
          },
        ],
      },
      buttons: [
        {
          type: 'cancel',
          text: 'Close',
        },
        {
          type: 'submit',
          text: 'Save',
          buttonType: 'primary',
        },
      ],
      initialData: {
        radius: (function () {
          const selectedNode = editor?.selection.getNode()
          const currentValue = selectedNode.getAttribute('data-radius')
          return Number(currentValue) || 0
        })(),
        borderThickness: (function () {
          const selectedNode = editor?.selection.getNode()
          const currentValue = selectedNode.getAttribute('data-borderThickness')
          return currentValue || '0'
        })(),
        borderColor: (function () {
          const selectedNode = editor?.selection.getNode()
          const currentValue = selectedNode.getAttribute('data-borderColor')
          return currentValue || '#000000'
        })(),
      },
      onSubmit: (api) => {
        const data = api.getData()
        const {radius, borderThickness, borderColor} = data
        const node = editor?.selection.getNode()
        node.style.borderRadius = data.radius + '%'
        node.style.border = `${borderThickness}px solid ${borderColor}`

        node.setAttribute('data-radius', radius || 0)
        node.setAttribute('data-borderThickness', borderThickness || 0)
        node.setAttribute('data-borderColor', borderColor || 0)

        node.setAttribute(
          'data-mce-style',
          `border-radius: ${radius}%; border: ${borderThickness}px solid ${borderColor};` ||
            ''
        )
        api.close()
      },
    })
  /* Add a button that opens a window */
  editor.ui.registry.addButton('imageRadius', {
    text: 'Set image corners',
    onAction: () => {
      /* Open window */
      openDialog()
    },
  })

  /* Return the metadata for the help plugin */
  return {
    getMetadata: () => ({
      name: 'imageRadius',
    }),
  }
}
