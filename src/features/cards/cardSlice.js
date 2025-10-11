import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";


// Get cards by list
export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async (listId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/cards/list/${listId}`);
      return { listId, cards: res.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create card
export const createCard = createAsyncThunk(
  "cards/createCard",
  async ({ listId, title, boardId }, { rejectWithValue }) => {
    try {
      const res = await API.post("/cards", {
        title,
        list: listId,     // ✅ backend expects 'list'
        boardId,          // ✅ added for activity log & persistence
      });

      // return shape stays same (for redux)
      return { listId, card: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to create card" });
    }
  }
);



const cardSlice = createSlice({
  name: "cards",
  initialState: { cardsByList: {}, loading: false, error: null },
  reducers: {
    addCard: (state, action) => {
      const { listId, card } = action.payload;
      if (!state.cardsByList[listId]) state.cardsByList[listId] = [];

      // ✅ Prevent duplicate cards (same _id)
      const exists = state.cardsByList[listId].some((c) => c._id === card._id);
      if (!exists) state.cardsByList[listId].push(card);
    },
    setCardsForList: (state, action) => {
      const { listId, cards } = action.payload;
      state.cardsByList[listId] = cards;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (s, a) => {
        s.cardsByList[a.payload.listId] = a.payload.cards;
      })
      .addCase(createCard.fulfilled, (s, a) => {
        const { listId, card } = a.payload;
        if (!s.cardsByList[listId]) s.cardsByList[listId] = [];

        // ✅ Prevent duplicate when socket + thunk both fire
        const exists = s.cardsByList[listId].some((c) => c._id === card._id);
        if (!exists) s.cardsByList[listId].push(card);

        toast.success("✅ Card added successfully!");
      })
      .addCase(createCard.rejected, (s, a) => {
        toast.error(a.payload?.message || "❌ Failed to add card");
      });
  },
});

export const { addCard, setCardsForList } = cardSlice.actions;
export default cardSlice.reducer;
