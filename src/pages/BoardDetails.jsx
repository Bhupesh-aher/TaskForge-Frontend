import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLists, createList } from "../features/lists/listSlice";
import { fetchCards, createCard } from "../features/cards/cardSlice";
import { socket } from "../socket";
import { addBoardMember } from "../features/boards/boardSlice";


export default function BoardDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { lists } = useSelector((s) => s.lists);
  const { cardsByList } = useSelector((s) => s.cards);
  const [newList, setNewList] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const { loading } = useSelector((s) => s.boards);


  useEffect(() => { 
        dispatch(fetchLists(id));
        // 🔌 Connect to board room
        socket.emit("joinBoard", id);

        // Cleanup on unmount
        return () => socket.emit("leaveBoard", id); 
    }, [dispatch, id]);

    useEffect(() => {
        // 🧩 When a new list is created in this board (by any user)
        socket.on("listCreated", (newList) => {
            dispatch({ type: "lists/addList", payload: newList });
        });

        // 🧩 When a new card is created in any list
        socket.on("cardCreated", ({ listId, card }) => {
            dispatch({
            type: "cards/addCard",
            payload: { listId, card },
            });
        });

        // ✅ Clean up event listeners when component unmounts
        return () => {
            socket.off("listCreated");
            socket.off("cardCreated");
        };
        }, [dispatch]);


    const handleInvite = async (e) => {
          e.preventDefault();
          if (!inviteEmail.trim()) return;
          await dispatch(addBoardMember({ boardId: id, email: inviteEmail }));
          setInviteEmail("");
    };

      const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newList.trim()) return;
        await dispatch(createList({ boardId: id, title: newList }));
        setNewList("");
      };

      const handleCreateCard = async (listId, title) => {
        if (!title.trim()) return;
        await dispatch(createCard({ listId, title }));
      };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Board Details</h1>

      {/*  Invite Member Section —  UI */}
      <form onSubmit={handleInvite} className="flex gap-2 mb-6">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Invite member by email"
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
            disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Inviting..." : "Invite"}
        </button>
      </form>


      <div className="flex space-x-6 overflow-x-auto">
        {lists.map((list) => (
          <div key={list._id} className="bg-white shadow rounded-lg p-4 min-w-[250px]">
            <h2 className="font-semibold text-gray-700 mb-3">{list.title}</h2>
            <div className="space-y-3">
              {(cardsByList[list._id] || []).map((card) => (
                <div
                  key={card._id}
                  className="bg-gray-100 p-2 rounded text-sm shadow-sm"
                >
                  {card.title}
                </div>
              ))}
            </div>

            <AddCardForm onAdd={(title) => handleCreateCard(list._id, title)} />
          </div>
        ))}

        {/* Create List */}
        <form
          onSubmit={handleCreateList}
          className="bg-indigo-50 p-4 rounded-lg min-w-[250px]"
        >
          <input
            type="text"
            placeholder="New list title"
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3 focus:outline-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            + Add List
          </button>
        </form>
      </div>
    </div>
  );
}

function AddCardForm({ onAdd }) {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(title);
        setTitle("");
      }}
      className="mt-4"
    >
      <input
        type="text"
        placeholder="Add card..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-1 rounded text-sm focus:outline-indigo-500"
      />
    </form>
  );
}
