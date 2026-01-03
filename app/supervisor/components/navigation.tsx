'use client'
import Image from 'next/image'
import Link from 'next/link'
import { RiWallet3Line } from 'react-icons/ri'
import { MdOutlineDashboard } from 'react-icons/md'
import { GrShareOption } from 'react-icons/gr'
import { MdOutlineListAlt } from 'react-icons/md'
import { PiUserListBold } from 'react-icons/pi'
import { LuSettings } from 'react-icons/lu'
import Logo from '../../../assets/logo2x.png'
import { LuCircleUserRound } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { GoArrowSwitch } from 'react-icons/go'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Button } from '../../../components/ui/button'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import useLogout from '../../../components/hooks/userLogout'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { handleLogout } = useLogout()
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState<string>('Supervisor')

  const routeTitles: Record<string, string> = {
    '/supervisor/dashboard': 'Supervisor Dashboard',
    '/supervisor/stakingcontracts/allcontracts': 'All Staking Contracts',
    '/supervisor/stakingcontracts/walletSummary': 'Wallet Summary',
    '/supervisor/stakingcontracts/voucherSummary': 'Voucher Summary',
    '/supervisor/stakingcontracts/voucherUsageSummary': 'Voucher Usage Summary',
    '/supervisor/stakingcontracts/voucherReciptSummary': 'Voucher Recipt Summary',
    '/supervisor/Withdrawal/pendingApproval': 'Pending Withdrawals',
    '/supervisor/Withdrawal/approved': 'Approved Withdrawals',
    '/supervisor/Withdrawal/rejected': 'Rejected Withdrawals',
    '/supervisor/KYCList': 'KYC List',
    '/supervisor/UserList': 'User List',
    '/supervisor/profile': 'Supervisor Profile',
  }

  // ✅ Update tab title on route change
  useEffect(() => {
    const pageName = routeTitles[pathname] || 'Supervisor Panel'
    document.title = `${pageName} - KAIT Supervisor`
  }, [pathname])


  return (
    <div>
      <nav className="h-14 bg-[#242650]">
        <div className="flex justify-between px-4 md:px-20">
          <Image src={Logo} alt="Logo" priority width={50} height={50} />
          <div className="flex items-center text-gray-100">
            Hello! /supervisor
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="p-0 w-11 h-11">
                  <LuCircleUserRound
                    style={{ width: '32px', height: '32px' }}
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40 mr-20 bg-white">
                <DropdownMenuLabel>Hello! </DropdownMenuLabel>
                <DropdownMenuSeparator className=" bg-black" />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href="/supervisor/profile"
                      className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block border-b border-gray-100 font-semibold text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {!isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <nav
        className={`flex flex-col lg:flex-row md:flex-col sm:flex-col justify-center items-center gap-6 bg-white box-border shadow-xl ${isOpen ? 'block' : 'hidden'} md:flex transition-all duration-300`}
      >
        <Link
          href="/supervisor/dashboard"
          className={`flex justify-center items-center py-[12px] gap-1.5 ${pathname === '/supervisor/dashboard'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-[#7668fe]'
            }`}
        >
          <MdOutlineDashboard className=" text-[23px]" /> Dashboard
        </Link>

        {/* <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex justify-center items-center py-[12px] gap-1.5 ${
                pathname.startsWith('/supervisor/kaitwallet/')
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-[#7668fe]'
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-base font-medium flex items-center justify-center gap-1.5"
              >
                <RiWallet3Line className=" text-[23px]" /> KAIT Wallet
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-sm flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
              <Link
                href="/supervisor/kaitwallet/pendingApproval"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Pending Approval
              </Link>
              <Link
                href="/supervisor/kaitwallet/pending"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Pending
              </Link>
              <Link
                href="/supervisor/kaitwallet/rejected"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Rejected
              </Link>
            </div>
          </div>
        </div> */}

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex justify-center items-center py-[12px] gap-1.5 ${pathname.startsWith('/supervisor/stakingcontracts/')
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-[#7668fe]'
                }`}
            >
              <Link
                href="#"
                className="menu-hover text-base font-medium  flex items-center justify-center gap-1.5"
              >
                <GrShareOption className=" text-[23px]" /> Staking Contracts
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-sm flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
              <Link
                href="/supervisor/stakingcontracts/allcontracts"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                All Contracts
              </Link>
              <Link
                href="/supervisor/stakingcontracts/walletSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Wallet Summary
              </Link>

              <Link
                href="/supervisor/stakingcontracts/voucherSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Voucher Summary
              </Link>
              <Link
                href="/supervisor/stakingcontracts/voucherUsageSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Voucher Usage Summary
              </Link>
                <Link
                href="/supervisor/stakingcontracts/voucherReciptSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Voucher Recipt Summary
              </Link>
              {/* <Link
                href="/supervisor/stakingcontracts/incomeAccountSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Income Account Summary
              </Link>
              <Link
                href="/supervisor/stakingcontracts/adhocwalletsummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Adhoc Wallet Summary
              </Link>
              <Link
                href="/supervisor/stakingcontracts/Bonusaccountsummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Bonus Account Summary
              </Link>
              <Link
                href="/supervisor/stakingcontracts/VoucherReceiptSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Voucher Receipt Summary
              </Link>
              <Link
                href="/supervisor/stakingcontracts/RestakeWalletSummary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Restake Wallet Summary
              </Link> */}
              {/* <Link
                href="/supervisor/stakingcontracts/ClubVolume"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Club Volume
              </Link> */}
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex justify-center items-center py-[12px] gap-1.5 ${pathname.startsWith('/supervisor/Withdrawal/')
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-[#7668fe]'
                }`}
            >
              <Link
                href="#"
                className="menu-hover text-base font-medium  flex items-center justify-center gap-1.5"
              >
                <GoArrowSwitch className=" text-[23px]" /> Withdrawal
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-sm flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
              <Link
                href="/supervisor/Withdrawal/pendingApproval"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Pending For Approval
              </Link>
              <Link
                href="/supervisor/Withdrawal/approved"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Approved
              </Link>
              <Link
                href="/supervisor/Withdrawal/rejected"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Rejected
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/supervisor/KYCList"
          className={`flex justify-center items-center py-[12px] gap-1.5 ${pathname === '/supervisor/KYCList'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-[#7668fe]'
            }`}
        >
          <MdOutlineListAlt className=" text-[23px]" /> KYC List
        </Link>
        <Link
          href="/supervisor/UserList"
          className={`flex justify-center items-center py-[12px] gap-1.5 ${pathname === '/supervisor/UserList'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-[#7668fe]'
            }`}
        >
          <PiUserListBold className=" text-[23px]" /> User List
        </Link>

        {/* <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex justify-center items-center py-[12px] gap-1.5 ${
                pathname.startsWith('/supervisor/settings/.')
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-[#7668fe]'
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-base font-medium  flex items-center justify-center gap-1.5"
              >
                <LuSettings className=" text-[23px]" /> Settings
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-sm flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
       \
                <Link
                href="/supervisor/settings/addWallet"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
               WalletSplit Config
              </Link>
              <Link
                href="/supervisor/settings/stakePlans"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                StakePlans
              </Link>
               <Link
                href="/supervisor/beneficiary"
                className="my-2 block border-b border-gray-100 font-semibold   text-[#7668fe] hover:duration-1000 hover:text-black md:mx-2"
              >
                Beneficiary
              </Link>
            </div>
          </div>
        </div> */}
      </nav>
    </div>
  )
}

export default Navigation