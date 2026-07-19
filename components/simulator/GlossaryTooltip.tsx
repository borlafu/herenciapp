'use client'

import { useState } from 'react'
import { findTerm } from '@/lib/glossary'

interface GlossaryTooltipProps {
  termId: string
  children: React.ReactNode
}

export function GlossaryTooltip({ termId, children }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false)
  const term = findTerm(termId)

  if (!term) return <span>{children}</span>

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="underline decoration-dotted cursor-help text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
        aria-expanded={open}
        aria-describedby={`tooltip-${termId}`}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => e.key === 'Escape' && setOpen(false)}
      >
        {children}
      </button>
      {open && (
        <span
          id={`tooltip-${termId}`}
          role="tooltip"
          className="absolute z-10 bottom-full left-0 mb-2 w-72 rounded-lg bg-gray-900 text-white text-sm px-3 py-2 shadow-lg"
        >
          <strong className="block mb-1">{term.label}</strong>
          {term.definition}
        </span>
      )}
    </span>
  )
}
