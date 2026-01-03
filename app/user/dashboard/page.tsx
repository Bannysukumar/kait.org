// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import Autoplay from 'embla-carousel-autoplay'
// import { useSelector, useDispatch } from 'react-redux'
// import { AppDispatch, RootState } from '../../../store/store'
// import { verifyKYCStatus } from '../../../store/slices/index'
// import { Bell, ClipboardCopy, Siren } from 'lucide-react'
// import ReferralComponent from '@/app/user/components/referralComponent'
// import { fetchClubProgress } from '@/store/slices/user/nextClubSlice'
// import { BsSuitClubFill } from "react-icons/bs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/carousel'
// import Image from 'next/image'
// import Bg1 from '../../../assets/gold.png'
// import Bg2 from '../../../assets/platinum.png'
// import Bg3 from '../../../assets/redDimond.png'
// // import Bg4 from '../../../assets/platinum.jpg'
// // import Wallets from './wallet'
// import Link from 'next/link'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { motion } from 'framer-motion'
// import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
// import {
//   FaEllipsisH,
//   FaHandPointRight,
//   FaList,
//   FaTimes,
//   FaTrophy,
//   FaUser,
//   FaUserPlus,
//   FaWallet,
// } from 'react-icons/fa'
// import { FaSquareCheck } from 'react-icons/fa6'
// import Logo from '@/assets/logo2x.png'
// import Logoblue from '@/assets/logo2xblue.png'
// import Pop from '@/assets/pop1.png'
// import CountUp from 'react-countup'
// import { fetchBinaryInfo } from '@/store/slices/binaryinfoslice'
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// import {
//   Wallet,
//   PiggyBank,
//   TrendingUp,
//   DollarSign,
//   Gift,
//   ArrowUpRight,
// } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { PiHandWithdraw } from 'react-icons/pi'
// import { generateReferralLink } from '../../../store/slices/index'
// import { Button } from '@/components/ui/button'
// import { performRestake, resetRestake } from '@/store/slices/user/restakeSlice'
// import { Input } from '@/components/ui/input'
// import toast from 'react-hot-toast'
// import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

// interface RestakeFormProps {
//   walletType?: 'IncomeWallet' | 'ReStakeWallet'
//   onSuccess?: () => void
//   onClose?: () => void

// }

// function RestakeForm({ walletType, onSuccess, onClose }: RestakeFormProps) {
//   const dispatch = useAppDispatch()
//   const { loading, error, success } = useAppSelector((state) => state.Restake)
//   const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)

//   const restakeWalletKinds = dropdownOptions?.restake_wallet_kinds ?? []

//   const [amount, setAmount] = useState<number>(0)
//   const [walletKind, setWalletKind] = useState<string>('')
//   const [confirmVisible, setConfirmVisible] = useState(false) // ✅ toggle Yes/No

//   useEffect(() => {
//     dispatch(fetchDropdownOptions())
//   }, [dispatch])

//   useEffect(() => {
//     if (walletType) setWalletKind(walletType)
//     else if (restakeWalletKinds.length > 0 && !walletKind)
//       setWalletKind(restakeWalletKinds[0].value as string)
//   }, [restakeWalletKinds, walletKind, walletType])

//   useEffect(() => {
//     if (!error) return
//     let msg = ''
//     if (typeof error === 'string') msg = error
//     else if (Array.isArray(error)) msg = error.map((e) => e.msg).join(', ')
//     else if (error && 'detail' in error) {
//       const detail = (error as any).detail
//       msg = typeof detail === 'string' ? detail : JSON.stringify(detail)
//     } else msg = JSON.stringify(error) || 'Something went wrong'

//     toast.error(msg)
//   }, [error])

//   useEffect(() => {
//     if (success) {
//       toast.success('Restake successful!')
//       setAmount(1000)
//       dispatch(resetRestake())
//       if (onSuccess) onSuccess()
//     }
//   }, [success, dispatch, onSuccess])

//   const handleConfirmYes = async () => {
//     setConfirmVisible(false)

//     if (amount <= 0) return toast.error('Amount must be greater than 0')

//     const minAmount = walletKind === 'ReStakeWallet' ? 3000 : 1000
//     if (amount < minAmount || amount % 1000 !== 0) {
//       return toast.error(`'Amount' should be >= ${minAmount} and a multiple of 1000.`)
//     }

//     await dispatch(performRestake({ wallet_kind: walletKind as any, amount }))
//     if (onClose) onClose()

//   }

//   const handleConfirmNo = () => {
//     setConfirmVisible(false)
//     toast('Restake cancelled.')
//   }

//   return (
//     <div className="p-6 z-[999] space-y-6 bg-gradient-to-br from-purple-50 via-purple-100 to-white rounded-xl shadow-xl border border-purple-300 max-w-md mx-auto">
//       <h2 className="text-center text-2xl font-bold text-purple-700 mb-4 animate-pulse">
//         Restake Your Wallet
//       </h2>

//       <div className="space-y-3">
//         <label className="text-sm font-semibold text-gray-700">Select Wallet</label>
//         <select
//           value={walletKind}
//           onChange={(e) => setWalletKind(e.target.value)}
//           disabled={!!walletType}
//           className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
//         >
//           {restakeWalletKinds.length > 0 ? (
//             restakeWalletKinds.map((wallet) => (
//               <option key={wallet.id} value={wallet.value}>
//                 {wallet.value}
//               </option>
//             ))
//           ) : (
//             <option disabled>Loading wallets...</option>
//           )}
//         </select>
//       </div>

//       <div className="space-y-3">
//         <label className="text-sm font-semibold text-gray-700">Amount</label>
//         <Input
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           placeholder="Enter amount (multiple of 1000)"
//           className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
//         />
//         <p className="text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-md p-2 mt-1 font-medium">
//           {walletKind === 'ReStakeWallet'
//             ? 'ReStake Wallet restake should be a minimum of 3000 KAIT and in multiples of 1000.'
//             : walletKind === 'IncomeWallet'
//               ? 'Income Wallet restake should be a minimum of 1000 KAIT and in multiples of 1000.'
//               : 'Select a wallet type to see its restake requirements.'}
//         </p>
//       </div>

//       {/* ✅ Inline Yes/No buttons */}
//       {!confirmVisible ? (
//         <Button
//           onClick={() => setConfirmVisible(true)}
//           className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//         >
//           Restake
//         </Button>
//       ) : (
//         <div className="flex justify-center gap-4">
//           <Button
//             onClick={handleConfirmYes}
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
//           >
//             Yes
//           </Button>
//           <Button
//             onClick={handleConfirmNo}
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
//           >
//             No
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }


// function UserDashboard() {
//   const dispatch = useDispatch<AppDispatch>()
//   const { kycVerified, kycStatusLoading } = useAppSelector((state) => state.auth)
//   const { data: userData, loading: userLoading } = useAppSelector((state) => state.UserTree)
//   const { data: clubData, loading: clubLoading } = useAppSelector((state) => state.clubProgress)
//   const { data: BinaryInfo, loading: BinaryInfoloading, error: Binaryerror } = useSelector((state: RootState) => state.binaryInfo)
//   const { referralLink, isLoading: referralLoading, error: referralError } = useSelector(
//     (state: RootState) => state.auth
//   )
//   const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)
//   useEffect(() => {
//     dispatch(fetchDropdownOptions());
//   }, [dispatch]);
//   const binaryIncomeList = dropdownOptions?.binary_income_percentage ?? [];

//   const userClub = userData?.user_club?.trim() ?? '';

//   const userBinaryPercentage =
//     binaryIncomeList.find(
//       (item) => item.id.trim().toLowerCase() === userClub.toLowerCase()
//     )?.value ?? 0;

//   const latestBalance = userData?.wallets?.restake_wallet || '0'
//   const [tab, setTab] = useState('club')

//   const ran = useRef(false);

//   useEffect(() => {
//     if (ran.current) return
//     ran.current = true

//     dispatch(fetchUserData())
//     dispatch(verifyKYCStatus())
//   }, [dispatch])


//   const ranClubProgress = useRef(false);
//   const previousUserId = useRef<string | null>(null);

//   useEffect(() => {
//     if (!userData?.id) {
//       ranClubProgress.current = false;
//       previousUserId.current = null;
//       return;
//     }

//     if (previousUserId.current !== userData.id) {
//       ranClubProgress.current = false;
//     }

//     if (!ranClubProgress.current) {
//       ranClubProgress.current = true;
//       previousUserId.current = userData.id;

//       dispatch(fetchClubProgress({ user_id: userData.id }));
//     }
//   }, [dispatch, userData?.id]);

//   const ranBinaryInfo = useRef(false);

//   useEffect(() => {
//     if (!userData?.id || ranBinaryInfo.current) return
//     ranBinaryInfo.current = true

//     dispatch(fetchBinaryInfo(userData.id))
//   }, [dispatch, userData?.id])

//   const ranReferral = useRef(false)
//   const [copySuccess, setCopySuccess] = useState(false)

//   useEffect(() => {
//     if (!ranReferral.current) {
//       ranReferral.current = true
//       dispatch(generateReferralLink())
//     }
//   }, [dispatch])

//   const handleCopy = () => {
//     if (referralLink) {
//       const referralUrl = `https://www.kaitcoin.org/auth/signup?token=${referralLink}`
//       navigator.clipboard.writeText(referralUrl).then(() => {
//         setCopySuccess(true)
//         setTimeout(() => setCopySuccess(false), 2000)
//       })
//     }
//   }

//   const wallethandleCopy = (textToCopy: string) => {
//     if (!textToCopy) return
//     navigator.clipboard.writeText(textToCopy).then(() => {
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     })
//   }



//   const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
//   const BgImage = [{ img: Bg1 }, { img: Bg2 }, { img: Bg3 },
//     // { img: Bg4 }
//   ]

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const open = Boolean(anchorEl)
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const levelChartData =
//     userData?.level_info?.levels.map((level) => ({
//       name: `L${level.level}`,
//       users: level.total_users,
//       volume: Number(level.total_volume),
//     })) || []

//   const [copied, setCopied] = useState(false)

//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [walletType, setWalletType] = useState<'IncomeWallet' | 'ReStakeWallet'>('IncomeWallet')

//   const openRestakeDialog = (type: 'IncomeWallet' | 'ReStakeWallet') => {
//     setWalletType(type)
//     setIsDialogOpen(true)
//   }



//   const [activeTab, setActiveTab] = useState<'previous' | 'current'>('previous')
//   const [showLoginPopup, setShowLoginPopup] = useState(false);

//   useEffect(() => {
//     if (userData && !sessionStorage.getItem('loginPopupShown')) {
//       setShowLoginPopup(true);
//       sessionStorage.setItem('loginPopupShown', 'true');
//     }
//   }, [userData]);


//   if (kycStatusLoading || userLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
//       </div>
//     )
//   }
//   const totalUsers =
//     userData?.level_info?.levels.reduce((sum, lvl) => sum + lvl.total_users, 0) ||
//     0

//   const leftUsers = Math.floor(totalUsers / 2)
//   const rightUsers = totalUsers - leftUsers
//   const earned = userData?.income_eligibility?.total_income ?? 0
//   const maxLimit = userData?.income_eligibility?.user_max_income_limit ?? 0
//   const remaining = Math.max(maxLimit - earned, 0)

//   const earnedPercent = Math.min((earned / maxLimit) * 100, 100)
//   const remainingPercent = 100 - earnedPercent

