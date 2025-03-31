import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface ReportAccountModalProps {
  isOpened: boolean
  close: () => void
  onConfirm: (reportOption: string, details?: string) => Promise<boolean>
}

export const ReportAccountModal = (props: ReportAccountModalProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, close, onConfirm } = props
  const [reportInProgress, setReportInProgress] = useState(false)
  const [selectedReportValue, setSelectedReportValue] = useState('' as string)
  const [otherDescription, setOtherDescription] = useState('' as string)

  const handleSetReportValue = (value: string) => {
    setOtherDescription('')
    if (selectedReportValue === value) {
      setSelectedReportValue('')
      return
    }

    setSelectedReportValue(value)
  }

  const handleReport = async () => {
    if (reportInProgress || !selectedReportValue) {
      return
    }

    setReportInProgress(true)
    try {
      const description = otherDescription.substring(0, 200)
      const result = await onConfirm(selectedReportValue, description)
      if (!result) {
        toast.error(t('generic.something_went_wrong'))
        return
      }

      setOtherDescription('')
      toast.success(t('reports.was_reported'))
      setSelectedReportValue('')
      close()
    } catch (error) {
      console.error(`Error while reporting: ${error}`)
      toast.error(t('generic.something_went_wrong'))
    } finally {
      setReportInProgress(false)
    }
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>
        {t('reports.sure_to_report', {
          name: t('reports.sure_to_report_account'),
        })}
      </h4>

      <div className="mt-40">
        <div
          className="d-flex justify-content-between align-items-center report-option"
          onClick={() => handleSetReportValue('sexually_inappropriate')}
        >
          <span>{t('reports.sexually_inappropriate')}</span>
          <input
            type="checkbox"
            onChange={() => handleSetReportValue('sexually_inappropriate')}
            checked={selectedReportValue === 'sexually_inappropriate'}
          />
        </div>
        <div
          className="d-flex justify-content-between align-items-center report-option"
          onClick={() => handleSetReportValue('offensive')}
        >
          <span>{t('reports.offensive_content')}</span>
          <input
            type="checkbox"
            onChange={() => handleSetReportValue('offensive')}
            checked={selectedReportValue === 'offensive'}
          />
        </div>
        <div
          className="d-flex justify-content-between align-items-center report-option"
          onClick={() => handleSetReportValue('other')}
        >
          <span>{t('reports.other')}</span>
          <input
            type="checkbox"
            onChange={() => handleSetReportValue('other')}
            checked={selectedReportValue === 'other'}
          />
        </div>
      </div>

      <div className="report-textarea-root mt-10">
        {selectedReportValue === 'other' && (
          <textarea
            name="description"
            id="description"
            className="report-textarea"
            value={otherDescription}
            maxLength={200}
            onChange={(e) => setOtherDescription(e.target.value)}
            placeholder={t('reports.like_to_give_details')}
          />
        )}
      </div>

      <div className="d-flex justify-content-between gap-3 mt-20 ml-20 mr-20">
        <button className="btn btn-secondary report-button" onClick={() => close()}>
          {t('generic.cancel')}
        </button>
        <button
          className={`btn report-button ${
            selectedReportValue && !reportInProgress ? 'fill-btn' : 'btn-secondary'
          }`}
          disabled={reportInProgress}
          onClick={handleReport}
        >
          {reportInProgress ? (
            <div className="loader-wrapper">
              <Icon type="loading" color={'#fff'} size={40} />
            </div>
          ) : (
            t('reports.report_action')
          )}
        </button>
      </div>

      <style jsx>{`
        .report-option {
          cursor: pointer;
          padding: 16px 0;
          border-radius: 6px;
        }
        .loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .report-button {
          width: 100%;
          height: 50px;
          padding: 0;
          line-height: 50px;
        }
        .report-option:hover {
          background: var(--background_3);
        }
        .report-textarea-root {
          padding: 0 8px;
        }
        .report-textarea {
          height: 100px;
          width: 100%;
          border: 1px solid var(--separator);
          border-radius: 6px;
          background: var(--background_4);
          color: var(--font_1);
          font-size: 16px;
          padding: 15px 20px;
          outline: none;
          box-shadow: none;
          margin-bottom: 30px;
          resize: none;
        }
      `}</style>
    </CustomModal>
  )
}
