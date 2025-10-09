import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";

// Fetch all boards for the logged-in user
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/boards");
      return res.data.boards || res.data; // handle paginated or direct response
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create a new board
export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (boardData, { rejectWithValue }) => {
    try {
      const res = await API.post("/boards", boardData);
      return res.data.board || res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addBoardMember = createAsyncThunk(
  "boards/addBoardMember",
  async ({ boardId, email }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/boards/${boardId}/members`, { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to add member" });
    }
  }
);


const boardSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch boards";
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(addBoardMember.pending, (state) => {
          state.loading = true;
        })
        .addCase(addBoardMember.fulfilled, (state, action) => {
          state.loading = false;
          toast.success(" Member invited successfully!");
        })
        .addCase(addBoardMember.rejected, (state, action) => {
          state.loading = false;
          toast.error(action.payload?.message || " Failed to invite member");
        });


  },
});

export default boardSlice.reducer;
