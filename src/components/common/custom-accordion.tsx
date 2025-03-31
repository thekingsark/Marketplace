import React from 'react'
import { Icon } from './icon'
import { dir } from 'i18next'
import useGlobalContext from '@/hooks/use-context'

export interface AccordionItem {
  id: string
  collapsedId: string
  title: React.ReactNode
  content?: React.ReactNode
  items?: AccordionItem[]
}

export interface CustomAccordionProps {
  data: AccordionItem[]
  onSelectSubItem?: (mainItemId: string, subItemId: string) => void
  style?: React.CSSProperties
}

export const CustomAccordion = (props: CustomAccordionProps) => {
  const { data, onSelectSubItem } = props
  const context = useGlobalContext()
  const lang = context.currentLanguage
  const direction = dir(lang)

  return (
    <div className="accordion accordion-general" style={{ ...(props.style ?? {}) }}>
      {data.map((itm, index) => (
        <div key={index} className="accordion-item">
          <h2 className="accordion-header" id={itm.id}>
            <button
              className={`accordion-button collapsed`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${itm.collapsedId}`}
              aria-expanded={index === 0 ? 'true' : 'false'}
              aria-controls={itm.collapsedId}
            >
              {itm.title}
            </button>
          </h2>
          <div
            id={itm.collapsedId}
            className={`accordion-collapse collapse`}
            aria-labelledby={itm.id}
          >
            <div className="accordion-body">
              {itm.content}
              {itm.items?.map((subItem, subIndex) => {
                return (
                  <div
                    key={subIndex}
                    className="accordion-sub-item"
                    onClick={() => onSelectSubItem?.(itm.id, subItem.id)}
                  >
                    <span>{subItem.title}</span>
                    <div className="accordion-sub-item-icon d-flex align-items-center">
                      <Icon type={direction === 'rtl' ? 'arrows/arrow-left-filled' : 'arrows/arrow-right-filled'} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
