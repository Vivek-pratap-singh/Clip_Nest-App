import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removeFromPaste } from "../redux/pasteSlice";
import { selectCurrentUser } from "../redux/authSlice";

function formatRelativeTime(value) {
  const timestamp = new Date(value || 0).getTime();
  if (!Number.isFinite(timestamp) || !timestamp) {
    return "just now";
  }

  const diff = Math.max(Date.now() - timestamp, 0);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${days}d ago`;
}

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
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
    toast.success("Paste deleted.");
  }

  function handleCopy(content) {
    navigator.clipboard.writeText(content || "");
    toast.success("Copied to clipboard");
  }

  function handleShare(paste) {
    const url = `${window.location.origin}/view/${paste._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  }

  return (
    <section className="paste-archive">
      <div className="paste-archive__shell">
        <div className="paste-archive__header">
          <div>
            <p className="eyebrow">Library</p>
            <h1>All Pastes</h1>
            <p className="paste-archive__subtitle">
              Explore your saved notes, jump back into editing, or share a snippet.
            </p>
          </div>

          <label className="paste-archive__search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search pastes by title or content..."
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
                    {paste.content?.slice(0, 160)}
                    {paste.content?.length > 160 ? "..." : ""}
                  </p>
                </div>

                <div className="paste-actions">
                  <Link className="paste-action paste-action--soft" to={`/?pasteId=${paste?._id}`}>
                    edit
                  </Link>
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

                <p className="paste-card__meta">
                  Created at: {new Date(paste.createdAt).toLocaleString()} · {formatRelativeTime(paste.createdAt)}
                </p>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>No pastes found.</strong>
              <span>Try a different search or create a new paste from Home.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Paste;
