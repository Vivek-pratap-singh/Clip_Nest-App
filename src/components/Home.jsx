import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, removeFromPaste, updateToPastes } from "../redux/pasteSlice";
import { selectCurrentUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import home from "../images/home.png";

function toTimestamp(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function formatRelativeTime(value) {
  const timestamp = toTimestamp(value);

  if (!timestamp) {
    return "just now";
  }

  const diff = Math.max(Date.now() - timestamp, 0);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds || 1}s ago`;
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${days}d ago`;
}

function formatLongDate(value) {
  const timestamp = toTimestamp(value);

  if (!timestamp) {
    return "No timestamp";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector(selectCurrentUser);

  const sortedPastes = [...allPastes].sort(
    (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
  );

  const selectedPaste = sortedPastes.find((item) => item._id === pasteId);
  const filteredRecentPastes = sortedPastes.filter((paste) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return (
      (paste.title || "").toLowerCase().includes(term) ||
      (paste.content || "").toLowerCase().includes(term)
    );
  });

  const snippetCount = allPastes.length;
  const totalCharacters = allPastes.reduce(
    (sum, paste) => sum + (paste.content?.length || 0),
    0,
  );
  const latestPaste = sortedPastes[0];

  useEffect(() => {
    if (!pasteId) {
      setTitle("");
      setValue("");
      return;
    }

    setTitle(selectedPaste?.title || "");
    setValue(selectedPaste?.content || "");
  }, [pasteId, selectedPaste]);

  function clearEditor() {
    setTitle("");
    setValue("");
    setSearchParams({});
  }

  function copyCurrentContent() {
    if (!value) {
      toast.error("Nothing to copy yet.");
      return;
    }

    navigator.clipboard.writeText(value);
    toast.success("Paste copied to clipboard.");
  }

  function openCurrentPaste() {
    if (!pasteId) {
      toast.error("Pick a saved paste first.");
      return;
    }

    navigate(`/view/${pasteId}`);
  }

  function createPaste() {
    if (!currentUser) {
      toast.error("Please sign in again.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedValue = value.trim();

    if (!trimmedTitle && !trimmedValue) {
      toast.error("Add a title or content before saving.");
      return;
    }

    const existingPaste = pasteId
      ? sortedPastes.find((item) => item._id === pasteId)
      : null;

    const paste = {
      title: trimmedTitle || "Untitled",
      content: value,
      _id: pasteId || Date.now().toString(36),
      createdAt: existingPaste?.createdAt || new Date().toISOString(),
      ownerEmail: currentUser.email,
    };

    if (pasteId) {
      dispatch(updateToPastes({ userEmail: currentUser.email, paste }));
    } else {
      dispatch(addToPastes({ userEmail: currentUser.email, paste }));
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  }

  function copyPasteContent(content) {
    navigator.clipboard.writeText(content || "");
    toast.success("Copied.");
  }

  function copyShareLink(paste) {
    const shareUrl = `${window.location.origin}/view/${paste._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied.");
  }

  function removePaste(pasteIdToDelete) {
    if (!currentUser) {
      toast.error("Please sign in again.");
      return;
    }

    dispatch(removeFromPaste({ userEmail: currentUser.email, pasteId: pasteIdToDelete }));

    if (pasteId === pasteIdToDelete) {
      setTitle("");
      setValue("");
      setSearchParams({});
    }

    toast.success("Paste deleted.");
  }

  const quickStats = [
    {
      label: "Snippet Count",
      value: snippetCount,
      note: pasteId ? "Editing one now" : "No active draft",
    },
    {
      label: "Storage Used",
      value: `${totalCharacters > 0 ? Math.ceil(totalCharacters / 1024) : 0}KB`,
      note: "Saved in localStorage",
    },
    {
      label: "Sync Status",
      value: "All Local",
      note: latestPaste ? `Latest: ${formatRelativeTime(latestPaste.createdAt)}` : "Nothing saved yet",
    },
  ];

  return (
    <div className="home-page">
      <div className="home-page__orb home-page__orb--one" />
      <div className="home-page__orb home-page__orb--two" />

      <section className="home-shell">
        <header className="home-hero">
          <div className="home-hero__copy">
            <p className="eyebrow">Home</p>
            <div className="home-hero__title-row">
              <h1>Clip Nest dashboard</h1>
              <img src={home} alt="" className="home-hero__icon" />
            </div>
            <p className="home-hero__subtitle">
              {currentUser
                ? `Signed in as ${currentUser.name}`
                : "Your drafts stay in this browser only."}
            </p>
          </div>

          <div className="home-stats">
            {quickStats.map((stat) => (
              <article key={stat.label} className="home-stat">
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
                <span>{stat.note}</span>
              </article>
            ))}
          </div>
        </header>

        <div className="home-grid">
          <aside className="recent-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Library</p>
                <h2>Recent Pastes</h2>
              </div>

              <button
                type="button"
                className="panel-head__button"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            </div>

            <label className="panel-search">
              <span>Search</span>
              <input
                type="search"
                placeholder="Search by title or content"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="recent-list">
              {filteredRecentPastes.length > 0 ? (
                filteredRecentPastes.map((paste) => {
                  const isActive = paste._id === pasteId;

                  return (
                    <article
                      key={paste._id}
                      className={`recent-card ${isActive ? "recent-card--active" : ""}`}
                    >
                      <div className="recent-card__header">
                        <div>
                          <h3>{paste.title || "Untitled"}</h3>
                          <p>
                            {(paste.content || "").slice(0, 110)}
                            {(paste.content || "").length > 110 ? "..." : ""}
                          </p>
                        </div>
                        <span>{formatRelativeTime(paste.createdAt)}</span>
                      </div>

                      <div className="paste-actions">
                        <Link
                          className="paste-action paste-action--soft"
                          to={`/?pasteId=${paste._id}`}
                        >
                          edit
                        </Link>
                        <Link
                          className="paste-action paste-action--soft"
                          to={`/view/${paste._id}`}
                        >
                          view
                        </Link>
                        <button
                          type="button"
                          className="paste-action paste-action--danger"
                          onClick={() => removePaste(paste._id)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="paste-action paste-action--neutral"
                          onClick={() => copyPasteContent(paste.content)}
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          className="paste-action paste-action--accent"
                          onClick={() => copyShareLink(paste)}
                        >
                          Share
                        </button>
                      </div>

                      <p className="recent-card__meta">
                        Created at: {formatLongDate(paste.createdAt)}
                      </p>
                    </article>
                  );
                })
              ) : (
                <div className="empty-state">
                  <strong>No pastes found.</strong>
                  <span>Try a different search or create a fresh snippet.</span>
                </div>
              )}
            </div>
          </aside>

          <section className="editor-panel">
            <div className="panel-head panel-head--stacked">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>{pasteId ? "Update Paste" : "Create New Paste"}</h2>
              </div>
              <div className="editor-badge">
                {pasteId ? "Editing a saved snippet" : "New draft"}
              </div>
            </div>

            <p className="editor-intro">
              Pick a snippet from the left to continue editing, or start a new one from here.
            </p>

            <div className="editor-form">
              <label className="editor-field">
                <span>Title</span>
                <input
                  type="text"
                  value={title}
                  placeholder="Enter a title, like My Regex Collection"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>Content</span>
                <textarea
                  value={value}
                  placeholder="Write your snippet, note, or draft here..."
                  onChange={(event) => setValue(event.target.value)}
                  rows={18}
                />
              </label>

              <div className="editor-actions">
                <button
                  type="button"
                  className="editor-button editor-button--primary"
                  onClick={createPaste}
                >
                  {pasteId ? "Update Paste" : "Create New Paste"}
                </button>
                <button
                  type="button"
                  className="editor-button"
                  onClick={clearEditor}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="editor-button"
                  onClick={copyCurrentContent}
                >
                  Copy Content
                </button>
                <button
                  type="button"
                  className="editor-button"
                  onClick={openCurrentPaste}
                  disabled={!pasteId}
                >
                  View Current
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Home;
