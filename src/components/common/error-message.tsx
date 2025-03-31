import React from 'react'

export const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <>
      <p className="error-message mt-10" style={{ color: 'red' }}>
        {error}
      </p>
    </>
  )
}
