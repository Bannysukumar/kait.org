// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState, useAppSelector } from '../../../../store/store'
// import {
//   submitKyc,
//   suggestUsername,
//   verifyUsername,
//   verifyKYCStatus,
// } from '../../../../store/slices/index'
// import { Upload, X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import toast from 'react-hot-toast'
// import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

// export default function KycVerification() {
//   const dispatch = useDispatch<AppDispatch>()
//   const { isLoading, error, kycVerified, kycRejected, kycPending } =
//     useSelector((state: RootState) => state.auth)

//   const [usernameAvailability, setUsernameAvailability] = useState<
//     string | null
//   >(null)
//   const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
//   const [kycStatus, setKycStatus] = useState<string | null>(null)

//   useEffect(() => {
//     dispatch(verifyKYCStatus())
//     dispatch(fetchDropdownOptions())
//   }, [dispatch])

//   useEffect(() => {
//     if (kycRejected) {
//       setKycStatus(
//         'Your KYC application has been rejected. Please resubmit with valid documents.',
//       )
//     } else if (kycVerified && !kycRejected && !kycPending) {
//       setKycStatus('Your identity has already been verified. Thank you!')
//     } else if (kycPending) {
//       setKycStatus(
//         'KYC Application is waiting for review. Please wait for confirmation.',
//       )
//     } else {
//       setKycStatus(null)
//     }
//   }, [kycVerified, kycRejected, kycPending])

//   const {
//     data: dropDownOptions,
//     loading: loadingOptions,
//     error: optionsError,
//   } = useAppSelector((state: RootState) => state.dropDownOptions)

//   const isKycPendingOrSubmitted =
//     kycVerified || /pending|waiting for review/i.test(kycStatus ?? '')

//   const genders = [
//     { id: 'male', label: 'Male' },
//     { id: 'female', label: 'Female' },
//   ]

//   const documentTypes = [
//     { id: 'passport', name: 'Passport' },
//     { id: 'badge', name: 'Badge' },
//     { id: 'licence', name: 'Licence' },
//   ]

//   const [formData, setFormData] = useState({
//     username: '',
//     alternate_mobile: '',
//     gender: '',
//     country: '',
//     state: '',
//     city: '',
//     postal_code: '',
//     address_line_1: '',
//     address_line_2: '',
//     document_type: '',
//     document_one: null as File | null,
//     document_two: null as File | null,
//     document_photo: null as File | null,
//   })

//   const handleSuggestUsername = async () => {
//     try {
//       const result = await dispatch(suggestUsername())
//       if (suggestUsername.fulfilled.match(result)) {
//         setSuggestedUsernames(result.payload || [])
//       } else {
//         console.error('Suggestion failed:', result)
//       }
//     } catch (err) {
//       console.error('Error suggesting username:', err)
//     }
//   }

//   useEffect(() => {
//     handleSuggestUsername()
//   }, [])

//   const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setFormData({ ...formData, username: value })

//     if (!value || value.length < 3) {
//       setUsernameAvailability(null)
//       return
//     }

//     dispatch(verifyUsername(value))
//       .then((res) => {
//         const msg = res.payload?.toLowerCase()
//         if (msg?.includes('available') || msg?.includes('avaliable')) {
//           setUsernameAvailability('✅ Username is available!')
//         } else {
//           setUsernameAvailability('❌ Username is taken')
//         }
//       })
//       .catch(() => setUsernameAvailability('❌ Username is taken'))
//   }

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => setFormData({ ...formData, [e.target.id]: e.target.value })

//   const handleSelectChange = (field: keyof typeof formData, value: string) =>
//     setFormData({ ...formData, [field]: value })

//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: string,
//   ) => {
//     if (e.target.files?.length) {
//       setFormData({ ...formData, [field]: e.target.files[0] });
//     }
//   };

