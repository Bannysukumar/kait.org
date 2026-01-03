import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/index'
import tokenAuthReducer from './slices/tokenAuth'
import profileReducer from './slices/profileSlice'
import nomineeReducer from './slices/nomineeslice'
import KycdownloadReducer from './slices/kycListdownload'
import Kyc from './slices/kycListdownload'
import bankReducer from './slices/user/bankSlice'
import investorReducer from './slices/admin/investorSlice'
import updateUserPermission from './slices/admin/permisionSlice'
import stakingReducer from './slices/user/stakeSlice'
import changePasswordReducer from './slices/user/changePasswordSlice'
import stakePlansReducer from './slices/admin/stakePlansSlice'
import resetPasswordSlice from './slices/admin/passwordReset'
import kycSlice from './slices/admin/kycDetails'
import KycListSlice from './slices/admin/kyclist'
import transactionpassReducer from './slices/user/transactionPassSlice'
import transactionOtpReducer from './slices/user/transationOtpSlice'
import incomeTransferReducer from './slices/user/incomeTransferSlice'
import kaitTransferReducer from './slices/user/kaitTransferSlice'
import transferWalletOtpReducer from './slices/user/TransferWalletOtpSlice'
import transferPinStatusReducer from './slices/user/transferPinStatusSlice'
import eligibleUsersTransferReducer from './slices/user/eligibleUserTransferSlice'
import restakeWalletReducer from './slices/user/restakeTransferSlice'
import RosWalletReducer from './slices/user/rosWalletTransferSlice'
import RosToREstakeReducer from './slices/user/RosToRestakeTransfer'
import FixedRosWalletReducer from './slices/user/fixedRosTransferSlice'
import adhocWalletReducer from './slices/user/adhocTransferSlice'
import fiatWalletReducer from './slices/user/fiatWalletTransfer'
import dropDownOptionsReducer from './slices/dropdownOptions'
import addbeneficiaryReducer from './slices/user/addBeneficiary'
import listbeneficiaryReducer from './slices/user/listBeneficiary'
import updateBeneficiaryReducer from './slices/user/updateBeneficiary'
import adminbeneficiaryReducer from './slices/admin/beneficiaryAdminSlice'
import FiatwithdrawReducer from './slices/user/walletWithdrawal/fiatWallet'
import FiatwithdrawFormReducer from './slices/user/walletWithdrawal/fiatWithdrawForm'
import FixedRoswithdrawFormReducer from './slices/user/walletWithdrawal/fixedRosWithdrawForm'
import fiatWalletSummaryReducer from './slices/user/walletWithdrawal/fiatWithdrawSummary'
import fixedRosWalletSummaryReducer from './slices/user/walletWithdrawal/fixedRosWithdrawalSummary'
import RoswithdrawReducer from './slices/user/walletWithdrawal/rosWallet'
import FixedRoswithdrawReducer from './slices/user/walletWithdrawal/fixedRosWalletbalance'
import RoswithdrawFormReducer from './slices/user/walletWithdrawal/rosWithdrawForm'
import RosWalletSummaryReducer from './slices/user/walletWithdrawal/rosWithdrawSummary'
import BeneficiaryEligibleReducer from './slices/user/beneficiaryeligible'
import withdrawListReducer from './slices/admin/withdrawlistSlice'
import withdrawActionReducer from './slices/admin/withdrawDecideSlice'
import userTreeReducer from './slices/user/userTreeDataReducer'
import stakeBalanceReducer from './slices/user/stakeBalanceSlice'
import stakeListReducer from './slices/user/stakeListSlice'
import IncomewalletSummaryReducer from './slices/user/walletSummary/incomeWalletSummarySlice'
import AdhocwalletSummaryReducer from './slices/user/walletSummary/adhocWalletSummarySlice'
import RestakewalletSummaryReducer from './slices/user/walletSummary/restakeWalletSummarySlice'
import RoswalletSummaryReducer from './slices/user/walletSummary/rosWalletSummarySlice'
import KaitwalletSummaryReducer from './slices/user/walletSummary/kaitWalletSummarySlice'
import generateVoucherReducer from './slices/user/voucher/voucherGenerateSlice'
import VoucherBalanceReducer from './slices/user/voucher/voucherBalanceSlice'
import voucherSummaryReducer from './slices/user/voucher/voucherSummarySlice'
import voucherWalletSummaryReducer from './slices/user/voucher/voucherWalletSummary'
import voucherUsageSummaryReducer from './slices/user/voucher/voucherUsageSummarySlice'
import voucherReciptSummaryReducer from './slices/admin/voucherReciptSummarySilce'
import voucherUsageAdminSummaryReducer from './slices/admin/voucherusageSlice'
import WalletSplitReducer from './slices/admin/walletSplitConfigSlice'
import WalletSplitListReducer from './slices/admin/walletSplitListSlice'
import WalletSplitUpdateReducer from './slices/admin/walletSplitUpdateSlice'
import forgotPasswordReducer from './slices/forgetPasswordSlice'
import clubVolumeReducer from './slices/admin/clubVolumeSlice'
import AdminUserReducer from './slices/admin/adminUserDataSlice'
import ClubsyncReducer from './slices/admin/clubSyncSlice'
import loadWalletReducer from './slices/admin/loadWalletSlice'
import AdminTransferReducer from './slices/admin/transferSummarySlice'
import UserWalletSummaryReducer from './slices/user/userWalletSummary'
import IncomeToSuperTranferReducer from './slices/user/incomeToSuperTransferSlice'
import AdhocToSuperTranferReducer from './slices/user/adhocToSuperTransferSlice'
import VpayToIncomeTranferReducer from './slices/user/vpayToIncomeTransfer'
import AdminStakeListReducer from './slices/admin/adminSliceListSlice'
import AllContractsDownloadReducer from './slices/admin/allcontractsDownload'
import SuperWalletTransferReducer from './slices/user/superWalletTransferSlice'
import SendEmailReducer from './slices/admin/SendEmailSlice'
import registrationStatReducer from './slices/admin/registrationStatSlice'
import eligibleUsersForUpdateReducer from './slices/admin/eligibleUserForUpdateSlice'
import updateUserReducer from './slices/admin/updateUserSlice'
import transferBalanceReducer from './slices/user/TransferBalanceSlice'
import userTreeIdReducer from './slices/admin/usertreeSlice'
import kaitWalletLoadReducer from './slices/admin/kaitwalletloadSlice'
import userTreeApiListIdReducer from './slices/user/userTreeApiList'
import transferSearchReducer from "./slices/user/transferSearchSlice";
import clubProgressReducer from './slices/user/nextClubSlice'
import BinaryInfoReducer from './slices/binaryinfoslice'
import RestakeReducer from './slices/user/restakeSlice'
import DetailesComboListReducer from './slices/admin/detailesComboListSlice'
import ComboOptionReducer from './slices/admin/comboPlanOptionSlice'
import CreateComboPlanReducer from './slices/admin/createComboPlanSlice'
import UpdateComboPlanReducer from './slices/admin/updateComboPlanSlice'
import ComboPlanReducer from './slices/user/comboPlanSlice'
import ComboStakePerformReducer from './slices/user/comboStakePerform'
import SuperVisorListReducer from './slices/admin/supervisorListSlice'
import supervisorAddReducer from "./slices/admin/supervisorAddSlice"
import supervisorUpdateReducer from "./slices/admin/supervisorUpdateSlice"