//   type WalletData = {
//     title: string
//     amount: string
//     list: string[] | string
//     onClickList: (() => void)[]
//     isOpen: boolean
//     onToggle: () => void
//     icon: React.ReactNode
//     gradient: string
//     accentColor: string
//   }

//   const WalletCard = ({
//     title,
//     amount,
//     list,
//     isOpen,
//     onToggle,
//     icon,
//     gradient,
//     accentColor,
//     onClickList,
//   }: WalletData) => {
//     const dropdownItems = Array.isArray(list) ? list : [list]

//     return (
//       <div className="group relative">
//         <div
//           className={`absolute -inset-1 ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}
//         ></div>

//         <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-visible transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
//           <div className="absolute inset-0 opacity-5 rounded-2xl">
//             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100 to-transparent transform rotate-12 scale-150"></div>
//           </div>

//           <div className={`relative ${gradient} p-4 text-white rounded-t-2xl`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                   {icon}
//                 </div>
//                 <h3 className="font-semibold text-sm leading-tight">{title}</h3>
//               </div>

//               {/* Dropdown toggle */}
//               <div className="relative">
//                 <button
//                   onClick={onToggle}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-180"
//                 >
//                   {isOpen ? (
//                     <FaTimes className="w-4 h-4" />
//                   ) : (
//                     <FaEllipsisH className="w-4 h-4" />
//                   )}
//                 </button>

//                 {/* Dropdown */}
//                 {isOpen && (
//                   <div className="absolute right-0 mt-2 z-50 min-w-[120px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
//                     {dropdownItems.map((item, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => {
//                           onToggle()
//                           if (onClickList[idx]) onClickList[idx]()
//                         }}
//                         className="w-full  px-4 py-2  text-sm text-gray-700 border-b-1  rounded-xl dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="relative px-4 py-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-b-2xl">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 relative">
//                 <Image
//                   alt="KAIT Logo"
//                   src={Logo}
//                   width={24}
//                   height={24}
//                   className="object-contain"
//                 />
//               </div>
//               <span className="text-[12px] font-bold text-gray-900 dark:text-white">
//                 {amount}
//               </span>
//             </div>

//             <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
//               <div
//                 className={`h-full ${gradient} rounded-full transition-all duration-1000 ease-out transform origin-left`}
//                 style={{
//                   width: `${Math.min(parseInt(amount.replace(/,/g, '')) / 100, 100)}%`,
//                 }}
//               ></div>
//             </div>
//           </div>

//           {/* Glowing dots */}
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"></div>
//             <div
//               className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"
//               style={{ animationDelay: '1s' }}
//             ></div>
//             <div
//               className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-ping"
//               style={{ animationDelay: '2s' }}
//             ></div>
//           </div>
//         </div>
//       </div>

//     )
//   }


//   const AnimatedWallets = () => {
//     const [openIndex, setOpenIndex] = useState<number | null>(null)

//     const router = useRouter()


//     if (!userData) {
//       return (
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="flex space-x-2">
//             <span className="w-3 h-3 bg-purple-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
//             <span className="w-3 h-3 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
//             <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
//           </div>
//         </div>
//       )
//     }

//     const walletIcons = [
//       <Wallet className="w-4 h-4" />,
//       <PiggyBank className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Wallet className="w-4 h-4" />,
//       <Gift className="w-4 h-4" />,
//       <Gift className="w-4 h-4" />,
//       <TrendingUp className="w-4 h-4" />,
//       <PiHandWithdraw className="w-4 h-4" />,
//     ]

//     const gradients = Array(12).fill(
//       'bg-gradient-to-r from-blue-500 to-purple-700',
//     )
//     const accentColors = Array(12).fill('bg-pink-100 text-purple-700')

//     const data = [
//       {
//         title: 'KAIT Wallet',
//         amount: (Number(userData?.wallets?.kiat_wallet) || 0).toLocaleString(),
//         list: 'View Wallet',
//         onClickList: [() => router.push('/user/walletSummary?wallet_kind=KaitWallet&page=1')],
//       },
//       {
//         title: 'Total Staking',
//         amount: (Number(userData?.total_staking) || 0).toLocaleString(),
//         list: ['New Staking', 'All Staking'],
//         onClickList: [
//           () => router.push('/user/stakingcontracts/yourstakingcontracts'),
//         ],
//       },
//       {
//         title: 'ROS Wallet',
//         amount: (Number(userData?.wallets?.ros_wallet) || 0).toLocaleString(),
//         list: ['Summary'],
//         onClickList: [
//           () =>
//             router.push(
//               '/user/walletSummary?wallet_kind=RosWallet&page=1',
//             ),
//         ],
//       }, {
//         title: 'Fixed ROS',
//         amount: `${(Number(userData?.wallets?.fixed_ros_wallet) || 0).toLocaleString()}         `,
//         list: 'Summary',
//         onClickList: [
//           () =>
//             router.push('/user/walletSummary?wallet_kind=FixedRosWallet&page=1'),
//         ],
//       },

//       {
//         title: 'Income Wallet',
//         amount: (Number(userData?.wallets?.income_wallet) || 0).toLocaleString(),
//         list: ['View Wallet', 'Restake'],
//         onClickList: [
//           () =>
//             router.push(
//               '/user/walletSummary?wallet_kind=IncomeWallet&page=1',
//             ),
//           () => openRestakeDialog('IncomeWallet'),

//         ],
//       },
//       {
//         title: 'Super Wallet',
//         amount: (Number(userData?.wallets?.super_wallet) || 0).toLocaleString(),
//         list: 'Summary',
//         onClickList: [
//           () =>
//             router.push(
//               '/user/walletSummary?wallet_kind=SuperWallet&page=1',
//             ),
//         ],
//       },
//       {
//         title: 'Restake Wallet',
//         amount: (Number(userData?.wallets?.restake_wallet) || 0).toLocaleString(),
//         list: ['View Wallet', 'Restake'],
//         onClickList: [
//           () => router.push('/user/walletSummary?wallet_kind=ReStakeWallet&page=1'),
//           () => openRestakeDialog('ReStakeWallet'),
//         ],
//       },
//       {
//         title: 'Adhoc Wallet',
//         amount: (Number(userData?.wallets?.adhoc_wallet) || 0).toLocaleString(),
//         list: 'Summary',
//         onClickList: [() => router.push('/user/transfers/adhoc-wallet-transfer')],
//       },
//       {
//         title: 'Utility Voucher',
//         amount: (Number(userData?.wallets?.vpay_voucher) || 0).toLocaleString(),
//         list: 'Summary',
//         onClickList: [() => router.push('/user/walletSummary?wallet_kind=VpayVoucher&page=1')],
//       },
//       {
//         title: 'Ecom Voucher',
//         amount: (Number(userData?.wallets?.ecommerce_voucher) || 0).toLocaleString(),
//         list: 'Summary',
//         onClickList: [() => router.push('/user/walletSummary?wallet_kind=EcommerceVoucher&page=1')],
//       },



//       {
//         title: 'Total Earnings',
//         amount: (Number(userData?.wallets?.total_level_income) || 0).toLocaleString(),
//         list: 'Summary',
//         onClickList: [
//           () =>
//             router.push(
//               '/user/walletSummary?wallet_kind=IncomeWallet&page=1',
//             ),
//         ],
//       },
//       {
//         title: 'Withdrawal',
//         // amount: (Number(userData?.total_withdraw) || 0).toLocaleString(),
//         amount: (Number(userData?.withdraw) || 0).toLocaleString(),
//         list: ['Ros', 'Fiat'],
//         onClickList: [
//           () => router.push('/user/withdrawal/roswithdrawal'),
//           () => router.push('/user/withdrawal/fiatwithdrawal'),
//         ],
//       },



//       // {
//       //       title: 'Fixed ROS',
//       //       amount: `${(Number(userData?.wallets?.fixed_ros_wallet) || 0).toLocaleString()}
//       //        / total:${(Number(userData?.wallets?.total_fixed_ros) || 0).toLocaleString()}
//       //        `,
//       //       list: 'Summary',
//       //       onClickList: [
//       //         () =>
//       //           router.push('/user/walletSummary?wallet_kind=RosWallet&page=1'),
//       //       ],
//       //     }
//     ]

//     return (
//       <div className="dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {data.map((wallet, index) => (
//               <WalletCard
//                 key={index}
//                 title={wallet.title}
//                 amount={wallet.amount}
//                 list={wallet.list}
//                 onClickList={wallet.onClickList}
//                 isOpen={openIndex === index}
//                 onToggle={() =>
//                   setOpenIndex((prev) => (prev === index ? null : index))
//                 }
//                 icon={walletIcons[index]}
//                 gradient={gradients[index]}
//                 accentColor={accentColors[index]}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }


//   return (
//     <div className="pt-5 bg-blue-50 hover:bg-purple-50  pb-[20px]  transition-colors duration-2000">
//       <div className="items-center mx-auto px-[20px] w-auto h-[180px ] grid grid-cols-1 lg:grid-cols-3 container mb-[20px]">
//         <div className="col-span-1 lg:col-span-3 h-[180px] ">
//           <Carousel
//             plugins={[plugin.current]}
//             className="lg:px-7 px-0"
//             onMouseEnter={plugin.current.stop}
//             onMouseLeave={plugin.current.reset}
//           >
//             <CarouselContent>
//               {BgImage.map((image, imgIndex) => (
//                 <CarouselItem key={imgIndex}>
//                   <div className="p-1 rounded-2xl h-[200px]">
//                     <Card className="border-none p-0">
//                       <CardContent className="flex p-0 aspect-square items-center h-[200px] bg-center justify-center">
//                         <div key={imgIndex} className="relative w-full h-full">
//                           <Image
//                             src={image.img}
//                             alt={`Background ${imgIndex + 1}`}
//                             fill
//                             style={{ objectFit: 'cover' }}
//                             className="rounded-lg w-full h-full"
//                           />
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//           </Carousel>
//         </div>
//       </div>

//       <div className="container px-[20px] mx-auto lg:grid lg:grid-cols-3 grid-cols-1 gap-4">
//         <div className="col-span-full lg:col-span-2">
//           <AnimatedWallets />
//           <div className="w-full px-4">
//           </div>
//         </div>

//         <div className="flex flex-col items-center justify-start gap-4 mt-6 lg:mt-0 h-full pt-8">

//           <Card className="w-full py-0  bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400 gap-2 rounded-lg transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]">
//             <CardHeader className="p-0 ">
//               <CardTitle className="p-0 h-full w-full">
//                 <Button
//                   className="w-full h-full font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-white 
//                    shadow-[0_0_10px_rgba(147,51,234,0.8)] hover:shadow-[0_0_20px_rgba(147,51,234,1)] 
//                    transition-all duration-300 flex items-center justify-center"
//                   onClick={() => setIsDialogOpen(true)}
//                 >
//                   Restake
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//           </Card>


//           {isDialogOpen && (
//             <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 ">
//               <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
//                 <h2 className="text-lg font-bold mb-4 text-center">Restake</h2>

//                 {/* Pass onClose to RestakeForm */}
//                 <RestakeForm onClose={() => setIsDialogOpen(false)} />

//                 <button
//                   className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           )}
//           {/* {showLoginPopup && (
//             <div className="fixed  inset-0 z-[9999] flex items-center justify-center bg-black/50">
//               <div className=" rounded-xl bg-white shadow-xl max-w-md w-full p-4 relative">
//                 <button
//                   onClick={() => setShowLoginPopup(false)}
//                   className="absolute cursor-pointer top-1 right-1 text-gray-700 rounded-bl-2xl  p-2 hover:text-gray-800"
//                 >
//                   ✕
//                 </button>

