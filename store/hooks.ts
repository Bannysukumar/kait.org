import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
// src/hooks/storeHooks.ts

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
