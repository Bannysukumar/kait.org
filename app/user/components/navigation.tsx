// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'
// import { RiWallet3Line } from 'react-icons/ri'
// import { MdOutlineDashboard } from 'react-icons/md'
// import { GrShareOption } from 'react-icons/gr'
// import { TbCash, TbTransfer } from 'react-icons/tb'
// import { PiUserListBold } from 'react-icons/pi'
// import { LuSettings } from 'react-icons/lu'
// import Logo from '../../../assets/logo2x.png'
// import { LuCircleUserRound } from 'react-icons/lu'
// import { FaUsers } from 'react-icons/fa6'
// import { PiHandbagFill } from 'react-icons/pi'
// import { useEffect, useState } from 'react'
// import Cookies from 'js-cookie'
// import { usePathname, useRouter } from 'next/navigation'

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../../../components/ui/dropdown-menu'
// import { Button } from '../../../components/ui/button'
// import {
//   ArrowLeftRight,
//   ArrowUpFromLine,
//   Briefcase,
//   ChartBar,
//   Download,
//   Eye,
//   NotebookText,
//   Power,
//   User,
// } from 'lucide-react'
// import useLogout from '../../../components/hooks/userLogout'
// import { decodeJWT } from '../../../lib/auth'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { verifyKYCStatus } from '../../../store/slices/index'

// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [decodedToken, setDecodedToken] = useState<any>(null) // To store decoded token data

//   const router = useRouter()
//   const { handleLogout } = useLogout()

//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(verifyKYCStatus())
//   }, [dispatch])

//   const { kycVerified } = useAppSelector((state) => state.auth)
//   const { user } = useAppSelector((state) => state.auth)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       try {
//         const decoded = decodeJWT(token)
//         setDecodedToken(decoded)

//         if (decoded?.userName) {
//           setIsAuthenticated(true)
//         } else {
//           setIsAuthenticated(false)
//         }
//       } catch (error) {
//         console.error('Error decoding the token:', error)
//         setIsAuthenticated(false)
//       }
//     } else {
//       setIsAuthenticated(false)
//     }
//   }, [user])
//   const pathname = usePathname()
//   const isKaitWalletActive = pathname.startsWith('/user/kaitwallet')
//   const isStakingActive = pathname.startsWith('/user/stakingcontracts')
//   const isvoucher = pathname.startsWith('/user/voucher')
//   const isTransfer = pathname.startsWith('/user/transfers')
//   return (
//     <div className="bg-white box-border shadow-xl">
//       {/* bg-gradient-to-r from-pink-700 to-gray-800 */}
//       <nav className=" bg-gradient-to-r from-blue-500 to-purple-700 ">
//         <div className=" container m-auto flex h-14 justify-between items-center px-4 md:px-20">
//           <Image
//             className=" w-[45px] h-[45px] border-[white] border-4 rounded-[60px] items-center flex "
//             src={Logo}
//             alt="Logo"
//           />
//           <div className=" flex justify-center items-center font-bold text-white">
//             <h2>KAIT Staking - User Panel</h2>
//           </div>
//           <div className="flex items-center text-gray-100">
//             <div className=" items-center flex  ">
//               {decodedToken?.name ? `Hello! / ${decodedToken.name}` : '/user'}

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className="p-0 w-11 h-11">
//                     <LuCircleUserRound
//                       style={{ width: '32px', height: '32px' }}
//                     />
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent className="w-40 mr-20 bg-white">
//                   <DropdownMenuLabel>
//                     {decodedToken?.name
//                       ? `Welcome, ${decodedToken.name}`
//                       : '/user'}
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator className=" bg-black" />
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <Link
//                         href="/user/profile"
//                         className="gap-1 flex  w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
//                       >
//                         <User />
//                         My Profile
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <Link
//                         href=""
//                         className=" gap-1 flex  w-full items-center  border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
//                       >
//                         <Eye /> Activity
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   {/* <DropdownMenuSeparator className=" bg-black" /> */}
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem>
//                       <Link
//                         href="/auth/signin"
//                         onClick={handleLogout}
//                         className="gap-1 flex  w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
//                       >
//                         <Power /> Logout
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="lg:hidden text-white"
//           >
//             {!isOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-6 h-6 transition-all duration-300"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-6 h-6 transition-all duration-300"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>
//       </nav>

