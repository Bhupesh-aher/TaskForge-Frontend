import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard } from "../features/boards/boardSlice";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { motion } from "framer-motion";



export default function Dashboard() {
  const dispatch = useDispatch();
  const { boards, loading, error } = useSelector((state) => state.boards);
  const [newBoard, setNewBoard] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoard.trim()) return;
    await dispatch(createBoard({ title: newBoard }));
    setNewBoard("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">Your Boards</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + Create Board
          </button>
        </div>

        {loading && <p>Loading boards...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Board List */}
        {/* Board List */}
<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
  {loading ? (
    <>
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
    </>
  ) : boards.length === 0 ? (
    <div className="col-span-full text-center text-gray-500 py-12">
      <p className="text-lg font-medium">You don’t have any boards yet 😅</p>
      <p className="text-sm text-gray-400 mt-1">Create one to get started.</p>
    </div>
  ) : (
    boards.map((board) => (
          <Link key={board._id} to={`/board/${board._id}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-md rounded-lg p-5 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-700">
                {board.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Members: {board.members?.length || 1}
              </p>
            </motion.div>
          </Link>
        ))
      )}
      </div>
    </div>

      {/* Modal for Creating Board */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4 text-indigo-600">New Board</h3>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                placeholder="Board title"
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
                className="w-full border px-3 py-2 rounded-md mb-4 focus:outline-indigo-500"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
