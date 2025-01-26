import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useLogin } from '../../hooks/useLogin';

const initialState = {
    username: null,
    token: null,
    status: 'failed',
    error: null,
    Auth: 'false'
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
    const { login } = useLogin();
    try {
        const result = await login(email, password);
        console.log(result.data);
        if (result.success) {
            return result.data;
        } else {
            return rejectWithValue(result.errorData);
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.username = null;
            state.token = null;
            state.Auth = 'false';
            localStorage.removeItem('token');
        },
        clearAuthErrors(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.username = action.payload.username;
                state.Auth = 'true';
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.Auth = 'false';
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { logout, clearAuthErrors } = authSlice.actions;

export default authSlice.reducer;