//       <nav
//         className={`flex flex-col lg:flex-row md:flex-col sm:flex-col container m-auto justify-center items-center
//            gap-6  bg-transparent   ${isOpen ? 'block' : 'hidden'
//           } lg:flex transition-all duration-300`}
//       >
//         <Link
//           href="/user/dashboard"
//           className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${pathname === '/user/dashboard'
//             ? 'border-b-2 border-purple-800 font-semibold'
//             : ''
//             }`}
//         >
//           <MdOutlineDashboard className=" text-[14px]" /> Dashboard
//         </Link>
//         <Link
//           href="/user/walletSummary"
//           className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${pathname === '/user/walletSummary'
//             ? 'border-b-2 border-purple-800 font-semibold'
//             : ''
//             }`}
//         >
//           <ChartBar className=" text-[14px] w-[10.5px] h-[10.5px]" /> Wallet Summary
//         </Link>

//         {/* <div className="flex">
//           <div className="group relative cursor-pointer">
//             <div
//               className={`flex items-center justify-center py-[12px] text-purple-800 ${
//                 isKaitWalletActive
//                   ? 'border-b-2 border-purple-800 font-semibold'
//                   : ''
//               }`}
//             >
//               <Link
//                 href="#"
//                 className="menu-hover text-[14px] font-medium flex items-center justify-center gap-[5px]"
//               >
//                 <RiWallet3Line className="text-[14px]" /> KAIT Wallet
//               </Link>
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6 m-0"
//                 >
//                   <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                 </svg>
//               </span>
//             </div>

//             <div className="invisible absolute z-50 text-[14px] flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
//               <Link
//                 href="/user/kaitwallet/summary "
//                 className="my-2 flex border-b items-center border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <NotebookText className="w-[14px] mr-[2px]" />
//                 Summary
//               </Link>
//             </div>
//           </div>
//         </div> */}

//         <div className="flex">
//           <div className="group relative cursor-pointer">
//             <div
//               className={`flex items-center justify-center py-[12px] text-purple-800 ${isStakingActive
//                 ? 'border-b-2 border-purple-800 font-semibold'
//                 : ''
//                 }`}
//             >
//               <Link
//                 href="#"
//                 className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
//               >
//                 <GrShareOption className=" text-[14px]" /> Staking Contracts
//               </Link>
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6 m-0"
//                 >
//                   <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                 </svg>
//               </span>
//             </div>

//             <div className="invisible text-[14px] absolute z-50 flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
//               <Link
//                 href="/user/stakingcontracts/newStaking"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ArrowUpFromLine className=" mr-2 w-[15px]" />
//                 New Staking
//               </Link>
//               <Link
//                 href="/user/stakingcontracts/yourstakingcontracts"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ArrowUpFromLine className=" mr-2 w-[15px]" /> Your Staking
//                 Contracts
//               </Link>
//               {/* <Link
//                 href="/user/stakingcontracts/walletSummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Wallet Summary
//               </Link> */}
//               {/* <Link
//                 href="/user/stakingcontracts/roswalletsummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 ROS Wallet Summary
//               </Link>

//               <Link
//                 href="/user/stakingcontracts/incomewalletsummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Income Wallet Summary
//               </Link>
//               <Link
//                 href="/user/stakingcontracts/adhocwalletsummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Adhoc Wallet Summary
//               </Link>
//               <Link
//                 href="/user/stakingcontracts/bonuswalletsummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Bonus Wallet Summary
//               </Link>
//               <Link
//                 href="/user/stakingcontracts/restakewalletSummary"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Restake Wallet Summary
//               </Link> */}
//               {/* <Link
//                 href="/user/stakingcontracts/incomewithdrawal"
//                 className="my-2 block border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 Income-Widthrawal
//               </Link> */}

//             </div>
//           </div>
//         </div>

//         <Link
//           href="/user/teamsummary"
//           className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${pathname === '/user/teamsummary'
//             ? 'border-b-2 border-purple-800 font-semibold'
//             : ''
//             }`}
//         >
//           <FaUsers className=" text-[14px]" /> Team Summary
//         </Link>

