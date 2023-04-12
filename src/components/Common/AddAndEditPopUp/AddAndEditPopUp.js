import {useTranslation} from 'react-i18next'
import crossIcon from '../../../assets/images/icons/cross-gray.svg'
import InputField from '../../Common/InputField/InputField'

export default function AddAndEditPopUp({
  title,
  handleClosePopUp,
  popUpImage,
  inputFields,
  handleSubmit,
  handleInputChange,
  errorObject,
}) {
  const {t} = useTranslation()
  const getInputForm = (
    <>
      <div className="px-4 py-3 hidden lg:flex items-center justify-between tm-border1-dark-bottom">
        <div className="tm-h5">{title}</div>
        <img
          src={crossIcon}
          alt="cross"
          className="w-6 h-6 cursor-pointer"
          onClick={handleClosePopUp}
        />
      </div>

      {popUpImage && (
        <div className="bg-white flex justify-center items-center p-4 lg:pt-8">
          <div className="relative">
            <img
              src={popUpImage}
              alt="Icon"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>
      )}

      <div className="lg:p-4">
        {Object.values(inputFields).map(
          ({
            fieldType,
            title,
            value,
            placeholder,
            fieldName,
            dropdownItems,
            countryCodeItem,
          }) => (
            <div key={fieldName}>
              <InputField
                fieldType={fieldType}
                title={title}
                placeholder={placeholder}
                value={value}
                handleChange={handleInputChange}
                fieldName={fieldName}
                dropdownItems={dropdownItems}
                countryCodeItem={countryCodeItem}
                errorText={errorObject[fieldName]}
              />
            </div>
          )
        )}

        <div className="tm-btn2-blue my-6 w-44" onClick={handleSubmit}>
          {t('save')}
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="tm-edit-profile-page px-4 py-3 relative lg:hidden">
        {getInputForm}
      </div>

      <div
        className="tm-popup-bg hidden lg:flex justify-center items-center"
        onClick={handleClosePopUp}
      >
        <div
          className="bg-white w-4/12 tm-border-radius1"
          onClick={(e) => e.stopPropagation()}
        >
          {getInputForm}
        </div>
      </div>
    </>
  )
}