export const store = configureStore({
  reducer: {
    auth: authReducer,
    tokenAuth: tokenAuthReducer,
    profile: profileReducer,
    nominee: nomineeReducer,
    Kycdownload: KycdownloadReducer,
    kyclist: KycListSlice,
    binaryInfo: BinaryInfoReducer,
    fetchKycData: kycSlice,
    BankAccount: bankReducer,
    investor: investorReducer,
    updateUserPermission: updateUserPermission,
    stakingPlans: stakingReducer,
    changePassword: changePasswordReducer,
    stakePlans: stakePlansReducer,
    clubProgress: clubProgressReducer,
    resetpassword: resetPasswordSlice,
    transactionPin: transactionpassReducer,
    transactionOtp: transactionOtpReducer,
    incometransfer: incomeTransferReducer,
    kaitTransfer: kaitTransferReducer,
    fiattransfer: fiatWalletReducer,
    AdhocWalletTransfer: adhocWalletReducer,
    restaketransfer: restakeWalletReducer,
    Rostransfer: RosWalletReducer,
    RosToREstake: RosToREstakeReducer,
    FixedRostransfer: FixedRosWalletReducer,
    TranferwalletOpt: transferWalletOtpReducer,
    transferPinStatus: transferPinStatusReducer,
    eligibleUsersTransfer: eligibleUsersTransferReducer,
    transferSearch: transferSearchReducer,
    kaitWalletLoad: kaitWalletLoadReducer,
    dropDownOptions: dropDownOptionsReducer,
    addbeneficiary: addbeneficiaryReducer,
    listbeneficiary: listbeneficiaryReducer,
    updateBeneficiary: updateBeneficiaryReducer,
    adminbeneficiary: adminbeneficiaryReducer,
    Fiatwithdraw: FiatwithdrawReducer,
    FiatwithdrawForm: FiatwithdrawFormReducer,
    fixedroswithdrawForm: FixedRoswithdrawFormReducer,
    fiatWalletSummary: fiatWalletSummaryReducer,
    fixedRosWalletSummary: fixedRosWalletSummaryReducer,
    Roswithdraw: RoswithdrawReducer,
    FixedRoswithdraw: FixedRoswithdrawReducer,
    RoswithdrawForm: RoswithdrawFormReducer,
    RosWalletSummary: RosWalletSummaryReducer,
    BeneficiaryEligible: BeneficiaryEligibleReducer,
    withdrawList: withdrawListReducer,
    withdrawAction: withdrawActionReducer,
    UserTree: userTreeReducer,
    stakeBalance: stakeBalanceReducer,
    stakeList: stakeListReducer,
    IncomewalletSummary: IncomewalletSummaryReducer,
    AdhocwalletSummary: AdhocwalletSummaryReducer,
    RestakewalletSummary: RestakewalletSummaryReducer,
    RoswalletSummary: RoswalletSummaryReducer,
    KaitwalletSummary: KaitwalletSummaryReducer,
    generateVoucher: generateVoucherReducer,
    VoucherBalance: VoucherBalanceReducer,
    voucherSummary: voucherSummaryReducer,
    voucherWalletSummary: voucherWalletSummaryReducer,
    voucherUsageSummary: voucherUsageSummaryReducer,
    voucherReciptSummary: voucherReciptSummaryReducer,
    voucherUsageAdminSummary: voucherUsageAdminSummaryReducer,
    WalletSplit: WalletSplitReducer,
    walletSplitList: WalletSplitListReducer,
    walletSplitUpdate: WalletSplitUpdateReducer,
    forgotPassword: forgotPasswordReducer,
    clubVolume: clubVolumeReducer,
    AdminUser: AdminUserReducer,
    Clubsync: ClubsyncReducer,
    loadWallet: loadWalletReducer,
    AdminTransfer: AdminTransferReducer,
    UserWalletSummary: UserWalletSummaryReducer,
    IncomeToSuperTranfer: IncomeToSuperTranferReducer,
    AdhocToSuperTranfer: AdhocToSuperTranferReducer,
    VpayToIncomeTranfer: VpayToIncomeTranferReducer,
    AdminStakeList: AdminStakeListReducer,
    AllContractsDownload: AllContractsDownloadReducer,
    SuperWalletTransfer: SuperWalletTransferReducer,
    SendEmail: SendEmailReducer,
    registrationStat: registrationStatReducer,
    eligibleUsersForUpdate: eligibleUsersForUpdateReducer,
    updateUser: updateUserReducer,
    transferBalance: transferBalanceReducer,
    userTreeId: userTreeIdReducer,
    userTreeApiListId: userTreeApiListIdReducer,
    Restake: RestakeReducer,
    DetailesComboList: DetailesComboListReducer,
    comboOption: ComboOptionReducer,
    CreateComboPlan: CreateComboPlanReducer,
    UpdateComboPlan: UpdateComboPlanReducer,
    ComboPlan: ComboPlanReducer,
    ComboStakePerform: ComboStakePerformReducer,
    SuperVisorList: SuperVisorListReducer,
    supervisorAdd: supervisorAddReducer,
    supervisorUpdate: supervisorUpdateReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