//         <div className="flex">
//           <div className="group relative cursor-pointer">
//             <div
//               className={`flex items-center justify-center py-[12px] text-purple-800 ${isvoucher ? 'border-b-2 border-purple-800 font-semibold' : ''
//                 }`}
//             >
//               <Link
//                 href="#"
//                 className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
//               >
//                 <PiHandbagFill className=" text-[14px]" />
//                 Voucher
//               </Link>
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6 m-0"
//                 >
//                   <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                 </svg>
//               </span>
//             </div>

//             <div className="invisible text-[14px] absolute z-50 flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
//               <Link
//                 href="/user/voucher/generate-receipt"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Briefcase className=" mr-2 w-[15px]" /> Generate Recepit
//               </Link>
//               <Link
//                 href="/user/voucher/voucher-wallet-summary"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Voucher Wallet Summary
//               </Link>
//               <Link
//                 href="/user/voucher/receipt-summary"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ChartBar className=" mr-2 w-[15px]" />
//                 Receipt Usage
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="flex">
//           <div className="group relative cursor-pointer">
//             <div
//               className={`flex items-center justify-center py-[12px] text-purple-800 ${isTransfer ? 'border-b-2 border-purple-800 font-semibold' : ''
//                 }`}
//             >
//               <Link
//                 href="#"
//                 className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
//               >
//                 <TbTransfer className=" text-[14px]" /> Transfers
//               </Link>
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6 m-0"
//                 >
//                   <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                 </svg>
//               </span>
//             </div>

//             <div className="invisible absolute z-50 text-[14px] flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
//               <Link
//                 href="/user/transfers/kait-wallet-transfer  "
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Image
//                   className=" w-[15px] h-[15px]  items-center flex  mr-2"
//                   src={Logo}
//                   alt="Logo"
//                 />
//                 Kait Wallet Transfer
//               </Link>
//               <Link
//                 href="/user/transfers/mature-wallet-transfer  "
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ArrowLeftRight className=" mr-2 w-[15px]" /> Mature Wallet
//                 Transfer
//               </Link>
//               <Link
//                 href="/user/transfers/income-wallet-transfer"
//                 className="my-2 flex items-center border-b border-gray-100 text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Briefcase className=" mr-2 w-[15px]" /> Income Wallet Transfer
//               </Link>
//               <Link
//                 href="/user/transfers/restake-wallet-transfer"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ArrowLeftRight className=" mr-2 w-[15px]" />
//                 Restake Wallet Transfer
//               </Link>
//               <Link
//                 href="/user/transfers/ros-wallet-transfer"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <ArrowLeftRight className=" mr-2 w-[15px]" /> ROS Wallet
//                 Transfer
//               </Link>
//               <Link
//                 href="/user/transfers/adhoc-wallet-transfer"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Briefcase className=" mr-2 w-[15px]" /> Adhoc Wallet Transfer
//               </Link>
//               <Link
//                 href=" /user/transfers/super-wallet-transfer"
//                 className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Briefcase className=" mr-2 w-[15px]" /> Super Wallet Transfer
//               </Link>
//             </div>
//           </div>
//         </div>



//   <div className="flex">
//           <div className="group relative cursor-pointer">
//             <div
//               className={`flex items-center justify-center py-[12px] text-purple-800 ${isvoucher ? 'border-b-2 border-purple-800 font-semibold' : ''
//                 }`}
//             >
//               <Link
//                 href="#"
//                 className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
//               >
//                 <TbCash className=" text-[14px]" />
//                 Withdrawal
//               </Link>
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-6 w-6 m-0"
//                 >
//                   <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//                 </svg>
//               </span>
//             </div>

//             <div className="invisible text-[14px] absolute z-50 flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
//              <Link
//                 href="/user/withdrawal/roswithdrawal"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Download className=" mr-2 w-[15px]" />
//                 ROS - Widthrawal
//               </Link>
//               <Link
//                 href="/user/withdrawal/fiatwithdrawal"
//                 className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
//               >
//                 <Download className=" mr-2 w-[15px]" />
//                 Fiat - Widthrawal
//               </Link>
//             </div>
//           </div>
//         </div>


//         <Link
//           href="/user/profile"
//           className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${pathname === '/user/profile'
//             ? 'border-b-2 border-purple-800 font-semibold'
//             : ''
//             }`}
//         >
//           <PiUserListBold className=" text-[14px]" /> Profile
//         </Link>

