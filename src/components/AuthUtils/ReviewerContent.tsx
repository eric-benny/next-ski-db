import React, { ReactNode } from 'react'
import { SignedIn } from '@clerk/nextjs'

export function ReviewerContent({children}: { children?: ReactNode }) {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  )
}