//                 <div className="flex flex-col items-center">
//                   <Image
//                     src={Pop} 
//                     alt="Welcome"
//                     width={1500}
//                     height={1500}
//                     className="object-contain "
//                   />

//                   <button
//                     onClick={() => setShowLoginPopup(false)}
//                     className="mt-4 cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
//                   >
//                     Continue
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )} */}


//           <Card className="w-full p-3 bg-white shadow-md gap-2 rounded-lg">
//             <CardHeader>
//               <CardTitle className="text-center flex justify-center items-center text-gray-800 font-semibold">
//                 <FaUser className="w-4 h-4 text-purple-500 mr-2" />
//                 User Details
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               {/* Member & Sponsor Info */}
//               <CardDescription className="text-gray-600 mb-4">
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-center gap-2">
//                     <div>
//                       <span className="text-[12px] text-gray-500">Member Name</span>
//                       <p className="text-black text-[12px] font-semibold">{userData?.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div>
//                       <span className="text-[12px] text-gray-500">Sponsor</span>
//                       <p className="text-black text-[12px] font-semibold">{userData?.sponsor_name}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardDescription>

//               {/* IDs */}
//               <CardDescription className="text-gray-600 mb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <span className="text-[12px] text-gray-500">Member ID</span>
//                     <p className="text-black text-[12px] font-semibold">{userData?.user_name}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[12px] text-gray-500">Sponsor ID</span>
//                     <p className="text-black text-[12px] font-semibold">{userData?.sponsor_username || "User"}</p>
//                   </div>
//                 </div>
//               </CardDescription>

//               {/* KYC & Joining Date */}
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <span className="text-[12px] text-gray-600">KYC Status</span>
//                   <div className="flex items-center gap-1">
//                     {kycVerified ? (
//                       <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
//                         <FaSquareCheck /> Verified
//                       </span>
//                     ) : (
//                       <>
//                         <span className="text-red-500 text-xs font-semibold">Not Verified</span>
//                         <Link href="/user/kyc">
//                           <span className="text-blue-600 text-xs font-normal border border-blue-400 bg-blue-100 px-2 py-0.5 rounded hover:bg-blue-200 transition cursor-pointer">
//                             Submit KYC
//                           </span>
//                         </Link>

//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="text-right flex gap-1 text-[12px] text-gray-600">
//                   <span>Since</span>
//                   <p className="text-black font-semibold">{userData?.joining_date}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>



//           <Card className="w-full gap-2 p-4 bg-white">
//             <div className="  p-3 rounded-2xl text-black  hover:shadow-md transition-shadow duration-200">
//               <h2 className="text-sm font-semibold text-black mb-3 text-center">Wallet Address</h2>
//               <div className="flex items-center gap-2 border border-purple-300 shadow-sm rounded px-3 py-2 w-full overflow-hidden bg-white text-black">
//                 <span
//                   className="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis flex-1"
//                   title={userData?.wallet}
//                 >
//                   {userData?.wallet || '—'}
//                 </span>
//                 <button
//                   onClick={() => wallethandleCopy(userData?.wallet || '')}
//                   className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded hover:bg-blue-700 transition-colors duration-200"
//                   title="Copy Wallet Address"
//                 >
//                   <ClipboardCopy size={20} />
//                 </button>
//               </div>

//               {copied && (
//                 <div className="text-xs text-green-600 mt-2 text-center">
//                   Copied!
//                 </div>
//               )}
//             </div>
//           </Card>



//           <Card className="w-full gap-2 p-4 bg-white">
//             <CardContent className="py-4">
//               <CardDescription className="text-gray-600 font-bold justify-center flex items-center gap-1 mt-0 mb-1">
//                 <FaUserPlus className="w-5 h-5" />
//                 <span className="text-center">Your Referral Link</span>
//               </CardDescription>

//               <Card className="py-0 px-2 bg-gray-100">
//                 <div className="w-full overflow-hidden text-center">
//                   {referralLoading ? (
//                     <p>Loading referral link...</p>
//                   ) : referralLink ? (
//                     <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-1 rounded-lg w-full max-w-full">
//                       <span className="truncate w-full font-medium text-sm sm:text-base">
//                         {`https://www.kaitcoin.org/auth/signup?token=${referralLink}`}
//                       </span>
//                       <button
//                         onClick={handleCopy}
//                         className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-md hover:bg-blue-700"
//                       >
//                         {copySuccess ? 'Copied!' : <ClipboardCopy />}
//                       </button>
//                     </div>
//                   ) : (
//                     referralError && <p className="text-red-500 text-sm">{referralError}</p>
//                   )}
//                 </div>
//               </Card>
//             </CardContent>
//           </Card>

//         </div>




//         {/* Capping 3X Card */}
//         <Card className="flex-1 gap-0 bg-white p-4 rounded-lg shadow-md">
//           <h4 className="text-[15px] flex gap-1 justify-center items-center font-semibold mb-4">
//             <Image
//               alt="KAIT Logo"
//               src={Logoblue}
//               width={20}
//               height={20}
//               className="object-contain"
//             />
//             Capping 3X - {maxLimit.toLocaleString()}
//           </h4>

//           <div className="bg-white shadow rounded-xl w-full">
//             {/* Tooltip on hover */}
//             <div className="relative group mb-2">
//               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
//                 <span className="flex items-center gap-1">
//                   Total:
//                   <Image
//                     alt="KAIT Logo"
//                     src={Logo}
//                     width={14}
//                     height={14}
//                     className="object-contain"
//                   />
//                   <CountUp end={maxLimit} duration={1.5} separator="," />
//                 </span>
//               </div>

//               {/* Progress bar */}
//               <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
//                 <div
//                   className="bg-emerald-400 transition-all duration-1000"
//                   style={{ width: `${remainingPercent}%` }}
//                 />
//                 {remainingPercent > 0 && (
//                   <div
//                     className="bg-red-400 transition-all duration-1000"
//                     style={{ width: `${earnedPercent}%` }}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Bottom labels */}
//             <div className="text-xs text-gray-600 font-medium flex justify-between">
//               <span className="flex items-center gap-1">
//                 Earned:
//                 <span className="text-green-500 flex items-center gap-1">
//                   <Image
//                     alt="KAIT Logo"
//                     src={Logo}
//                     width={14}
//                     height={14}
//                     className="object-contain"
//                   />
//                   <CountUp end={remaining} duration={1.5} separator="," />
//                 </span>
//               </span>
//               <span className="flex items-center gap-1">
//                 Remaining:
//                 <span className="text-red-500 flex items-center gap-1">
//                   <Image
//                     alt="KAIT Logo"
//                     src={Logo}
//                     width={14}
//                     height={14}
//                     className="object-contain"
//                   />
//                   <CountUp end={earned} duration={1.5} separator="," />
//                 </span>
//               </span>
//             </div>
//           </div>
//         </Card>

//         {/* Current Club Card */}
//         <Card className="flex-1 p-4 w-full rounded-lg shadow-md bg-white text-center flex items-center justify-center">
//           <div>
//             <p className="font-semibold">Current Club- {userData?.user_club || '—'}</p>
//             <p className="mt-2">Volume: --- + ---</p>

//           </div>
//         </Card>

//         {/* Next Club Card */}
//         <Card className="flex-1 p-2 rounded-lg shadow-md bg-white text-center flex items-center justify-center">
//           <div>
//             {/* Next Club */}
//             <p className="font-semibold">
//               Next Club -{' '}
//               {clubLoading ? (
//                 <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse"></span>
//               ) : (
//                 clubData?.next_club || '—'
//               )}
//             </p>

//             {/* Progress Summary */}
//             <p className="mt-2 text-sm">
//               {clubLoading ? (
//                 <span className="inline-block w-full h-3 bg-gray-200 rounded animate-pulse"></span>
//               ) : (
//                 clubData?.progress
//                   ?.map((item) => {
//                     const total = Number(item.required) || 1
//                     const current = Math.min(Number(item.current) || 0, total)
//                     return `${item.title}: ${current.toLocaleString()} / ${total.toLocaleString()}${item.status ? ' ✅' : ''}`
//                   })
//                   .join(' + ')
//               )}
//             </p>
//           </div>
//         </Card>







//         <div className="col-span-full">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


//             <Card className="bg-white p-4">
//               <Tabs value={tab} onValueChange={setTab} className="w-full">
//                 {/* ----------- TABS BUTTONS ----------- */}
//                 <TabsList className="grid w-full grid-cols-2 mb-4">
//                   <TabsTrigger
//                     value="previous"
//                     className="data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-700  shadow-lg shadow-purple-200/50  data-[state=active]:text-white"
//                   >
//                     Previous Month
//                   </TabsTrigger>

//                   <TabsTrigger
//                     value="club"
//                     className="data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg shadow-purple-200/50 data-[state=active]:text-white"
//                   >
//                     Current Month
//                   </TabsTrigger>
//                 </TabsList>


//                 {/* ----------- PREVIOUS MONTH TAB ----------- */}
//                 <TabsContent value="previous">
//                   {/* Previous Month Heading */}
//                   <div className="bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50 p-4 rounded-2xl text-white mb-4">
//                     <h4 className="text-center font-bold mb-3">Previous Month Volume</h4>
//                     <div className="flex justify-between items-center text-sm px-[20px] font-bold text-white">
//                       <span>Club: {userData?.user_club ?? '-'}</span>
//                       <span>Pair Match: {userBinaryPercentage ?? '-'}%</span>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {/* Level Income */}
//                     <div className="flex justify-between items-center gap-4 px-4">
//                       <div className="border shadow-lg p-3 rounded text-white bg-purple-600 border-purple-700 shadow-purple-200/50 text-center flex-1">
//                         <p className="font-semibold text-[12px]">Level Income</p>
//                         <p className="flex justify-center items-center gap-1 text-[14px]">
//                           {BinaryInfoloading ? (
//                             <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//                           ) : (
//                             <>
//                               0
//                               <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
//                             </>
//                           )}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Left / Right Volume */}
//                     <div className="flex justify-between items-center gap-4 px-4">
//                       <VolumeBox
//                         label="Left Volume"
//                         value={BinaryInfo?.left_prev_business}
//                         side="Left"
//                         loading={BinaryInfoloading}
//                       />
//                       <VolumeBox
//                         label="Right Volume"
//                         value={BinaryInfo?.right_prev_business}
//                         side="Right"
//                         loading={BinaryInfoloading}
//                       />
//                     </div>

//                     {/* Pair Match Volume */}
//                     <div className="flex justify-between items-center gap-4 px-4">
//                       <VolumeBox
//                         label="Pair Match Volume"
//                         value={BinaryInfo?.prev_month_pair_matching}
//                         coin
//                         loading={BinaryInfoloading}
//                       />
//                     </div>

//                     {/* Unpair / Carry Forward */}
//                     <div className="flex justify-between gap-4 px-4">
//                       <VolumeBox
//                         label="Unpair Volume"
//                         value={0}
//                         coin
//                         side="Left"
//                         loading={BinaryInfoloading}
//                       />
//                       <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
//                         <CardDescription>
//                           <p className="font-semibold text-[12px]">Carry Forward</p>
//                           <p className="flex justify-center gap-1 text-[14px]">
//                             {BinaryInfoloading ? (
//                               <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//                             ) : (
//                               '0%'
//                             )}
//                           </p>
//                         </CardDescription>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>



