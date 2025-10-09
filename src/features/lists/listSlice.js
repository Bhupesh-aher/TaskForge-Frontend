import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";


// Get all lists of a board
export const fetchLists = createAsyncThunk(
  "lists/fetchLists",
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/lists/board/${boardId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create a list
export const createList = createAsyncThunk(
  "lists/createList",
  async ({ boardId, title }, { rejectWithValue }) => {
    try {
      const res = await API.post("/lists", { board: boardId, title });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const listSlice = createSlice({
  name: "lists",
  initialState: { lists: [], loading: false, error: null },
  reducers: {
    addList: (state, action) => {
      state.lists.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (s) => { s.loading = true; })
      .addCase(fetchLists.fulfilled, (s, a) => { s.loading = false; s.lists = a.payload; })
      .addCase(fetchLists.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message; })
      .addCase(createList.fulfilled, (s, a) => {
        s.lists.push(a.payload);
        toast.success(" List created successfully!");
      })
      .addCase(createList.rejected, (s, a) => {
        toast.error(a.payload?.message || " Failed to create list");
      });

  },
});

export default listSlice.reducer;
