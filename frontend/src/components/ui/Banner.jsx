import { useState, useEffect, useRef } from 'react'
import { closeIcon, errorFillIcon, infoIcon, warningFillIcon } from '../../assets/img/icons'
import Icon from './Icon'
import IconButton from './IconButton'
import './styles/Banner.css'

const Banner = ({type, closable, to, toLabel, icon, onClick, classNameContainer, ...props}) => {
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(true)
  const contentRef = useRef()

  useEffect(() => {
    if(props.content && contentRef.current) {
      contentRef.current.innerHTML = props.content
    }
  }, [props])

  useEffect(() => {
    if (dismissed) {
      setTimeout(() => {
        setShow(false)
      }, 300)
    }
  }, [dismissed])



  return (
    show ?
    <div
      className={`banner-container${dismissed ? ` d-none` : ''}${classNameContainer ? ` ${classNameContainer}` : ''}`}
    >

      <div className={`banner${dismissed ? ` banner-dismissed` : ''}${type ? ` banner-${type}` : ''}${props.className ? ` ${props.className}` : ""}`}
        onClick={onClick ? onClick : null}
      >
        <div className="flex-grow-1 flex flex-col gap-2">
          <div className="flex gap-3 flex-grow-1">
          <div className="flex-grow-1">
            <div className="flex align-center">
              {icon ?
              <div className="banner-icon">
                <Icon
                  size="md"
                  className={`fill-${type}`}
                  icon={icon}
                />
              </div>
              :  props.customIcon ?
              props.customIcon
              : props.noIcon ? null :
              <div className="banner-icon">
                {type === 'secondary'
                  ? 
                  <Icon
                    icon={infoIcon}
                  />
                : type === 'danger'
                  ? 
                  <Icon
                    className={`fill-${type}`}
                    icon={errorFillIcon}
                  />
                  : type === 'warning'
                  ? 
                  <Icon
                    className={`fill-${type}`}
                    icon={warningFillIcon}
                  />
                  : type === "primary" || type === "success"
                  ? 
                  <Icon
                    className={`fill-${type}`}
                    icon={infoIcon}
                  />
                  : null}
              </div>
              }
              {props.title ? 
                <div className="banner-title flex-grow-1 line-height-1">
                  {props.title}
                </div>
              : null}
            </div>
            {props.content ? 
              <div className="banner-content flex-grow-1 text-secondary pt-1"
                ref={contentRef}
              >
              </div>
            : null}
          </div>
          {closable ?
            <div className="banner-close">
            <IconButton
              variant="link"
              icon={closeIcon}
              onClick={() => {
                setDismissed(true)
                props.onClose ? props.onClose() : null
              }}
            />
            </div>
          : null}
        </div>
        {props.action ? props.action : null}
        </div>
      </div>
    </div>
    : null
  )
}

export default Banner