//                 {/* ----------- CLUB MONTHLY TAB ----------- */}
//                 <TabsContent value="club">
//                   {/* Club Heading */}
//                   <div className="bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50 p-4 rounded-2xl text-white mb-4">
//                     <h4 className="text-center font-bold mb-3">Club Based Monthly Volume</h4>
//                     <div className="flex justify-between items-center text-sm px-[20px] font-bold text-white">
//                       <span>Club: {userData?.user_club ?? '-'}</span>
//                       <span>Pair Match: {userBinaryPercentage ?? '-'}%</span>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {/* Level Income */}
//                     <div className="flex justify-between items-center gap-4 px-4">
//                       <div className="border shadow-lg p-3 rounded text-white bg-purple-600 border-purple-700 shadow-purple-200/50 text-center flex-1">
//                         <p className="font-semibold text-[12px]">Level Income</p>
//                         <p className="flex justify-center items-center gap-1 text-[14px]">
//                           {BinaryInfoloading ? (
//                             <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//                           ) : (
//                             <>
//                               0
//                               <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
//                             </>
//                           )}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Left / Right Volume */}
//                     <div className="flex justify-between gap-4 px-4">
//                       <VolumeBox
//                         label="Left Volume"
//                         value={BinaryInfo?.left_cur_business}
//                         side="Left"
//                         loading={BinaryInfoloading}
//                       />
//                       <VolumeBox
//                         label="Right Volume"
//                         value={BinaryInfo?.right_cur_business}
//                         side="Right"
//                         loading={BinaryInfoloading}
//                       />
//                     </div>

//                     {/* Pair Match Volume */}
//                     <div className="flex justify-between gap-4 px-4">
//                       <VolumeBox
//                         label="Pair Match Volume"
//                         value={BinaryInfo?.current_month_pair_matching}
//                         coin
//                         loading={BinaryInfoloading}
//                       />
//                     </div>

//                     {/* Carry Forward */}
//                     <div className="flex justify-between gap-4 px-4">
//                       <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
//                         <CardDescription>
//                           <p className="font-semibold text-[12px]">Left Carry Forward</p>
//                           <p className="flex justify-center gap-1 text-[14px]">
//                             {BinaryInfoloading ? (
//                               <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//                             ) : (
//                               BinaryInfo?.left_carry_forward ?? 0
//                             )}
//                           </p>
//                         </CardDescription>
//                       </div>
//                       <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
//                         <CardDescription>
//                           <p className="font-semibold text-[12px]">Right Carry Forward</p>
//                           <p className="flex justify-center gap-1 text-[14px]">
//                             {BinaryInfoloading ? (
//                               <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//                             ) : (
//                               BinaryInfo?.right_carry_forward ?? 0
//                             )}
//                           </p>
//                         </CardDescription>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>


//               </Tabs>
//             </Card>


//             <Card className="bg-white p-4">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50 p-2 rounded-2xl text-white text-center font-bold mb-4">
//                 <span className="flex justify-center items-center gap-1 text-[14px]">
//                   <p>My Total Team</p>
//                   Member: {BinaryInfoloading ? <span className="inline-block w-8 h-4 bg-white/50 rounded animate-pulse"></span> : userData?.total_users ?? '—'}
//                 </span>
//               </div>

//               {/* Direct Count */}
//               <div className="flex gap-4 px-4 text-sm w-full">
//                 <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Left Direct</div>
//                   <div className="text-[12px]">
//                     {BinaryInfoloading ? <span className="inline-block w-10 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.left_direct_count ?? '—').toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Right Direct</div>
//                   <div className="text-[12px]">
//                     {BinaryInfoloading ? <span className="inline-block w-10 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.right_direct_count ?? '—').toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               {/* Team Count */}
//               <div className="flex gap-4 px-4 text-sm w-full mt-4">
//                 <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Left Team</div>
//                   <div className="text-[12px]">
//                     {BinaryInfoloading ? <span className="inline-block w-10 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.left_team_count ?? '—').toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Right Team</div>
//                   <div className="text-[12px]">
//                     {BinaryInfoloading ? <span className="inline-block w-10 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.right_team_count ?? '—').toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               {/* Volume */}
//               <div className="flex gap-4 px-4 text-sm w-full mt-4">
//                 <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center flex items-center justify-center">
//                   <div>
//                     <div className="font-semibold text-[12px]">Left Volume</div>
//                     <div className="text-[12px]">
//                       {BinaryInfoloading ? <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.left_team_business ?? '—').toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center flex items-center justify-center">
//                   <div>
//                     <div className="font-semibold text-[12px]">Right Volume</div>
//                     <div className="text-[12px]">
//                       {BinaryInfoloading ? <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span> : (BinaryInfo?.right_team_business ?? '—').toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Income */}
//               <div className="flex gap-4 px-4 text-sm w-full mt-4">
//                 <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Total Volume</div>
//                   <div className="text-xs font-semibold text-white">
//                     {BinaryInfoloading ? <span className="inline-block w-14 h-4 bg-white/50 rounded animate-pulse"></span> : ((Number(BinaryInfo?.left_team_business ?? 0) + Number(BinaryInfo?.right_team_business ?? 0)).toLocaleString())}
//                   </div>
//                 </div>
//                 <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
//                   <div className="font-semibold text-[12px]">Total Earnings</div>
//                   <div className="text-[12px]">
//                     {BinaryInfoloading ? <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span> : '0'}
//                   </div>
//                 </div>
//               </div>
//             </Card>



//             <Card className="bg-white p-4 flex flex-col gap-4 overflow-hidden">
//               <div className="p-2">
//                 {/* Heading */}
//                 <h4 className="text-lg font-bold text-center mb-2">
//                   <span className="flex justify-center items-center text-[15px] gap-1">
//                     <FaTrophy className="w-4 h-4" /> Club & Reward Details
//                   </span>
//                 </h4>

//                 {/* Current Club */}
//                 <h5 className="font-semibold text-purple-700 border mt-6 border-purple-700 shadow-lg shadow-purple-700 px-4 py-2 rounded-xl mx-auto w-fit text-center">
//                   <span>Current Club:</span>
//                   <span className="ml-2">
//                     {clubLoading ? (
//                       <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse"></span>
//                     ) : (
//                       userData?.user_club || '—'
//                     )}
//                   </span>
//                 </h5>

//                 {/* Next Club Target */}
//                 <div className="overflow-hidden w-full p-3 mt-5 rounded-2xl inline-block bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
//                   <CardDescription className="text-white text-[15px] animate-bounce flex gap-1">
//                     <Siren color="red" className="h-5 w-5" /> To Achieve the Target of{' '}
//                     {clubLoading ? (
//                       <span className="inline-block w-20 h-4 bg-white/50 rounded animate-pulse"></span>
//                     ) : (
//                       clubData?.next_club || '—'
//                     )}
//                   </CardDescription>
//                 </div>

//                 {/* Progress Bars */}
//                 <div className="mt-4 space-y-4">
//                   {clubLoading
//                     ? Array(3)
//                       .fill(0)
//                       .map((_, idx) => (
//                         <div key={idx} className="space-y-1">
//                           <div className="flex justify-between items-center text-sm text-gray-700">
//                             <span className="font-medium">
//                               <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse"></span>
//                             </span>
//                             <span className="text-xs">
//                               <span className="inline-block w-12 h-3 bg-gray-200 rounded animate-pulse"></span>
//                             </span>
//                           </div>
//                           <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
//                             <div className="bg-emerald-400 h-full w-1/2 animate-pulse"></div>
//                             <div className="bg-red-400 h-full w-1/2 animate-pulse"></div>
//                           </div>
//                         </div>
//                       ))
//                     : clubData?.progress.map((item, idx) => {
//                       const total = Number(item.required) || 1
//                       const current = Number(item.current) || 0
//                       const remaining = total - current
//                       const currentPercent = Math.min((current / total) * 100, 100)
//                       const remainingPercent = 100 - currentPercent

//                       return (
//                         <div key={idx} className="space-y-1">
//                           <div className="flex justify-between items-center text-sm text-gray-700">
//                             <span className="font-medium">{item.title}</span>
//                             <span className="text-xs">
//                               {current} / {total} {item.status && '✅'}
//                             </span>
//                           </div>
//                           <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
//                             <div
//                               className="bg-emerald-400 h-full transition-all duration-700"
//                               style={{ width: `${currentPercent}%` }}
//                             ></div>
//                             <div
//                               className="bg-red-400 h-full transition-all duration-700"
//                               style={{ width: `${remainingPercent}%` }}
//                             ></div>
//                           </div>
//                           {!item.status && (
//                             <div className="text-xs text-gray-400 text-right font-medium">
//                               {remaining} remaining
//                             </div>
//                           )}
//                         </div>
//                       )
//                     })}
//                 </div>
//               </div>
//             </Card>

//           </div>

//         </div>


//         {/* <div className="col-span-full">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//             <Card className="p-2 gap-3 bg-white">
//               <h4 className="text-lg font-bold text-center">
//                 <span className="flex justify-center items-center text-[15px] gap-1">
//                   <FaTrophy className="w-4 h-4" />
//                   Club & Reward Details
//                 </span>
//               </h4>

//               <h5 className="font-semibold text-purple-700 border  border-purple-700 shadow-lg shadow-purple-700 px-4 py-2 rounded-xl mx-auto w-fit text-center">
//                 <span>Current Club:</span>
//                 <span className="ml-2">{userData?.user_club || '—'}</span>
//               </h5>

//               <div className="overflow-hidden w-full p-3  rounded-2xl bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
//                 <CardDescription className="text-white text-[15px] animate-bounce flex gap-1">
//                   <Siren color="red" className="h-5 w-5" />
//                   To Achieve the Target of {clubData?.next_club || '—'}
//                 </CardDescription>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//                 {clubData?.progress?.map((item, idx) => {
//                   const total = Number(item.required) || 1;
//                   const current = Number(item.current) || 0;
//                   const remaining = total - current;
//                   const currentPercent = Math.min((current / total) * 100, 100);
//                   const remainingPercent = 100 - currentPercent;

//                   return (
//                     <div key={idx} className="space-y-1 p-3 border rounded-lg shadow-sm bg-white">
//                       <div className="flex justify-between items-center text-sm text-gray-700">
//                         <span className="font-medium">{item.title}</span>
//                         <span className="text-xs">
//                           {current} / {total} {item.status && '✅'}
//                         </span>
//                       </div>

//                       <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
//                         <div
//                           className="bg-emerald-400 h-full transition-all duration-700"
//                           style={{ width: `${currentPercent}%` }}
//                         />
//                         <div
//                           className="bg-red-400 h-full transition-all duration-700"
//                           style={{ width: `${remainingPercent}%` }}
//                         />
//                       </div>

//                       {!item.status && (
//                         <div className="text-xs text-gray-500 text-right font-medium">
//                           {remaining} remaining
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//             </Card>