//   const handleRemoveFile = (field: string) => {
//     setFormData({ ...formData, [field]: null });
//   };


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const required: (keyof typeof formData)[] = [
//       'username',
//       'country',
//       'state',
//       'city',
//       'postal_code',
//       'gender',
//       'address_line_1',
//       'document_type',
//       'document_one',
//       'document_photo',
//     ]

//     const labels: Record<string, string> = {
//       username: 'Username',
//       country: 'Country',
//       state: 'State',
//       city: 'City',
//       postal_code: 'Postal Code',
//       gender: 'Gender',
//       address_line_1: 'Address Line 1',
//       document_type: 'Document Type',
//       document_one: 'Front Document',
//       document_photo: 'Document Photo',
//     }

//     for (const field of required) {
//       const val = formData[field]
//       if (!val || (typeof val === 'string' && val.trim() === '')) {
//         const el = document.getElementById(field)
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth', block: 'center' })
//             ; (el as HTMLElement).focus()
//         }
//         toast.error(`Missing: ${labels[field] || field}`)
//         return
//       }
//     }

//     const payload = new FormData()
//     Object.entries(formData).forEach(([k, v]) => {
//       if (v) payload.append(k, v as Blob | string)
//     })

//     const toastId = toast.loading('Submitting KYC...')
//     dispatch(submitKyc({ formData: payload }))
//       .then((response: any) => {
//         toast.dismiss(toastId);

//         // --- CHECK IF REJECTED ---
//         if (submitKyc.rejected.match(response)) {
//           const payload = response.payload as any;
//           const errorMsg =
//             typeof payload === 'string'
//               ? payload
//               : payload?.detail ||
//               payload?.message ||
//               "Failed to submit KYC";

//           toast.error(errorMsg);
//           return;
//         }


//         // --- SUCCESS HANDLING ---
//         const detail =
//           response.payload?.detail?.toLowerCase?.() ||
//           response.payload?.message?.toLowerCase?.();

//         if (detail?.includes("waiting for review")) {
//           setKycStatus("Your KYC Application is waiting for review");
//           toast.success("KYC submitted successfully!");

//         } else if (detail?.includes("rejected")) {
//           setKycStatus("Your KYC application was rejected.");
//           toast.error("KYC was rejected. Please try again.");

//         } else {
//           setKycStatus("KYC submitted successfully. Please wait for review.");
//           toast.success("KYC submitted!");
//         }

//         dispatch(verifyKYCStatus());

//       })
//       .catch(() => {
//         toast.dismiss(toastId);
//         toast.error("Something went wrong during submission.");
//       });


//   }

//   if (isKycPendingOrSubmitted) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
//         <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//             KYC Application Status
//           </h2>
//           <p className="text-gray-700 text-lg">{kycStatus}</p>
//         </div>
//       </div>
//     )
//   }
//   return (
//     <div className="max-w-4xl mx-auto my-12 bg-white rounded-xl shadow-lg p-8">
//       <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
//         KYC Verification
//       </h1>

//       {error && (
//         <Alert className="bg-red-50 text-red-700 mb-6 rounded-lg shadow-sm">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {kycStatus && (
//         <p className="text-center text-sm text-red-600 mb-6 font-medium">
//           {kycStatus}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             // ['username', 'username*'],

//             // ['first_name', 'First Name *'],
//             // ['last_name', 'Last Name *'],
//             // ['dob', 'Date of Birth *', 'date'],
//             // ['mobile', 'Mobile *'],
//             ['alternate_mobile', 'Alternate Mobile'],
//             ['country', 'Country *'],
//             ['state', 'State *'],
//             ['city', 'City *'],
//             ['postal_code', 'Postal Code *'],
//           ].map(([id, label, type = 'text']) => (
//             <div key={id} className="flex flex-col">
//               <Label htmlFor={id} className="font-semibold text-gray-700 mb-1">
//                 {label}
//               </Label>
//               <Input
//                 id={id}
//                 type={type}
//                 onChange={handleInputChange}
//                 required={label.includes('*')}
//                 className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//               />
//             </div>
//           ))}

//           <div className="flex flex-col">
//             <Label
//               htmlFor="gender"
//               className="font-semibold text-gray-700 mb-1"
//             >
//               Gender *
//             </Label>
//             <Select onValueChange={(val) => handleSelectChange('gender', val)}>
//               <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
//                 <SelectValue placeholder="Select gender" />
//               </SelectTrigger>
//               <SelectContent className="bg-white shadow-md">
//                 {dropDownOptions?.genders?.map((type) => (
//                   <SelectItem key={type.id} value={type.id}>
//                     {type.value}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex flex-col">
//             <Label
//               htmlFor="username"
//               className="font-semibold text-gray-700 mb-1"
//             >
//               Username *
//             </Label>
//             <Input
//               id="username"
//               value={formData.username}
//               onChange={handleUsernameChange}
//               required
//               className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//             />
//             {usernameAvailability && (
//               <p
//                 className={`mt-1 text-sm font-medium ${usernameAvailability.includes('✅')
//                   ? 'text-green-600'
//                   : 'text-red-600'
//                   }`}
//               >
//                 {usernameAvailability}
//               </p>
//             )}
//             {suggestedUsernames.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {suggestedUsernames.map((username, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     onClick={() => setFormData({ ...formData, username })}
//                   >
//                     {username}
//                   </button>
//                 ))}

//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col space-y-4">
//           <div className="flex flex-col">
//             <Label
//               htmlFor="address_line_1"
//               className="font-semibold text-gray-700 mb-1"
//             >
//               Address Line 1 *
//             </Label>
//             <Textarea
//               id="address_line_1"
//               onChange={handleInputChange}
//               required
//               rows={3}
//               className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//           <div className="flex flex-col">
//             <Label
//               htmlFor="address_line_2"
//               className="font-semibold text-gray-700 mb-1"
//             >
//               Address Line 2
//             </Label>
//             <Textarea
//               id="address_line_2"
//               onChange={handleInputChange}
//               rows={3}
//               className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col mb-6">
//           <Label
//             htmlFor="document_type"
//             className="font-semibold text-gray-700 mb-1"
//           >
//             Document Type *
//           </Label>
//           <Select
//             onValueChange={(val) => handleSelectChange('document_type', val)}
//           >
//             <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
//               <SelectValue placeholder="Select document type" />
//             </SelectTrigger>
//             <SelectContent className="bg-white shadow-md">
//               {dropDownOptions?.kyc_doc_types?.map((type) => (
//                 <SelectItem key={type.id} value={type.id}>
//                   {type.value}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {[
//             ['document_one', 'Front Document *'],
//             ['document_two', 'Back Document'],
//             ['document_photo', 'Your Photo Holding Document *'],
//           ].map(([id, label]) => (
//             <FileUpload
//               key={id}
//               id={id}
//               label={label}
//               file={formData[id as keyof typeof formData] as File | null}
//               onFileChange={handleFileChange}
//               onRemove={handleRemoveFile}
//             />
//           ))}
//         </div>

//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Submitting...' : 'Submit KYC'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }

// function FileUpload({
//   id,
//   label,
//   file,
//   onFileChange,
//   onRemove,
// }: {
//   id: string
//   label: string
//   file: File | null
//   onFileChange: (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: string,
//   ) => void
//   onRemove: (field: string) => void
// }) {
//   return (
//     <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition relative">
//       <Label
//         htmlFor={id}
//         className="absolute top-2 left-3 font-semibold text-gray-700 select-none"
//       >
//         {label}
//       </Label>

//       <input
//         type="file"
//         id={id}
//         onChange={(e) => onFileChange(e, id)}
//         className="opacity-0 absolute inset-0 cursor-pointer"
//         accept="image/*,application/pdf"
//       />

//       {!file ? (
//         <div className="flex flex-col items-center justify-center gap-2 pt-10 pb-6 text-gray-400">
//           <Upload size={32} />
//           <p className="text-sm">Click to upload</p>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center gap-3 pt-12 pb-6 w-full">
//           <p className="text-sm font-medium truncate max-w-full text-gray-900">
//             {file.name}
//           </p>
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation()
//               onRemove(id)
//             }}
//             className="mt-1"
//           >
//             <X size={16} />
//             Remove
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, useAppSelector } from '../../../../store/store'
import {
  submitKyc,
  suggestUsername,
  verifyUsername,
  verifyKYCStatus,
} from '../../../../store/slices/index'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

