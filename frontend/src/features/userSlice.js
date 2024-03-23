import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "",
    error: "",
    user: {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
    },
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {

        } catch (error) {
            return rejectWithValue(error.response.data.error.message)
        }
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.status = "",
            state.error = "",
            state.user = {
                id: "",
                name: "",
                email: "",
                picture: "",
                status: "",
                token: "",
            }
        }
    }
})

export const { logout } = userSlice.actions;

export default userSlice.reducer