//             <Card className="bg-white  p-4 flex flex-col gap-4 overflow-hidden">
//               <h4 className="text-lg font-bold text-center">
//                 <span className="flex justify-center items-center text-[15px] gap-1">
//                   <BsSuitClubFill className="w-4 h-4" />
//                   Club Count
//                 </span>
//               </h4>
//               <div className="col-span-full">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                   <div className="col-span-full lg:col-span-3">
//                     <Card className="border-none container mx-auto flex flex-col sm:flex-row items-center gap-4 w-full overflow-hidden">
//                       {userData?.club_counts && Object.keys(userData.club_counts).length > 0 ? (
//                         <div className="flex flex-wrap justify-center items-center gap-3 m-auto text-sm text-gray-700">
//                           {Object.entries(userData.club_counts).map(([club, count]) => {
//                             const countNum = Number(count);
//                             const isEmpty = countNum === 0;
//                             return (
//                               <span
//                                 key={club}
//                                 className={`px-3 py-1 rounded-full border transition 
//                                 ${isEmpty
//                                     ? 'text-gray-400 border-gray-200 bg-gray-50'
//                                     : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
//                                   }`}
//                               >
//                                 {countNum === 0 ? club : `${club} - ${countNum}`}
//                               </span>
//                             );
//                           })}
//                         </div>
//                       ) : (
//                         <span className="text-sm text-red-500 font-medium">
//                           No Club Members associated with you !!!
//                         </span>
//                       )}
//                     </Card>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//           </div>
//         </div> */}

//         <div className="col-span-full">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//             <div className="col-span-full  lg:col-span-3">

//               <Card className="bg-white container mx-auto flex flex-col sm:flex-row items-center gap-4 p-4 w-full overflow-hidden">


//                 {userData?.club_counts && Object.keys(userData.club_counts).length > 0 ? (
//                   <div className="flex flex-wrap justify-center items-center gap-3 m-auto text-sm text-gray-700">
//                     {Object.entries(userData.club_counts).map(([club, count]) => {
//                       const countNum = Number(count);
//                       return (
//                         <span
//                           key={club}
//                           className={`px-3 py-1 rounded-full border transition ${countNum === 0
//                             ? 'text-gray-400 border-gray-200 bg-gray-50'
//                             : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
//                             }`}
//                         >
//                           {countNum === 0
//                             ? club
//                             : countNum === 1
//                               ? `${club}`
//                               : `${club} - ${countNum}`}
//                         </span>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <span className="text-sm text-red-500 font-medium">
//                     No Club Members associated with you !!!
//                   </span>
//                 )}
//               </Card>
//             </div>

//           </div>
//         </div>

//       </div>

//     </div >
//   )
// }

// function VolumeBox({
//   label,
//   value,
//   coin = false,
//   side,
//   loading = false,
// }: {
//   label: string
//   value?: number | null
//   coin?: boolean
//   side?: 'Left' | 'Right'
//   loading?: boolean
// }) {
//   const isLeft = side === 'Left'
//   const boxColor = isLeft
//     ? 'bg-blue-600 border-blue-700 shadow-blue-200/50'
//     : 'bg-purple-600 border-purple-700 shadow-purple-200/50'

//   return (
//     <div className={`border shadow-lg p-3 rounded text-white text-center flex-1 ${boxColor}`}>
//       <p className="font-semibold text-[12px]">{label}</p>
//       <p className="flex justify-center items-center gap-1 text-[14px]">
//         {loading ? (
//           <span className="inline-block w-12 h-4 bg-white/50 rounded animate-pulse"></span>
//         ) : (
//           <>
//             {value?.toLocaleString() ?? 0}
//             {coin && <Image alt="KAIT Logo" src={Logo} width={14} height={14} />}
//           </>
//         )}
//       </p>
//     </div>
//   )
// }

// export default UserDashboard
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { verifyKYCStatus } from '../../../store/slices/index'
import { Bell, ClipboardCopy, Siren } from 'lucide-react'
import ReferralComponent from '@/app/user/components/referralComponent'
import { fetchClubProgress } from '@/store/slices/user/nextClubSlice'
import { BsSuitClubFill } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Bg1 from '../../../assets/gold.png'
import Bg2 from '../../../assets/platinum.png'
import Bg3 from '../../../assets/redDimond.png'
// import Bg4 from '../../../assets/platinum.jpg'
// import Wallets from './wallet'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { motion } from 'framer-motion'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import {
  FaEllipsisH,
  FaHandPointRight,
  FaList,
  FaTimes,
  FaTrophy,
  FaUser,
  FaUserPlus,
  FaWallet,
} from 'react-icons/fa'
import { FaSquareCheck } from 'react-icons/fa6'
import Logo from '@/assets/logo2x.png'
import Logoblue from '@/assets/logo2xblue.png'
import CountUp from 'react-countup'
import { fetchBinaryInfo } from '@/store/slices/binaryinfoslice'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import {
  Wallet,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Gift,
  ArrowUpRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PiHandWithdraw } from 'react-icons/pi'
import { generateReferralLink } from '../../../store/slices/index'
import { Button } from '@/components/ui/button'
import { performRestake, resetRestake } from '@/store/slices/user/restakeSlice'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

interface RestakeFormProps {
  walletType?: 'IncomeWallet' | 'ReStakeWallet'
  onSuccess?: () => void
  onClose?: () => void

}

function RestakeForm({ walletType, onSuccess, onClose }: RestakeFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector((state) => state.Restake)
  const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)

  const restakeWalletKinds = dropdownOptions?.restake_wallet_kinds ?? []

  const [amount, setAmount] = useState<number>(0)
  const [walletKind, setWalletKind] = useState<string>('')
  const [confirmVisible, setConfirmVisible] = useState(false) // ✅ toggle Yes/No

  useEffect(() => {
    dispatch(fetchDropdownOptions())
  }, [dispatch])

  useEffect(() => {
    if (walletType) setWalletKind(walletType)
    else if (restakeWalletKinds.length > 0 && !walletKind)
      setWalletKind(restakeWalletKinds[0].value as string)
  }, [restakeWalletKinds, walletKind, walletType])

  useEffect(() => {
    if (!error) return
    let msg = ''
    if (typeof error === 'string') msg = error
    else if (Array.isArray(error)) msg = error.map((e) => e.msg).join(', ')
    else if (error && 'detail' in error) {
      const detail = (error as any).detail
      msg = typeof detail === 'string' ? detail : JSON.stringify(detail)
    } else msg = JSON.stringify(error) || 'Something went wrong'

    toast.error(msg)
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success('Restake successful!')
      setAmount(1000)
      dispatch(resetRestake())
      if (onSuccess) onSuccess()
    }
  }, [success, dispatch, onSuccess])

  const handleConfirmYes = async () => {
    setConfirmVisible(false)

    if (amount <= 0) return toast.error('Amount must be greater than 0')

    const minAmount = walletKind === 'ReStakeWallet' ? 3000 : 1000
    if (amount < minAmount || amount % 1000 !== 0) {
      return toast.error(`'Amount' should be >= ${minAmount} and a multiple of 1000.`)
    }

    await dispatch(performRestake({ wallet_kind: walletKind as any, amount }))
    if (onClose) onClose()

  }

  const handleConfirmNo = () => {
    setConfirmVisible(false)
    toast('Restake cancelled.')
  }

  return (
    <div className="p-6 z-[999] space-y-6 bg-gradient-to-br from-purple-50 via-purple-100 to-white rounded-xl shadow-xl border border-purple-300 max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold text-purple-700 mb-4 animate-pulse">
        Restake Your Wallet
      </h2>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Select Wallet</label>
        <select
          value={walletKind}
          onChange={(e) => setWalletKind(e.target.value)}
          disabled={!!walletType}
          className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        >
          {restakeWalletKinds.length > 0 ? (
            restakeWalletKinds.map((wallet) => (
              <option key={wallet.id} value={wallet.value ?? ''}>
                {wallet.value}
              </option>
            ))
          ) : (
            <option disabled>Loading wallets...</option>
          )}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Amount</label>
        <Input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount (multiple of 1000)"
          className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />
        <p className="text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-md p-2 mt-1 font-medium">
          {walletKind === 'ReStakeWallet'
            ? 'ReStake Wallet restake should be a minimum of 3000 KAIT and in multiples of 1000.'
            : walletKind === 'IncomeWallet'
              ? 'Income Wallet restake should be a minimum of 1000 KAIT and in multiples of 1000.'
              : 'Select a wallet type to see its restake requirements.'}
        </p>
      </div>

      {/* ✅ Inline Yes/No buttons */}
      {!confirmVisible ? (
        <Button
          onClick={() => setConfirmVisible(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Restake
        </Button>
      ) : (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleConfirmYes}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Yes
          </Button>
          <Button
            onClick={handleConfirmNo}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            No
          </Button>
        </div>
      )}
    </div>
  )
}