//         <div className="flex items-center">
//           {kycVerified === null ? (
//             <p className="text-[12px] ml-3 text-gray-400">Checking KYC...</p>
//           ) : !kycVerified ? (
//             <Link href="/user/kyc">
//               <p className="text-[12px] font-normal flex justify-center items-center border-2 bg-blue-200 p-0.5 ml-3">
//                 Submit KYC
//               </p>
//             </Link>
//           ) : (
//             <span className="text-[12px] font-normal flex justify-center items-center border-2 p-0.5 ml-3 text-green-500 ">
//               KYC Approved
//             </span>
//           )}
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default Navigation


"use client"
import { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  LayoutDashboard,
  Share2,
  ArrowLeftRight,
  Users,
  ShoppingBag,
  DollarSign,
  ChevronDown,
  ArrowUpFromLine,
  BarChart3,
  Briefcase,
  Download,
  Eye,
  Power,
  User,

} from 'lucide-react';
import { TbCash } from 'react-icons/tb'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import Image from 'next/image';
import Logo from '../../../assets/logo2x.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LuCircleUserRound } from 'react-icons/lu';
import { decodeJWT } from '@/lib/auth';
import useLogout from '@/components/hooks/userLogout';
import { usePathname } from 'next/navigation'
import { verifyKYCStatus } from '@/store/slices';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface DropdownItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface DropdownMenuProps {
  title: string;
  icon: React.ReactNode;
  items: DropdownItem[];
  isActive?: boolean;
}

