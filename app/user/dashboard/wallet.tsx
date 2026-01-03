'use client'

import { useEffect, useState } from 'react'
import { FaEllipsisH, FaTimes } from 'react-icons/fa'
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Gift,
  ArrowUpRight,
} from 'lucide-react'
import Image from 'next/image'
import Logo from '@/assets/logo2xblue.png'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useRouter } from 'next/navigation'
import { PiHandWithdraw } from 'react-icons/pi'

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

        <div className="relative px-6 py-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-b-2xl">
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
            <span className="text-xl font-bold text-gray-900 dark:text-white">
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
  const dispatch = useAppDispatch()
  const { data: userData, loading } = useAppSelector((state) => state.UserTree)
  const router = useRouter()

  useEffect(() => {
    if (!userData && !loading) dispatch(fetchUserData())
  }, [dispatch, userData, loading])

  if (loading || !userData) {
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
    <PiggyBank className="w-4 h-4" />,
    <TrendingUp className="w-4 h-4" />,
    <TrendingUp className="w-4 h-4" />,
    <PiHandWithdraw className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <Gift className="w-4 h-4" />,
    <Gift className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
  ]

  const gradients = Array(12).fill(
    'bg-gradient-to-r from-blue-500 to-purple-700',
  )
  const accentColors = Array(12).fill('bg-pink-100 text-purple-700')

  const data = [
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
    },

    {
      title: 'Withdrawal',
      amount: (Number(userData?.withdraw) || 0).toLocaleString(),
      list: ['Ros', 'Fiat'],
      onClickList: [
        () => router.push('/user/withdrawal/roswithdrawal'),
        () => router.push('/user/withdrawal/fiatwithdrawal'),
      ],
    },
    {
      title: 'KAIT Wallet',
      amount: (Number(userData?.wallets?.kiat_wallet) || 0).toLocaleString(),
      list: 'View Wallet',
      onClickList: [() => router.push('/user/walletSummary?wallet_kind=KaitWallet&page=1')],
    },
    {
      title: 'Income Wallet',
      amount: (Number(userData?.wallets?.income_wallet) || 0).toLocaleString(),
      list: 'Summary',
      onClickList: [
        () =>
          router.push(
            '/user/walletSummary?wallet_kind=IncomeWallet&page=1',
          ),
      ],
    },
    {
      title: 'Adhoc Wallet',
      amount: (Number(userData?.wallets?.adhoc_wallet) || 0).toLocaleString(),
      list: 'Summary',
      onClickList: [() => router.push('/user/transfers/adhoc-wallet-transfer')],
    },
    {
      title: 'Restake Wallet',
      amount: (Number(userData?.wallets?.restake_wallet) || 0).toLocaleString(),
      list: ['View Wallet', 'Restake From Wallet'],
      onClickList: [() => router.push('/user/walletSummary?wallet_kind=ReStakeWallet&page=1')],
    },
    {
      title: 'Utility Voucher',
      amount: (Number(userData?.wallets?.vpay_voucher) || 0).toLocaleString(),
      list: 'Summary',
      onClickList: [() => router.push('/user/voucher/voucher-wallet-summary')],
    },
    {
      title: 'Ecom Voucher',
      amount: (Number(userData?.wallets?.ecommerce_voucher) || 0).toLocaleString(),
      list: 'Summary',
      onClickList: [() => router.push('/user/voucher/voucher-wallet-summary')],
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

export default AnimatedWallets