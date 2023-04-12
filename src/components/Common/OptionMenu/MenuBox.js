import Permission from '../Permission/Permission'

const MenusBox = ({menusList}) => {
  return (
    <div className="w-full flex flex-row justify-between items-end">
      <div className="tm-dashboard-statistics-dropdown">
        <div className="arrow relative top-3 right-0"></div>
        <div className="msg-box bg-white w-36 tm-box-shadow1">
          {menusList.map(({menu, data, onClickHandler, permissionId}) =>
            permissionId ? (
              <Permission key={menu} permissionId={permissionId}>
                <div
                  key={menu}
                  className={`tm-para2 px-4 py-3 tm-border1-bottom cursor-pointer`}
                  onClick={onClickHandler}
                >
                  {data}
                </div>
              </Permission>
            ) : (
              <div
                key={menu}
                className={`tm-para2 px-4 py-3 tm-border1-bottom cursor-pointer`}
                onClick={onClickHandler}
              >
                {data}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default MenusBox