function NavLink({ href, icon, children, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 px-2 md:px-3 py-3 text-xs md:text-sm font-medium transition-all
        ${isActive
          ? 'text-purple-900 border-b-2 border-purple-800 font-semibold transition-all duration-200'
          : 'text-purple-700 hover:text-purple-900 transition-all duration-200'
        }`}
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
}

function NavigationDropdown({ title, icon, items, isActive }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group w-full lg:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-1 px-2 md:px-3 py-3 text-xs md:text-sm font-medium transition-all w-full lg:w-auto ${isActive
          ? 'text-purple-800 border-b-2 border-purple-800 font-semibold'
          : 'text-purple-800 hover:text-purple-900'
          }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span className="whitespace-nowrap">{title}</span>
        <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`${isOpen ? 'block' : 'hidden'
          } lg:absolute lg:invisible lg:group-hover:visible z-[99] lg:mt-0 mt-2 w-full lg:w-max bg-gray-100 lg:bg-white lg:shadow-xl rounded-none lg:rounded-lg py-1 lg:py-2 px-2 lg:px-4 border-0 lg:border lg:border-gray-200`}
      >
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="flex items-center gap-2 px-2 md:px-3 py-2 text-xs md:text-sm text-purple-800 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors border-b border-gray-100 last:border-b-0"
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            {item.label}
          </Link>

        ))}
      </div>
    </div>
  );
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useAppDispatch()


  const hasFetched = useRef(false)
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(verifyKYCStatus())
      hasFetched.current = true
    }
  }, [dispatch])

  const { kycVerified } = useAppSelector((state) => state.auth)
  useEffect(() => {
    const token = localStorage.getItem('token');

    const redirectToSignin = () => {
      localStorage.removeItem('token');
      window.location.href = '/auth/signin';
    };

    if (!token) {
      redirectToSignin();
      return;
    }

    try {
      const decoded = decodeJWT(token);

      // decoded could be null if invalid
      if (!decoded) {
        redirectToSignin();
        return;
      }

      // Check token expiration
      const currentTime = Date.now() / 1000; // in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        redirectToSignin();
        return;
      }

      setDecodedToken(decoded);
      setIsAuthenticated(Boolean(decoded?.userName));
    } catch (error: any) {
      console.error('Error decoding token:', error);
      redirectToSignin();
    }


    const handleInteraction = () => {
      if (!token) {
        window.location.href = '/auth/signin';
        return;
      }

      try {
        const decoded = decodeJWT(token);
        if (!decoded) {
          window.location.href = '/auth/signin';
          return;
        }

        const currentTime = Date.now() / 1000; // in seconds
        if (decoded.exp && decoded.exp < currentTime) {
          // token expired
          localStorage.removeItem('token');
          window.location.href = '/auth/signin';
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        window.location.href = '/auth/signin';
      }
    };

    // listen for interactions
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);



  const pathname = usePathname();


  const stakingItems: DropdownItem[] = [
    { href: '/user/stakingcontracts/newStaking', icon: <ArrowUpFromLine className="w-4 h-4" />, label: 'New Regular Staking' },
    // { href: '/user/stakingcontracts/comboPlan', icon: <ArrowUpFromLine className="w-4 h-4" />, label: 'New Fusion Staking' },
    { href: '/user/stakingcontracts/yourstakingcontracts', icon: <ArrowUpFromLine className="w-4 h-4" />, label: 'Your Staking Contracts' },
  ];

  const voucherItems: DropdownItem[] = [
    { href: '/user/voucher/generate-receipt', icon: <Briefcase className="w-4 h-4" />, label: 'Generate Receipt' },
    { href: '/user/voucher/voucher-wallet-summary', icon: <BarChart3 className="w-4 h-4" />, label: 'Voucher Wallet Summary' },
    { href: '/user/voucher/receipt-summary', icon: <BarChart3 className="w-4 h-4" />, label: 'Receipt Usage' },
  ];

  const transferItems: DropdownItem[] = [
    { href: '/user/transfers/kait-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'KAIT Wallet Transfer' },
    { href: '/user/transfers/mature-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Mature Wallet Transfer' },
    { href: '/user/transfers/income-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Income Wallet Transfer' },
    // { href: '/user/transfers/restake-wallet-transfer', icon: <ArrowLeftRight className="w-4 h-4" />, label: 'Restake Wallet Transfer' },
    { href: '/user/transfers/ros-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'ROS Wallet Transfer' },
    { href: '/user/transfers/adhoc-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Adhoc Wallet Transfer' },
    { href: '/user/transfers/super-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Super Wallet Transfer' },
    { href: '/user/transfers/fixed-ros-wallet-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Fixed ROS Transfer' },
    { href: '/user/transfers/vpay-transfer', icon: <Wallet className="w-4 h-4" />, label: 'Vpay Transfer' },

  ];

  const withdrawalItems: DropdownItem[] = [
    { href: '/user/withdrawal/roswithdrawal', icon: <Download className="w-4 h-4" />, label: 'ROS Withdrawal' },
    { href: '/user/withdrawal/fiatwithdrawal', icon: <Download className="w-4 h-4" />, label: 'Maturity Withdrawal' },
    { href: '/user/withdrawal/fixedRosWithdrawal', icon: <Download className="w-4 h-4" />, label: 'FixedROS Withdrawal' },

  ];

  const { handleLogout } = useLogout();



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    let pageName = 'User Panel';

    // Map pathname to friendly names
    if (pathname === '/user/dashboard') pageName = 'Dashboard';
    else if (pathname === '/user/walletSummary') pageName = 'Wallet Summary';
    else if (pathname.startsWith('/user/stakingcontracts/yourstakingcontracts')) pageName = 'Staking Contracts';
    else if (pathname.startsWith('/user/stakingcontracts/newStaking')) pageName = 'New Regular Stake';
    // else if (pathname.startsWith('/user/stakingcontracts/comboPlan')) pageName = 'New Fusion Stake';
    else if (pathname === '/user/teamsummary') pageName = 'Team Summary';
    else if (pathname.startsWith('/user/voucher')) pageName = 'Voucher';
    // else if (pathname.startsWith('/user/transfers')) pageName = 'Transfers';
    else if (pathname.startsWith('/user/transfers/kait-wallet-transfer')) pageName = 'Kait Transfer';
    else if (pathname.startsWith('/user/transfers/mature-wallet-transfer')) pageName = 'Mature Transfer';
    else if (pathname.startsWith('/user/transfers/income-wallet-transfer')) pageName = 'Income Transfer';
    else if (pathname.startsWith('/user/transfers/restake-wallet-transfer')) pageName = 'Restake Transfer';
    else if (pathname.startsWith('/user/transfers/ros-wallet-transfer')) pageName = 'ROS Transfer';
    else if (pathname.startsWith('/user/transfers/adhoc-wallet-transfer')) pageName = 'Adhoc Transfer';
    else if (pathname.startsWith('/user/transfers/vpay-transfer')) pageName = 'Vpay Transfer';
    else if (pathname.startsWith('/user/transfers/super-wallet-transfer')) pageName = 'Super Transfer';
    else if (pathname.startsWith('/user/withdrawal/roswithdrawal')) pageName = 'ROS Withdrawal';
    else if (pathname.startsWith('/user/withdrawal/fiatwithdrawal')) pageName = 'Fiat Withdrawal';
    else if (pathname.startsWith('/user/withdrawal/fixedRosWithdrawal')) pageName = 'FixedROS Withdrawal';

    else if (pathname === '/user/profile') pageName = 'Profile';
    else if (pathname === '/user/kyc') pageName = 'KYC';

    document.title = `${pageName} - KAIT User`;
  }, [pathname]);


  return (
    <div className="bg-white shadow-xl">

      <nav suppressHydrationWarning className="bg-gradient-to-r from-blue-500 to-purple-700">
        <div className="container m-auto flex h-14 justify-between items-center px-4 md:px-20">
          <Image
            className="w-[45px] h-[45px] border-[white] border-4 rounded-[60px] items-center flex"
            src={Logo}
            alt="Logo"
          />
          <div className="flex justify-center items-center font-bold text-white">
            <h2>KAIT Staking - User Panel</h2>
          </div>
          <div className="flex items-center text-gray-100">
            <div className="items-center flex">
              {decodedToken?.name ? `Hello! / ${decodedToken.name}` : '/user'}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-0 w-11 h-11">
                    <LuCircleUserRound
                      style={{ width: '32px', height: '32px' }}
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40 mr-20 z-99 bg-white">
                  <DropdownMenuLabel>
                    {decodedToken?.name
                      ? `Welcome, ${decodedToken.name}`
                      : '/user'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href="/user/profile"
                        className="gap-1 flex w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <User />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href="/user/beneficiary"
                        className="gap-1 flex w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <Eye /> Benificiary
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <button
                        onClick={handleLogout}
                        className="gap-1 flex w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <Power /> Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white"
            aria-label="Toggle menu"
          >
            {!isMobileMenuOpen ? (
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
        className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row lg:items-center lg:justify-center container mx-auto px-4 py-3 lg:py-0 gap-1 lg:gap-0 bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible max-h-[calc(100vh-3.5rem)] lg:max-h-none relative z-[50]`}
      >

        <NavLink
          href="/user/dashboard"
          icon={<LayoutDashboard className="w-4 h-4" />}
          isActive={pathname === '/user/dashboard'}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </NavLink>

        <NavLink
          href="/user/walletSummary"
          icon={<BarChart3 className="w-4 h-4" />}
          isActive={pathname === '/user/walletSummary'}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Wallet Summary
        </NavLink>

        <NavigationDropdown
          title="Staking Contracts"
          icon={<Share2 className="w-4 h-4" />}
          items={stakingItems}
          isActive={pathname.startsWith('/user/stakingcontracts')}

        />

        <NavLink
          href="/user/teamsummary"
          icon={<Users className="w-4 h-4" />}
          isActive={pathname === '/user/teamsummary'}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Team Summary
        </NavLink>

        <NavigationDropdown
          title="Voucher"
          icon={<ShoppingBag className="w-4 h-4" />}
          items={voucherItems}
          isActive={pathname.startsWith('/user/voucher')}
        />

        <NavigationDropdown
          title="Transfers"
          icon={<ArrowLeftRight className="w-4 h-4" />}
          items={transferItems}
          isActive={pathname.startsWith('/user/transfers')}
        />

        <NavigationDropdown
          title="Withdrawal"
          icon={<TbCash className="w-4 h-4" />}
          items={withdrawalItems}
          isActive={pathname.startsWith('/user/withdrawal')}
        />

        <NavLink
          href="/user/profile"
          icon={<User className="w-4 h-4" />}
          isActive={pathname === '/user/profile'}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Profile
        </NavLink>


        <div className="flex items-center">
          {kycVerified === null ? (
            <p className="text-[12px] ml-3 text-gray-400">Checking KYC...</p>
          ) : !kycVerified ? (
            <Link href="/user/kyc">
              <p className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 bg-blue-200 text-gray-800 border-2 border-blue-300 rounded-sm font-normal hover:bg-blue-300 transition-colors">
                Submit KYC
              </p>
            </Link>
          ) : (
            <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-green-100 text-green-700 border-2 border-green-300 rounded-sm font-normal">
              KYC Approved
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
