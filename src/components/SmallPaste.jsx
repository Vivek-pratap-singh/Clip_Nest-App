import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removeFromPaste } from "../redux/pasteSlice";
import { selectCurrentUser } from "../redux/authSlice";

const SmallPaste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = pastes.filter((paste) =>
    `${paste.title || ""} ${paste.content || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  function handleDelete(pasteId) {
    if (!currentUser) {
      toast.error("Please sign in again.");
      return;
    }

    dispatch(removeFromPaste({ userEmail: currentUser.email, pasteId }));
    toast.success("Deleted");
  }

  function handleCopy(content) {
    navigator.clipboard.writeText(content || "");
    toast.success("Copied");
  }

  function handleShare(paste) {
    const url = `${window.location.origin}/view/${paste._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  }

  return (
    <section className="paste-archive paste-archive--mobile">
      <div className="paste-archive__shell">
        <div className="paste-archive__header paste-archive__header--stacked">
          <div>
            <p className="eyebrow">Library</p>
            <h1>All Pastes</h1>
          </div>

          <label className="paste-archive__search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search by title or content"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </div>

        <div className="paste-archive__list">
          {filteredData.length > 0 ? (
            filteredData.map((paste) => (
              <article key={paste._id} className="paste-card">
                <div className="paste-card__body">
                  <h3>{paste.title || "Untitled"}</h3>
                  <p>
                    {paste.content?.slice(0, 100)}
                    {paste.content?.length > 100 ? "..." : ""}
                  </p>
                </div>

                <div className="paste-actions">
                  <button
                    type="button"
                    className="paste-action paste-action--soft"
                    onClick={() => navigate(`/?pasteId=${paste._id}`)}
                  >
                    edit
                  </button>
                  <Link className="paste-action paste-action--soft" to={`/view/${paste._id}`}>
                    view
                  </Link>
                  <button
                    type="button"
                    className="paste-action paste-action--danger"
                    onClick={() => handleDelete(paste._id)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="paste-action paste-action--neutral"
                    onClick={() => handleCopy(paste.content)}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="paste-action paste-action--accent"
                    onClick={() => handleShare(paste)}
                  >
                    Share
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>No pastes found.</strong>
              <span>Add a snippet from Home to see it here.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmallPaste;
