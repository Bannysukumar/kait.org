'use client'

import React from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className=" bottom-0 w-full border-t bg-gray-50 py-4 ">
      <div className="  flex container m-auto flex-col md:flex-row justify-between items-center gap-4 px-4">
        <div className="flex  flex-wrap gap-2">
          <Link href="/user/privacy-policy" passHref>
            <Button
              variant="contained"
              style={{ backgroundColor: '#dc2626', fontSize: '12px' }}
              className="!text-white hover:!bg-red-700"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Button>
          </Link>
          <Link href="/user/terms-and-conditions" passHref>
            <Button
              variant="contained"
              style={{ backgroundColor: '#dc2626', fontSize: '12px' }}
              className="!text-white hover:!bg-red-700"
              aria-label="Terms and Conditions"
            >
              Terms & Conditions
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-600 text-center md:text-right">
          © 2025 KAIT Staking. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