export default function KycVerification() {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error, kycVerified, kycRejected, kycPending } =
    useSelector((state: RootState) => state.auth)

  const [usernameAvailability, setUsernameAvailability] = useState<
    string | null
  >(null)
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
  const [kycStatus, setKycStatus] = useState<string | null>(null)

  useEffect(() => {
    dispatch(verifyKYCStatus())
    dispatch(fetchDropdownOptions())
  }, [dispatch])

  useEffect(() => {
    if (kycRejected) {
      setKycStatus(
        'Your KYC application has been rejected. Please resubmit with valid documents.',
      )
    } else if (kycVerified && !kycRejected && !kycPending) {
      setKycStatus('Your identity has already been verified. Thank you!')
    } else if (kycPending) {
      setKycStatus(
        'KYC Application is waiting for review. Please wait for confirmation.',
      )
    } else {
      setKycStatus(null)
    }
  }, [kycVerified, kycRejected, kycPending])

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const isKycPendingOrSubmitted =
    kycVerified || /pending|waiting for review/i.test(kycStatus ?? '')

  const genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
  ]

  const documentTypes = [
    { id: 'passport', name: 'Passport' },
    { id: 'badge', name: 'Badge' },
    { id: 'licence', name: 'Licence' },
  ]

  const [formData, setFormData] = useState({
    username: '',
    alternate_mobile: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    postal_code: '',
    address_line_1: '',
    address_line_2: '',
    document_type: '',
    document_one: null as File | null,
    document_two: null as File | null,
    document_photo: null as File | null,
  })

  const handleSuggestUsername = async () => {
    try {
      const result = await dispatch(suggestUsername())
      if (suggestUsername.fulfilled.match(result)) {
        setSuggestedUsernames(result.payload || [])
      } else {
        console.error('Suggestion failed:', result)
      }
    } catch (err) {
      console.error('Error suggesting username:', err)
    }
  }

  useEffect(() => {
    handleSuggestUsername()
  }, [])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, username: value })

    if (!value || value.length < 3) {
      setUsernameAvailability(null)
      return
    }

    dispatch(verifyUsername(value))
      .then((res) => {
        const msg = res.payload?.toLowerCase()
        if (msg?.includes('available') || msg?.includes('avaliable')) {
          setUsernameAvailability('✅ Username is available!')
        } else {
          setUsernameAvailability('❌ Username is taken')
        }
      })
      .catch(() => setUsernameAvailability('❌ Username is taken'))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.id]: e.target.value })

  const handleSelectChange = (field: keyof typeof formData, value: string) =>
    setFormData({ ...formData, [field]: value })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleRemoveFile = (field: string) => {
    setFormData({ ...formData, [field]: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const required: (keyof typeof formData)[] = [
      'username',
      'country',
      'state',
      'city',
      'postal_code',
      'gender',
      'address_line_1',
      'document_type',
      'document_one',
      'document_photo',
    ]

    const labels: Record<string, string> = {
      username: 'Username',
      country: 'Country',
      state: 'State',
      city: 'City',
      postal_code: 'Postal Code',
      gender: 'Gender',
      address_line_1: 'Address Line 1',
      document_type: 'Document Type',
      document_one: 'Front Document',
      document_photo: 'Document Photo',
    }

    for (const field of required) {
      const val = formData[field]
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        const el = document.getElementById(field)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            ; (el as HTMLElement).focus()
        }
        toast.error(`Missing: ${labels[field] || field}`)
        return
      }
    }

    const payload = new FormData()
    Object.entries(formData).forEach(([k, v]) => {
      if (v) payload.append(k, v as Blob | string)
    })

    const toastId = toast.loading('Submitting KYC...')
    dispatch(submitKyc({ formData: payload }))
      .then((response: any) => {
        toast.dismiss(toastId)

        // Handle error from rejected thunk
        if (response.error) {
          const errorMsg =
            typeof response.payload === 'string'
              ? response.payload
              : response.payload?.detail || 'Failed to submit KYC';
          toast.error(errorMsg);
          return;
        }

        const detail =
          response.payload?.detail?.toLowerCase?.() ||
          response.payload?.message?.toLowerCase?.();

        if (detail?.includes('waiting for review')) {
          setKycStatus('Your KYC Application is waiting for review');
          toast.success('KYC submitted successfully!');
        } else if (detail?.includes('rejected')) {
          setKycStatus('Your KYC application was rejected.');
          toast.error('KYC was rejected. Please try again.');
        } else if (response.meta?.requestStatus === 'fulfilled') {
          setKycStatus('KYC submitted successfully. Please wait for review.');
          toast.success('KYC submitted!');
        } else {
          toast.error(
            response.payload?.detail ||
            response.payload?.message ||
            'Submission failed. Please check your details and try again.'
          );
        }
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error('Something went wrong during submission.');
      });

  }

  if (isKycPendingOrSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            KYC Application Status
          </h2>
          <p className="text-gray-700 text-lg">{kycStatus}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto my-12 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        KYC Verification
      </h1>

      {error && (
        <Alert className="bg-red-50 text-red-700 mb-6 rounded-lg shadow-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {kycStatus && (
        <p className="text-center text-sm text-red-600 mb-6 font-medium">
          {kycStatus}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            // ['username', 'username*'],

            // ['first_name', 'First Name *'],
            // ['last_name', 'Last Name *'],
            // ['dob', 'Date of Birth *', 'date'],
            // ['mobile', 'Mobile *'],
            ['alternate_mobile', 'Alternate Mobile'],
            ['country', 'Country *'],
            ['state', 'State *'],
            ['city', 'City *'],
            ['postal_code', 'Postal Code *'],
          ].map(([id, label, type = 'text']) => (
            <div key={id} className="flex flex-col">
              <Label htmlFor={id} className="font-semibold text-gray-700 mb-1">
                {label}
              </Label>
              <Input
                id={id}
                type={type}
                onChange={handleInputChange}
                required={label.includes('*')}
                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <Label
              htmlFor="gender"
              className="font-semibold text-gray-700 mb-1"
            >
              Gender *
            </Label>
            <Select onValueChange={(val) => handleSelectChange('gender', val)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md">
                {dropDownOptions?.genders?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label
              htmlFor="username"
              className="font-semibold text-gray-700 mb-1"
            >
              Username *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleUsernameChange}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {usernameAvailability && (
              <p
                className={`mt-1 text-sm font-medium ${usernameAvailability.includes('✅')
                  ? 'text-green-600'
                  : 'text-red-600'
                  }`}
              >
                {usernameAvailability}
              </p>
            )}
            {suggestedUsernames.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedUsernames.map((username, index) => (
                  <button
                    key={index}
                    type="button"
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setFormData({ ...formData, username })}
                  >
                    {username}
                  </button>
                ))}

              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <Label
              htmlFor="address_line_1"
              className="font-semibold text-gray-700 mb-1"
            >
              Address Line 1 *
            </Label>
            <Textarea
              id="address_line_1"
              onChange={handleInputChange}
              required
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="address_line_2"
              className="font-semibold text-gray-700 mb-1"
            >
              Address Line 2
            </Label>
            <Textarea
              id="address_line_2"
              onChange={handleInputChange}
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex flex-col mb-6">
          <Label
            htmlFor="document_type"
            className="font-semibold text-gray-700 mb-1"
          >
            Document Type *
          </Label>
          <Select
            onValueChange={(val) => handleSelectChange('document_type', val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md">
              {dropDownOptions?.kyc_doc_types?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['document_one', 'Front Document *'],
            ['document_two', 'Back Document'],
            ['document_photo', 'Your Photo Holding Document *'],
          ].map(([id, label]) => (
            <FileUpload
              key={id}
              id={id}
              label={label}
              file={formData[id as keyof typeof formData] as File | null}
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit KYC'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function FileUpload({
  id,
  label,
  file,
  onFileChange,
  onRemove,
}: {
  id: string
  label: string
  file: File | null
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => void
  onRemove: (field: string) => void
}) {
  return (
    <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition relative">
      <Label
        htmlFor={id}
        className="absolute top-2 left-3 font-semibold text-gray-700 select-none"
      >
        {label}
      </Label>

      <input
        type="file"
        id={id}
        onChange={(e) => onFileChange(e, id)}
        className="opacity-0 absolute inset-0 cursor-pointer"
        accept="image/*,application/pdf"
      />

      {!file ? (
        <div className="flex flex-col items-center justify-center gap-2 pt-10 pb-6 text-gray-400">
          <Upload size={32} />
          <p className="text-sm">Click to upload</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 pt-12 pb-6 w-full">
          <p className="text-sm font-medium truncate max-w-full text-gray-900">
            {file.name}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(id)
            }}
            className="mt-1"
          >
            <X size={16} />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}
