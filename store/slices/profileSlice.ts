// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { fetchUserProfile, updateUserProfile } from './profileAPI';

// // Interface for the UserProfile type
// interface UserProfile {
//   first_name: string;
//   last_name: string;
//   dob: string;
//   email: string;
//   mobile: string;
// }

// interface ProfileState {
//   userprofile: UserProfile | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: ProfileState = {
//   userprofile: null,
//   isLoading: false,
//   error: null,
// };

// const profileSlice = createSlice({
//   name: 'profile',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Handle fetch user profile actions
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
//         state.isLoading = false;
//         state.userprofile = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       // Handle update user profile actions
//       .addCase(updateUserProfile.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
//         state.isLoading = false;
//         state.userprofile = action.payload; // Update the profile with new data
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default profileSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile, resetUserPassword } from './profileAPI';

// User profile and password states
interface UserProfile {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  mobile: string;
}

interface ProfileState {
  userprofile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialProfileState: ProfileState = {
  userprofile: null,
  isLoading: false,
  error: null,
};

interface PasswordState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialPasswordState: PasswordState = {
  isLoading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: initialProfileState, // Profile state
    password: initialPasswordState, // Password state
  },
  reducers: {
    // Optional: Reset password state
    resetPasswordState(state) {
      state.password.isLoading = false;
      state.password.error = null;
      state.password.success = false;
    },
    // Optional: Reset profile state (for clearing profile data if needed)
    resetProfileState(state) {
      state.profile.userprofile = null;
      state.profile.isLoading = false;
      state.profile.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchUserProfile.pending, (state) => {
        state.profile.isLoading = true; 
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile.isLoading = false;
        state.profile.userprofile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profile.isLoading = false; 
        state.profile.error = action.payload as string; 
      })
     
      .addCase(updateUserProfile.pending, (state) => {
        state.profile.isLoading = true; 
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile.isLoading = false; 
        state.profile.userprofile = action.payload; 
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profile.isLoading = false; 
        state.profile.error = action.payload as string;
      })
     
      .addCase(resetUserPassword.pending, (state) => {
        state.password.isLoading = true;
        state.password.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.password.isLoading = false;
        state.password.success = true;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.password.isLoading = false;
        state.password.error = action.payload as string;
      })
  },
});

export const { resetPasswordState, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