function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { kycVerified, kycStatusLoading } = useAppSelector((state) => state.auth)
  const { data: userData, loading: userLoading } = useAppSelector((state) => state.UserTree)
  const { data: clubData, loading: clubLoading } = useAppSelector((state) => state.clubProgress)
  const { data: BinaryInfo, loading: BinaryInfoloading, error: Binaryerror } = useSelector((state: RootState) => state.binaryInfo)
  const { referralLink, isLoading: referralLoading, error: referralError } = useSelector(
    (state: RootState) => state.auth
  )
  const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)
  useEffect(() => {
    dispatch(fetchDropdownOptions());
  }, [dispatch]);
  const binaryIncomeList = dropdownOptions?.binary_income_percentage ?? [];

  const userClub = userData?.user_club?.trim() ?? '';
  const cappingLimits = dropdownOptions?.capping_limit ?? []

  const matchedCapping = cappingLimits.find(
    (item) => item.id.trim().toLowerCase() === userClub.toLowerCase()
  )
  const cappingMultiplier = matchedCapping?.value ?? 0


  const userBinaryPercentage =
    binaryIncomeList.find(
      (item) => item.id.trim().toLowerCase() === userClub.toLowerCase()
    )?.value ?? 0;

  const latestBalance = userData?.wallets?.restake_wallet || '0'
  const [tab, setTab] = useState('club')

  const ran = useRef(false);



  useEffect(() => {
    if (ran.current) return
    ran.current = true

    dispatch(fetchUserData())
    dispatch(verifyKYCStatus())
  }, [dispatch])


  const ranClubProgress = useRef(false);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!userData?.id) {
      ranClubProgress.current = false;
      previousUserId.current = null;
      return;
    }

    if (previousUserId.current !== userData.id) {
      ranClubProgress.current = false;
    }

    if (!ranClubProgress.current) {
      ranClubProgress.current = true;
      previousUserId.current = userData.id;

      dispatch(fetchClubProgress({ user_id: userData.id }));
    }
  }, [dispatch, userData?.id]);

  const ranBinaryInfo = useRef(false);

  useEffect(() => {
    if (!userData?.id || ranBinaryInfo.current) return
    ranBinaryInfo.current = true

    dispatch(fetchBinaryInfo(userData.id))
  }, [dispatch, userData?.id])

  const ranReferral = useRef(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (!ranReferral.current) {
      ranReferral.current = true
      dispatch(generateReferralLink())
    }
  }, [dispatch])

  const handleCopy = () => {
    if (referralLink) {
      const referralUrl = `https://www.kaitcoin.org/auth/signup?token=${referralLink}`
      navigator.clipboard.writeText(referralUrl).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    }
  }

  const wallethandleCopy = (textToCopy: string) => {
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }



  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
  const BgImage = [{ img: Bg1 }, { img: Bg2 }, { img: Bg3 },
    // { img: Bg4 }
  ]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const levelChartData =
    userData?.level_info?.levels.map((level) => ({
      name: `L${level.level}`,
      users: level.total_users,
      volume: Number(level.total_volume),
    })) || []

  const [copied, setCopied] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [walletType, setWalletType] = useState<'IncomeWallet' | 'ReStakeWallet'>('IncomeWallet')

  const openRestakeDialog = (type: 'IncomeWallet' | 'ReStakeWallet') => {
    setWalletType(type)
    setIsDialogOpen(true)
  }



  const [activeTab, setActiveTab] = useState<'previous' | 'current'>('previous')
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (userData && !sessionStorage.getItem('loginPopupShown')) {
      setShowLoginPopup(true);
      sessionStorage.setItem('loginPopupShown', 'true');
    }
  }, [userData]);


  if (kycStatusLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
  const totalUsers =
    userData?.level_info?.levels.reduce((sum, lvl) => sum + lvl.total_users, 0) ||
    0

  const leftUsers = Math.floor(totalUsers / 2)
  const rightUsers = totalUsers - leftUsers
  const earned = userData?.income_eligibility?.total_income ?? 0
  const maxLimit = userData?.income_eligibility?.user_max_income_limit ?? 1
  const remaining = Math.max(maxLimit - earned, 0)

  const earnedPercent = Math.min((earned / maxLimit) * 100, 100)
  const remainingPercent = 100 - earnedPercent

  type WalletData = {
    title: string
    amount: string
    list: string[] | string
    onClickList: (() => void)[]
    isOpen: boolean
    onToggle: () => void
    icon: React.ReactNode
    gradient: string
    accentColor: string
  }

  const WalletCard = ({
    title,
    amount,
    list,
    isOpen,
    onToggle,
    icon,
    gradient,
    accentColor,
    onClickList,
  }: WalletData) => {
    const dropdownItems = Array.isArray(list) ? list : [list]

    return (
      <div className="group relative">
        <div
          className={`absolute -inset-1 ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}
        ></div>

        <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-visible transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
          <div className="absolute inset-0 opacity-5 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100 to-transparent transform rotate-12 scale-150"></div>
          </div>

          <div className={`relative ${gradient} p-4 text-white rounded-t-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {icon}
                </div>
                <h3 className="font-semibold text-sm leading-tight">{title}</h3>
              </div>

              {/* Dropdown toggle */}
              <div className="relative">
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-180"
                >
                  {isOpen ? (
                    <FaTimes className="w-4 h-4" />
                  ) : (
                    <FaEllipsisH className="w-4 h-4" />
                  )}
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 z-50 min-w-[120px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    {dropdownItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onToggle()
                          if (onClickList[idx]) onClickList[idx]()
                        }}
                        className="w-full  px-4 py-2  text-sm text-gray-700 border-b-1  rounded-xl dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative px-4 py-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 relative">
                <Image
                  alt="KAIT Logo"
                  src={Logo}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-[12px] font-bold text-gray-900 dark:text-white">
                {amount}
              </span>
            </div>

            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${gradient} rounded-full transition-all duration-1000 ease-out transform origin-left`}
                style={{
                  width: `${Math.min(parseInt(amount.replace(/,/g, '')) / 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Glowing dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"></div>
            <div
              className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-ping"
              style={{ animationDelay: '2s' }}
            ></div>
          </div>
        </div>
      </div>

    )
  }


  const AnimatedWallets = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const router = useRouter()


    if (clubLoading || !userData) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-purple-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-3 h-3 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      )
    }

    const walletIcons = [
      <Wallet className="w-4 h-4" />,
      <PiggyBank className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Wallet className="w-4 h-4" />,
      <Gift className="w-4 h-4" />,
      <Gift className="w-4 h-4" />,
      <TrendingUp className="w-4 h-4" />,
      <PiHandWithdraw className="w-4 h-4" />,
    ]

    const gradients = Array(12).fill(
      'bg-gradient-to-r from-blue-500 to-purple-700',
    )
    const accentColors = Array(12).fill('bg-pink-100 text-purple-700')

    const data = [
      {
        title: 'KAIT Wallet',
        amount: (Number(userData?.wallets?.kiat_wallet) || 0).toLocaleString(),
        list: 'View Wallet',
        onClickList: [() => router.push('/user/walletSummary?wallet_kind=KaitWallet&page=1')],
      },
      {
        title: 'Total Staking',
        amount: (Number(userData?.total_staking) || 0).toLocaleString(),
        list: ['New Staking', 'All Staking'],
        onClickList: [
          () => router.push('/user/stakingcontracts/yourstakingcontracts'),
        ],
      },
      {
        title: 'ROS Wallet',
        amount: (Number(userData?.wallets?.ros_wallet) || 0).toLocaleString(),
        list: ['Summary'],
        onClickList: [
          () =>
            router.push(
              '/user/walletSummary?wallet_kind=RosWallet&page=1',
            ),
        ],
      }, {
        title: 'Fixed ROS',
        amount: `${(Number(userData?.wallets?.fixed_ros_wallet) || 0).toLocaleString()}         `,
        list: 'Summary',
        onClickList: [
          () =>
            router.push('/user/walletSummary?wallet_kind=FixedRosWallet&page=1'),
        ],
      },

      {
        title: 'Income Wallet',
        amount: (Number(userData?.wallets?.income_wallet) || 0).toLocaleString(),
        list: ['View Wallet', 'Restake'],
        onClickList: [
          () =>
            router.push(
              '/user/walletSummary?wallet_kind=IncomeWallet&page=1',
            ),
          () => openRestakeDialog('IncomeWallet'),

        ],
      },
      {
        title: 'Super Wallet',
        amount: (Number(userData?.wallets?.super_wallet) || 0).toLocaleString(),
        list: 'Summary',
        onClickList: [
          () =>
            router.push(
              '/user/walletSummary?wallet_kind=SuperWallet&page=1',
            ),
        ],
      },
      {
        title: 'Restake Wallet',
        amount: (Number(userData?.wallets?.restake_wallet) || 0).toLocaleString(),
        list: ['View Wallet', 'Restake'],
        onClickList: [
          () => router.push('/user/walletSummary?wallet_kind=ReStakeWallet&page=1'),
          () => openRestakeDialog('ReStakeWallet'),
        ],
      },
      {
        title: 'Adhoc Wallet',
        amount: (Number(userData?.wallets?.adhoc_wallet) || 0).toLocaleString(),
        list: 'Summary',
        onClickList: [() => router.push('/user/transfers/adhoc-wallet-transfer')],
      },
      {
        title: 'Utility Voucher',
        amount: (Number(userData?.wallets?.vpay_voucher) || 0).toLocaleString(),
        list: 'Summary',
        onClickList: [() => router.push('/user/walletSummary?wallet_kind=VpayVoucher&page=1')],
      },
      {
        title: 'Ecom Voucher',
        amount: (Number(userData?.wallets?.ecommerce_voucher) || 0).toLocaleString(),
        list: 'Summary',
        onClickList: [() => router.push('/user/walletSummary?wallet_kind=EcommerceVoucher&page=1')],
      },



      {
        title: 'Total Earnings',
        amount: (Number(userData?.wallets?.total_level_income) || 0).toLocaleString(),
        list: 'Summary',
        onClickList: [
          () =>
            router.push(
              '/user/walletSummary?wallet_kind=IncomeWallet&page=1',
            ),
        ],
      },
      {
        title: 'Withdrawal',
        // amount: (Number(userData?.total_withdraw) || 0).toLocaleString(),
        amount: (Number(userData?.withdraw) || 0).toLocaleString(),
        list: ['Ros', 'Fiat'],
        onClickList: [
          () => router.push('/user/withdrawal/roswithdrawal'),
          () => router.push('/user/withdrawal/fiatwithdrawal'),
        ],
      },



      // {
      //       title: 'Fixed ROS',
      //       amount: `${(Number(userData?.wallets?.fixed_ros_wallet) || 0).toLocaleString()}
      //        / total:${(Number(userData?.wallets?.total_fixed_ros) || 0).toLocaleString()}
      //        `,
      //       list: 'Summary',
      //       onClickList: [
      //         () =>
      //           router.push('/user/walletSummary?wallet_kind=RosWallet&page=1'),
      //       ],
      //     }
    ]

    return (
      <div className="dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.map((wallet, index) => (
              <WalletCard
                key={index}
                title={wallet.title}
                amount={wallet.amount}
                list={wallet.list}
                onClickList={wallet.onClickList}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
                icon={walletIcons[index]}
                gradient={gradients[index]}
                accentColor={accentColors[index]}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="pt-5 bg-blue-50 hover:bg-purple-50  pb-[20px]  transition-colors duration-2000">
      <div className="items-center mx-auto px-[20px] w-auto h-[180px ] grid grid-cols-1 lg:grid-cols-3 container mb-[20px]">
        <div className="col-span-1 lg:col-span-3 h-[180px] ">
          <Carousel
            plugins={[plugin.current]}
            className="lg:px-7 px-0"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {BgImage.map((image, imgIndex) => (
                <CarouselItem key={imgIndex}>
                  <div className="p-1 rounded-2xl h-[200px]">
                    <Card className="border-none p-0">
                      <CardContent className="flex p-0 aspect-square items-center h-[200px] bg-center justify-center">
                        <div key={imgIndex} className="relative w-full h-full">
                          <Image
                            src={image.img}
                            alt={`Background ${imgIndex + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg w-full h-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="container px-[20px] mx-auto lg:grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className="col-span-full lg:col-span-2">
          <AnimatedWallets />
          <div className="w-full px-4">
          </div>
        </div>

        <div className="flex flex-col items-center justify-start gap-4 mt-6 lg:mt-0 h-full pt-8">

          <Card className="w-full py-0  bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400 gap-2 rounded-lg transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]">
            <CardHeader className="p-0 ">
              <CardTitle className="p-0 h-full w-full">
                <Button
                  className="w-full h-full font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-white 
                   shadow-[0_0_10px_rgba(147,51,234,0.8)] hover:shadow-[0_0_20px_rgba(147,51,234,1)] 
                   transition-all duration-300 flex items-center justify-center"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Restake
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>


          {isDialogOpen && (
            <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 ">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <h2 className="text-lg font-bold mb-4 text-center">Restake</h2>

                {/* Pass onClose to RestakeForm */}
                <RestakeForm onClose={() => setIsDialogOpen(false)} />

                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsDialogOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {/* {showLoginPopup && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center">
                  <Image
                    src={Logo} 
                    alt="Welcome"
                    width={150}
                    height={150}
                    className="object-contain mb-4"
                  />
                  <h2 className="text-xl font-bold mb-2">Welcome Back!</h2>
                  <p className="text-gray-600 text-center">
                    We're glad to see you again. Check your latest updates in your dashboard.
                  </p>
                  <button
                    onClick={() => setShowLoginPopup(false)}
                    className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )} */}


          <Card className="w-full p-3 bg-white shadow-md gap-2 rounded-lg">
            <CardHeader>
              <CardTitle className="text-center flex justify-center items-center text-gray-800 font-semibold">
                <FaUser className="w-4 h-4 text-purple-500 mr-2" />
                User Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Member & Sponsor Info */}
              <CardDescription className="text-gray-600 mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="text-[12px] text-gray-500">Member Name</span>
                      <p className="text-black text-[12px] font-semibold">{userData?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="text-[12px] text-gray-500">Sponsor</span>
                      <p className="text-black text-[12px] font-semibold">{userData?.sponsor_name}</p>
                    </div>
                  </div>
                </div>
              </CardDescription>

              {/* IDs */}
              <CardDescription className="text-gray-600 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[12px] text-gray-500">Member ID</span>
                    <p className="text-black text-[12px] font-semibold">{userData?.user_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] text-gray-500">Sponsor ID</span>
                    <p className="text-black text-[12px] font-semibold">{userData?.sponsor_username || "User"}</p>
                  </div>
                </div>
              </CardDescription>

              {/* KYC & Joining Date */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-600">KYC Status</span>
                  <div className="flex items-center gap-1">
                    {kycVerified ? (
                      <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                        <FaSquareCheck /> Verified
                      </span>
                    ) : (
                      <>
                        <span className="text-red-500 text-xs font-semibold">Not Verified</span>
                        <Link href="/user/kyc">
                          <span className="text-blue-600 text-xs font-normal border border-blue-400 bg-blue-100 px-2 py-0.5 rounded hover:bg-blue-200 transition cursor-pointer">
                            Submit KYC
                          </span>
                        </Link>

                      </>
                    )}
                  </div>
                </div>

                <div className="text-right flex gap-1 text-[12px] text-gray-600">
                  <span>Since</span>
                  <p className="text-black font-semibold">{userData?.joining_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>



          <Card className="w-full gap-2 p-4 bg-white">
            <div className="  p-3 rounded-2xl text-black  hover:shadow-md transition-shadow duration-200">
              <h2 className="text-sm font-semibold text-black mb-3 text-center">Wallet Address</h2>
              <div className="flex items-center gap-2 border border-purple-300 shadow-sm rounded px-3 py-2 w-full overflow-hidden bg-white text-black">
                <span
                  className="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis flex-1"
                  title={userData?.wallet}
                >
                  {userData?.wallet || '—'}
                </span>
                <button
                  onClick={() => wallethandleCopy(userData?.wallet || '')}
                  className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                  title="Copy Wallet Address"
                >
                  <ClipboardCopy size={20} />
                </button>
              </div>

              {copied && (
                <div className="text-xs text-green-600 mt-2 text-center">
                  Copied!
                </div>
              )}
            </div>
          </Card>



          <Card className="w-full gap-2 p-4 bg-white">
            <CardContent className="py-4">
              <CardDescription className="text-gray-600 font-bold justify-center flex items-center gap-1 mt-0 mb-1">
                <FaUserPlus className="w-5 h-5" />
                <span className="text-center">Your Referral Link</span>
              </CardDescription>

              <Card className="py-0 px-2 bg-gray-100">
                <div className="w-full overflow-hidden text-center">
                  {referralLoading ? (
                    <p>Loading referral link...</p>
                  ) : referralLink ? (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-1 rounded-lg w-full max-w-full">
                      <span className="truncate w-full font-medium text-sm sm:text-base">
                        {`https://www.kaitcoin.org/auth/signup?token=${referralLink}`}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-md hover:bg-blue-700"
                      >
                        {copySuccess ? 'Copied!' : <ClipboardCopy />}
                      </button>
                    </div>
                  ) : (
                    referralError && <p className="text-red-500 text-sm">Error: {referralError}</p>
                  )}
                </div>
              </Card>
            </CardContent>
          </Card>

        </div>




        {/* Capping 3X Card */}
        <Card className="flex-1 gap-0 bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-[15px] flex gap-1 justify-center items-center font-semibold mb-4">
            <Image
              alt="KAIT Logo"
              src={Logoblue}
              width={20}
              height={20}
              className="object-contain"
            />

            Capping

            <span className="text-purple-600 font-bold">
              {Number(cappingMultiplier) > 0 ? `${cappingMultiplier}X` : '—'}
            </span>

            - {maxLimit.toLocaleString()}
          </h4>


          <div className="bg-white shadow rounded-xl w-full">
            {/* Tooltip on hover */}
            <div className="relative group mb-2">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Total:
                  <Image
                    alt="KAIT Logo"
                    src={Logo}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                  <CountUp end={maxLimit} duration={1.5} separator="," />
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
                <div
                  className="bg-emerald-400 transition-all duration-1000"
                  style={{ width: `${remainingPercent}%` }}
                />
                {remainingPercent > 0 && (
                  <div
                    className="bg-red-400 transition-all duration-1000"
                    style={{ width: `${earnedPercent}%` }}
                  />
                )}
              </div>
            </div>

            {/* Bottom labels */}
            <div className="text-xs text-gray-600 font-medium flex justify-between">
              <span className="flex items-center gap-1">
                Earned:
                <span className="text-green-500 flex items-center gap-1">
                  <Image
                    alt="KAIT Logo"
                    src={Logo}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                  <CountUp end={remaining} duration={1.5} separator="," />
                </span>
              </span>
              <span className="flex items-center gap-1">
                Remaining:
                <span className="text-red-500 flex items-center gap-1">
                  <Image
                    alt="KAIT Logo"
                    src={Logo}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                  <CountUp end={earned} duration={1.5} separator="," />
                </span>
              </span>
            </div>
          </div>
        </Card>

        {/* Current Club Card */}
        <Card className="flex-1 p-4 w-full rounded-lg shadow-md bg-white text-center flex items-center justify-center">
          <div>
            <p className="font-semibold">Current Club- {userData?.user_club || '—'}</p>
            <p className="mt-2">Volume: --- + ---</p>

          </div>
        </Card>

        {/* Next Club Card */}
        <Card className="flex-1 p-2 rounded-lg shadow-md bg-white text-center flex items-center justify-center">
          <div>
            <p className="font-semibold">
              Next Club - {clubData?.next_club || '—'}
            </p>

            <p className="mt-2 text-sm">
              {clubData?.progress
                ?.map((item) => {
                  const total = Number(item.required) || 1
                  const current = Math.min(Number(item.current) || 0, total)
                  return `${item.title}: ${current.toLocaleString()} / ${total.toLocaleString()}${item.status ? ' ✅' : ''}`
                })
                .join(' + ')}
            </p>
          </div>
        </Card>






        <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


            <Card className="bg-white p-4">
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                {/* ----------- TABS BUTTONS ----------- */}
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="previous"
                    className="data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-700  shadow-lg shadow-purple-200/50  data-[state=active]:text-white"
                  >
                    Previous Month
                  </TabsTrigger>

                  <TabsTrigger
                    value="club"
                    className="data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg shadow-purple-200/50 data-[state=active]:text-white"
                  >
                    Current Month
                  </TabsTrigger>
                </TabsList>


                {/* ----------- PREVIOUS MONTH TAB ----------- */}
                <TabsContent value="previous">
                  <div className=" bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50  p-4 rounded-2xl text-white mb-4">
                    <h4 className="text-center font-bold mb-3">Previous Month Volume</h4>
                    <div className="flex justify-between items-center text-sm px-[20px] font-bold text-white">
                      <span>Club: {userData?.user_club}</span>
                      <span>Pair Match: {userBinaryPercentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Left / Right Level Income */}
                    {/* <div className="flex justify-between items-center gap-4 px-4">
                      {['Left', 'Right'].map((side) => (
                        <div
                          key={side}
                          className={`border shadow-lg p-3 rounded text-white text-center flex-1 ${side === 'Left'
                            ? 'bg-blue-600 border-blue-700 shadow-blue-200/50'
                            : 'bg-purple-600 border-purple-700 shadow-purple-200/50'
                            }`}
                        >
                          <p className="font-semibold text-[12px]">{side} Level Income</p>
                          <p className="flex justify-center items-center gap-1 text-[14px]">
                            0
                            <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
                          </p>
                        </div>
                      ))}
                    </div> */}

                    <div className="flex justify-between items-center gap-4 px-4">
                      <div
                        className={`border shadow-lg p-3 rounded text-white bg-purple-600 border-purple-700 shadow-purple-200/50 text-center flex-1 '
                          }`}
                      >
                        <p className="font-semibold text-[12px]"> Level Income</p>
                        <p className="flex justify-center items-center gap-1 text-[14px]">
                          0
                          <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
                        </p>
                      </div>

                    </div>

                    {/* Left / Right Volume */}
                    <div className="flex justify-between items-center gap-4 px-4">
                      <VolumeBox
                        label="Left Volume"
                        value={BinaryInfo?.left_prev_business}
                        side="Left"
                      />
                      <VolumeBox
                        label="Right Volume"
                        value={BinaryInfo?.right_prev_business}
                        side="Right"
                      />
                    </div>
                    {/* <div className="flex justify-between items-center gap-4 px-4">
                      <VolumeBox
                        label="Total Volume"
                        value={
                          (Number(BinaryInfo?.left_prev_business ?? 0) +
                            Number(BinaryInfo?.right_prev_business ?? 0))
                        }
                        side="Left"
                      />
                    </div> */}


                    {/* Pair Match / Days Left */}
                    <div className="flex justify-between items-center gap-4 px-4">
                      <VolumeBox
                        label="Pair Match volume"
                        value={BinaryInfo?.prev_month_pair_matching}
                        coin
                      />
                      {/* <div className="bg-gray-800 border border-gray-700 shadow-lg shadow-gray-200/50 p-3 rounded text-white text-center flex-1">
                        <CardDescription className="animate-bounce">
                          <p className="font-semibold text-[12px]">Days left</p>
                          <p className="flex justify-center items-center gap-1 text-[14px]">-</p>
                        </CardDescription>
                      </div> */}
                    </div>

                    {/* Unpair Left / Right */}
                    <div className="flex justify-between gap-4 px-4">
                      <VolumeBox label="Unpair Volume" value={0} coin side="Left" />
                      {/* <VolumeBox label="Carry Forword" value={0} coin side="Right" /> */}
                      <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
                        <CardDescription className="">
                          <p className="font-semibold text-[12px]">Carry Forword</p>
                          <p className="flex justify-center gap-1 text-[14px]">0%</p>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </TabsContent>


                {/* ----------- CLUB MONTHLY TAB ----------- */}
                <TabsContent value="club">
                  {/* Club Heading */}
                  <div className=" bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50 p-4 rounded-2xl text-white mb-4">
                    <h4 className="text-center font-bold mb-3">Club Based Monthly Volume</h4>
                    <div className="flex justify-between items-center text-sm px-[20px] font-bold text-white">
                      <span>Club: {userData?.user_club}</span>
                      <span>Pair Match: {userBinaryPercentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Left / Right Level Income */}
                    {/* <div className="flex justify-between items-center gap-4 px-4">
                    {['Left', 'Right'].map((side) => (
                      <div
                        key={side}
                        className={`border shadow-lg p-3 rounded text-white text-center flex-1 ${side === 'Left'
                          ? 'bg-blue-600 border-blue-700 shadow-blue-200/50'
                          : 'bg-purple-600 border-purple-700 shadow-purple-200/50'
                          }`}
                      >
                        <p className="font-semibold text-[12px]">{side} Level Income</p>
                        <p className="flex justify-center items-center gap-1 text-[14px]">
                          0
                          <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
                        </p>
                      </div>
                    ))}
                  </div> */}

                    <div className="flex justify-between items-center gap-4 px-4">
                      <div
                        className={`border shadow-lg p-3 rounded text-white bg-purple-600 border-purple-700 shadow-purple-200/50 text-center flex-1 '
                          }`}
                      >
                        <p className="font-semibold text-[12px]"> Level Income</p>
                        <p className="flex justify-center items-center gap-1 text-[14px]">
                          0
                          <Image alt="KAIT Logo" src={Logo} width={14} height={14} />
                        </p>
                      </div>

                    </div>


                    {/* Left / Right Volume */}
                    <div className="flex justify-between gap-4 px-4">
                      <VolumeBox label="Left Volume" value={BinaryInfo?.left_cur_business} side="Left" />
                      <VolumeBox label="Right Volume" value={BinaryInfo?.right_cur_business} side="Right" />
                    </div>

                    {/* Pair Match / Days Left */}
                    <div className="flex justify-between gap-4 px-4">
                      <VolumeBox
                        label="Pair Match Volume"
                        value={BinaryInfo?.current_month_pair_matching}
                        coin
                      />
                      {/* <div className="bg-gray-800 border border-gray-700 shadow-lg shadow-gray-200/50 p-3 rounded text-white text-center flex-1">
                        <CardDescription className="animate-bounce">
                          <p className="font-semibold text-[12px]">Days left</p>
                          <p className="flex justify-center gap-1 text-[14px]">-</p>
                        </CardDescription>
                      </div> */}
                    </div>

                    {/* Unpair Left / Right */}
                    <div className="flex justify-between gap-4 px-4">
                      {/* <VolumeBox label="Left Carry Forword" value={0} coin side="Left" /> */}
                      {/* <VolumeBox label="Carry Forword" value={0} coin side="Right" /> */}
                      <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
                        <CardDescription className="">
                          <p className="font-semibold text-[12px]">Left Carry Forword</p>
                          <p className="flex justify-center gap-1 text-[14px]">{BinaryInfo?.left_carry_forward}</p>
                        </CardDescription>
                      </div>
                      <div className="bg-purple-600 border-purple-700 shadow-purple-200/50 p-3 rounded text-white text-center flex-1">
                        <CardDescription className="">
                          <p className="font-semibold text-[12px]">Right Carry Forword</p>
                          <p className="flex justify-center gap-1 text-[14px]">{BinaryInfo?.right_carry_forward}</p>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </Card>


            <Card className="bg-white p-4">
              {/* Header */}
              <div className=" bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50 p-2 rounded-2xl text-white text-center font-bold mb-4">
                <span className="flex justify-center items-center gap-1 text-[14px]">
                  <p>My Total Team </p>
                  Member: {userData?.total_users ?? 0}
                </span>
              </div>

              {/* Direct Count */}
              <div className="flex gap-4 px-4 text-sm w-full">
                <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Left Direct</div>
                  <div className="text-[12px]">{(BinaryInfo?.left_direct_count ?? 0).toLocaleString()}</div>
                </div>
                <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Right Direct</div>
                  <div className="text-[12px]">{(BinaryInfo?.right_direct_count ?? 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Team Count */}
              <div className="flex gap-4 px-4 text-sm w-full mt-4">
                <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Left Team</div>
                  <div className="text-[12px]">{(BinaryInfo?.left_team_count ?? 0).toLocaleString()}</div>
                </div>
                <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Right Team</div>
                  <div className="text-[12px]">{(BinaryInfo?.right_team_count ?? 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Volume */}
              <div className="flex gap-4 px-4 text-sm w-full mt-4">
                <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center flex items-center justify-center">
                  <div>
                    <div className="font-semibold text-[12px]">Left Volume</div>
                    <div className="text-[12px]">{(BinaryInfo?.left_team_business ?? 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center flex items-center justify-center">
                  <div>
                    <div className="font-semibold text-[12px]">Right Volume</div>
                    <div className="text-[12px]">{(BinaryInfo?.right_team_business ?? 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Income */}
              <div className="flex gap-4 px-4 text-sm w-full mt-4">
                <div className="flex-1 bg-blue-600 border border-blue-700 shadow-lg shadow-blue-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Total Volume</div>
                  <div className="text-xs font-semibold text-white ">
                    {(Number(BinaryInfo?.left_team_business ?? 0) + Number(BinaryInfo?.right_team_business ?? 0)).toLocaleString()}
                  </div>
                </div>
                <div className="flex-1 bg-purple-600 border border-purple-700 shadow-lg shadow-purple-200/50 text-white p-3 rounded text-center">
                  <div className="font-semibold text-[12px]">Total Earnings</div>
                  <div className="text-[12px]">0</div>
                </div>
              </div>
            </Card>


            <Card className="bg-white p-4 flex flex-col gap-4 overflow-hidden">



              <div className="p-2">
                <h4 className="text-lg font-bold text-center mb-2">
                  <span className="flex justify-center items-center text-[15px] gap-1">
                    <FaTrophy className="w-4 h-4" /> Club & Reward Details
                  </span>
                </h4>
                <h5 className="font-semibold text-purple-700 border mt-6 border-purple-700 shadow-lg shadow-purple-700 px-4 py-2 rounded-xl mx-auto w-fit text-center">
                  <span>Current Club:</span>
                  <span className="ml-2">
                    {userData?.user_club || '—'}
                  </span>
                </h5>

                <div className="overflow-hidden w-full p-3 mt-5 rounded-2xl inline-block  bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
                  <CardDescription
                    className=" text-white text-[15px] animate-bounce
                  flex gap-1"
                  >
                    <Siren color="red" className=" h-5 w-5 " /> To Achive the
                    Target of {clubData?.next_club || '—'}
                  </CardDescription>
                </div>

                <div className="mt-4 space-y-4">
                  {clubData?.progress.map((item, idx) => {
                    const total = Number(item.required) || 1
                    const current = Number(item.current) || 0
                    const remaining = total - current
                    const currentPercent = Math.min(
                      (current / total) * 100,
                      100,
                    )
                    const remainingPercent = 100 - currentPercent

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-sm text-gray-700">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs">
                            {current} / {total} {item.status && '✅'}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
                          <div
                            className="bg-emerald-400 h-full transition-all duration-700"
                            style={{ width: `${currentPercent}%` }}
                          ></div>
                          <div
                            className="bg-red-400 h-full transition-all duration-700"
                            style={{ width: `${remainingPercent}%` }}
                          ></div>
                        </div>

                        {!item.status && (
                          <div className="text-xs text-gray-400 text-right font-medium">
                            {remaining} remaining
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* <div className="col-span-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  <div className="col-span-full  lg:col-span-3">

                    <Card className=" border-none container mx-auto flex flex-col sm:flex-row items-center gap-4 w-full overflow-hidden">


                      {userData?.club_counts && Object.keys(userData.club_counts).length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-3 m-auto text-sm text-gray-700">
                          {Object.entries(userData.club_counts).map(([club, count]) => {
                            const countNum = Number(count);
                            return (
                              <span
                                key={club}
                                className={`px-3 py-1 rounded-full border transition ${countNum === 0
                                  ? 'text-gray-400 border-gray-200 bg-gray-50'
                                  : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
                                  }`}
                              >
                                {countNum === 0
                                  ? club
                                  : countNum === 1
                                    ? `${club}`
                                    : `${club} - ${countNum}`}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-red-500 font-medium">
                          No Club Members associated with you !!!
                        </span>
                      )}
                    </Card>
                  </div>

                </div>
              </div> */}
            </Card>
          </div>

        </div>


        {/* <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <Card className="p-2 gap-3 bg-white">
              <h4 className="text-lg font-bold text-center">
                <span className="flex justify-center items-center text-[15px] gap-1">
                  <FaTrophy className="w-4 h-4" />
                  Club & Reward Details
                </span>
              </h4>

              <h5 className="font-semibold text-purple-700 border  border-purple-700 shadow-lg shadow-purple-700 px-4 py-2 rounded-xl mx-auto w-fit text-center">
                <span>Current Club:</span>
                <span className="ml-2">{userData?.user_club || '—'}</span>
              </h5>

              <div className="overflow-hidden w-full p-3  rounded-2xl bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
                <CardDescription className="text-white text-[15px] animate-bounce flex gap-1">
                  <Siren color="red" className="h-5 w-5" />
                  To Achieve the Target of {clubData?.next_club || '—'}
                </CardDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {clubData?.progress?.map((item, idx) => {
                  const total = Number(item.required) || 1;
                  const current = Number(item.current) || 0;
                  const remaining = total - current;
                  const currentPercent = Math.min((current / total) * 100, 100);
                  const remainingPercent = 100 - currentPercent;

                  return (
                    <div key={idx} className="space-y-1 p-3 border rounded-lg shadow-sm bg-white">
                      <div className="flex justify-between items-center text-sm text-gray-700">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs">
                          {current} / {total} {item.status && '✅'}
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-700"
                          style={{ width: `${currentPercent}%` }}
                        />
                        <div
                          className="bg-red-400 h-full transition-all duration-700"
                          style={{ width: `${remainingPercent}%` }}
                        />
                      </div>

                      {!item.status && (
                        <div className="text-xs text-gray-500 text-right font-medium">
                          {remaining} remaining
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </Card>

            <Card className="bg-white  p-4 flex flex-col gap-4 overflow-hidden">
              <h4 className="text-lg font-bold text-center">
                <span className="flex justify-center items-center text-[15px] gap-1">
                  <BsSuitClubFill className="w-4 h-4" />
                  Club Count
                </span>
              </h4>
              <div className="col-span-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="col-span-full lg:col-span-3">
                    <Card className="border-none container mx-auto flex flex-col sm:flex-row items-center gap-4 w-full overflow-hidden">
                      {userData?.club_counts && Object.keys(userData.club_counts).length > 0 ? (
                        <div className="flex flex-wrap justify-center items-center gap-3 m-auto text-sm text-gray-700">
                          {Object.entries(userData.club_counts).map(([club, count]) => {
                            const countNum = Number(count);
                            const isEmpty = countNum === 0;
                            return (
                              <span
                                key={club}
                                className={`px-3 py-1 rounded-full border transition 
                                ${isEmpty
                                    ? 'text-gray-400 border-gray-200 bg-gray-50'
                                    : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
                                  }`}
                              >
                                {countNum === 0 ? club : `${club} - ${countNum}`}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-red-500 font-medium">
                          No Club Members associated with you !!!
                        </span>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div> */}

        <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="col-span-full  lg:col-span-3">

              <Card className="bg-white container mx-auto flex flex-col sm:flex-row items-center gap-4 p-4 w-full overflow-hidden">


                {userData?.club_counts && Object.keys(userData.club_counts).length > 0 ? (
                  <div className="flex flex-wrap justify-center items-center gap-3 m-auto text-sm text-gray-700">
                    {Object.entries(userData.club_counts).map(([club, count]) => {
                      const countNum = Number(count);
                      return (
                        <span
                          key={club}
                          className={`px-3 py-1 rounded-full border transition ${countNum === 0
                            ? 'text-gray-400 border-gray-200 bg-gray-50'
                            : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
                            }`}
                        >
                          {countNum === 0
                            ? club
                            : countNum === 1
                              ? `${club}`
                              : `${club} - ${countNum}`}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-sm text-red-500 font-medium">
                    No Club Members associated with you !!!
                  </span>
                )}
              </Card>
            </div>

          </div>
        </div>

      </div>

    </div >
  )
}

function VolumeBox({
  label,
  value = 0,
  coin = false,
  side,
}: {
  label: string
  value?: number
  coin?: boolean
  side?: 'Left' | 'Right'
}) {
  const isLeft = side === 'Left'
  const boxColor = isLeft
    ? 'bg-blue-600 border-blue-700 shadow-blue-200/50'
    : 'bg-purple-600 border-purple-700 shadow-purple-200/50'

  return (
    <div
      className={`border shadow-lg p-3 rounded text-white text-center flex-1 ${boxColor}`}
    >
      <p className="font-semibold text-[12px]">{label}</p>
      <p className="flex justify-center items-center gap-1 text-[14px]">
        {value.toLocaleString()}
        {coin && <Image alt="KAIT Logo" src={Logo} width={14} height={14} />}
      </p>
    </div>
  )
}




export default UserDashboard
