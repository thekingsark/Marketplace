'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import { Icon } from '../common/icon'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      return
    }

    setTheme('light')
  }

  return (
    <button
      className="btn theme-btn border-btn footer-btn"
      aria-label="Change theme"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Icon type="auth/half-moon" size={32} />
      ) : (
        <Icon type="auth/sun" size={32} color="var(--font_1)" />
      )}
      <style jsx>{`
        .theme-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background_4);
          height: 50px;
          display: inline-block;
          border-radius: 6px;
          overflow: hidden;
          line-height: 0;
          padding: 0 16px;
        }
      `}</style>
    </button>
  )
}

export default ThemeChanger
