import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaCodeBranch,
  FaGitAlt,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBug,
  FaPlus,
  FaArrowUp,
  FaPaintBrush,
  FaBook,
  FaWrench,
  FaExclamationTriangle,
  FaSyncAlt,
  FaSpinner,
} from "react-icons/fa";

// --- STYLING LOGIC (Unchanged) ---
const COLORS = {
  blue: { text: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
  red: { text: "text-red-500", bg: "bg-red-100", border: "border-red-200" },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },
  gray: { text: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" },
};

const getHashColor = (sha) => {
  if (!sha) return COLORS.blue;
  const charCode = sha.charCodeAt(sha.length - 1);
  const colorKeys = ["blue", "red", "yellow", "green"];
  return COLORS[colorKeys[charCode % 4]];
};

const getCommitStyle = (message, sha) => {
  const lowerMsg = message?.toLowerCase() || "";
  if (lowerMsg.includes("merge"))
    return { ...COLORS.purple, icon: <FaCodeBranch /> };
  if (
    lowerMsg.includes("fix") ||
    lowerMsg.includes("bug") ||
    lowerMsg.includes("issue") ||
    lowerMsg.includes("error") ||
    lowerMsg.includes("resolve")
  )
    return { ...COLORS.red, icon: <FaBug /> };
  if (
    lowerMsg.includes("add") ||
    lowerMsg.includes("create") ||
    lowerMsg.includes("feat") ||
    lowerMsg.includes("new") ||
    lowerMsg.includes("init")
  )
    return { ...COLORS.green, icon: <FaPlus /> };
  if (
    lowerMsg.includes("update") ||
    lowerMsg.includes("change") ||
    lowerMsg.includes("refactor") ||
    lowerMsg.includes("remove") ||
    lowerMsg.includes("chore")
  )
    return { ...COLORS.yellow, icon: <FaArrowUp /> };
  if (
    lowerMsg.includes("style") ||
    lowerMsg.includes("design") ||
    lowerMsg.includes("css") ||
    lowerMsg.includes("ui") ||
    lowerMsg.includes("color")
  )
    return { ...COLORS.blue, icon: <FaPaintBrush /> };
  if (lowerMsg.includes("doc") || lowerMsg.includes("readme"))
    return { ...COLORS.gray, icon: <FaBook /> };
  if (
    lowerMsg.includes("config") ||
    lowerMsg.includes("setup") ||
    lowerMsg.includes("build") ||
    lowerMsg.includes("deploy")
  )
    return { ...COLORS.gray, icon: <FaWrench /> };
  const fallbackColor = getHashColor(sha);
  return { ...fallbackColor, icon: <FaGitAlt /> };
};

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ContributionPath = () => {
  const [allCommits, setAllCommits] = useState([]);
  const [displayedCommits, setDisplayedCommits] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreApiData, setHasMoreApiData] = useState(true);

  // CONFIGURATION
  const REPO_OWNER = "GDG-QU";
  const REPO_NAME = "GDG-QU-Website";
  const FETCH_BATCH_SIZE = 30;
  const DISPLAY_PER_PAGE = 6;
  const CACHE_DURATION = 3600000; // 1 Hour
  const CACHE_KEY = "gdg_commits_v3_deduped";

  // --- 1. INITIAL LOAD (Load Cache OR Fetch Batch 1) ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);
      const now = Date.now();

      // Check Cache Validity
      if (
        cachedData &&
        cachedTime &&
        now - parseInt(cachedTime) < CACHE_DURATION
      ) {
        const parsedData = JSON.parse(cachedData);
        setAllCommits(parsedData);
        setIsLoading(false);
        return;
      }

      // No valid cache? Fetch the very first batch
      await fetchNextBatch(0); // 0 existing items, so fetch Page 1
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // --- 2. SMART FETCH FUNCTION ---
  // Calculates which API page to fetch based on how many items we ALREADY have.
  const fetchNextBatch = async (currentLength) => {
    try {
      // Logic: If we have 30 items, we need API Page 2. If 60, API Page 3.
      // Math: (30 / 30) + 1 = 2.
      const apiPageToFetch = Math.floor(currentLength / FETCH_BATCH_SIZE) + 1;

      console.log(
        `Fetching API Page ${apiPageToFetch} because we have ${currentLength} items.`
      );

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${FETCH_BATCH_SIZE}&page=${apiPageToFetch}`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? "GitHub Rate Limit Reached"
            : "Failed to load"
        );
      }

      const newData = await response.json();

      if (newData.length < FETCH_BATCH_SIZE) {
        setHasMoreApiData(false);
      }

      setAllCommits((prevCommits) => {
        // --- CRITICAL FIX: DEDUPLICATION ---
        // Create a Set of existing SHAs for O(1) lookup
        const existingShas = new Set(prevCommits.map((c) => c.sha));

        // Only keep new items that DON'T exist in current state
        const uniqueNewData = newData.filter(
          (item) => !existingShas.has(item.sha)
        );

        if (uniqueNewData.length === 0) {
          console.log("All fetched items were duplicates. Stopping fetch.");
          return prevCommits;
        }

        const updatedList = [...prevCommits, ...uniqueNewData];

        // Update Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedList));
        localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());

        return updatedList;
      });

      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    }
  };

  // --- 3. NEXT PAGE HANDLER (The Trigger) ---
  const handleNextPage = async () => {
    const nextPage = currentPage + 1;

    // The index of the first item we need for the NEXT page
    const neededStartIndex = (nextPage - 1) * DISPLAY_PER_PAGE;

    // Do we have this index in our local array?
    if (neededStartIndex < allCommits.length) {
      // YES: We have data. Just move the view.
      setCurrentPage(nextPage);
    } else {
      // NO: We ran out of local data. We must fetch.
      if (!hasMoreApiData) return;

      setIsFetchingMore(true);

      // Pass the CURRENT length so the fetcher knows which API page to ask for
      const success = await fetchNextBatch(allCommits.length);

      setIsFetchingMore(false);

      if (success) {
        setCurrentPage(nextPage);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // --- 4. UPDATE DISPLAY (View Slicer) ---
  useEffect(() => {
    if (allCommits.length > 0) {
      const startIndex = (currentPage - 1) * DISPLAY_PER_PAGE;
      const endIndex = startIndex + DISPLAY_PER_PAGE;
      setDisplayedCommits(allCommits.slice(startIndex, endIndex));

      if (currentPage > 1) {
        document
          .getElementById("timeline-top")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentPage, allCommits]);

  const refreshData = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_time`);
    window.location.reload();
  };

  return (
    <section
      className="relative py-24 bg-gray-50 overflow-hidden"
      id="timeline-top"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-red-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
            <FaGithub className="text-lg" />
            <span>Live GitHub History</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500">
              Contribution
            </span>{" "}
            Path
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tracking the latest contributions. Currently viewing{" "}
            <strong>{currentPage}</strong> of locally loaded history.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative min-h-[400px]">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 md:-translate-x-1/2 z-0"></div>

          {error && allCommits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Connection Issue
              </h3>
              <p className="text-gray-600 mt-2 max-w-md">{error}</p>
              <button
                onClick={refreshData}
                className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >
                <FaSyncAlt /> Retry
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {isLoading && allCommits.length === 0
                ? Array.from({ length: DISPLAY_PER_PAGE }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row items-center gap-8 animate-pulse opacity-60"
                    >
                      <div className="hidden md:block w-1/2 h-40 bg-gray-200 rounded-2xl"></div>
                      <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 border-4 border-white"></div>
                      <div className="w-full md:w-1/2 h-40 bg-gray-200 rounded-2xl"></div>
                    </div>
                  ))
                : displayedCommits.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const style = getCommitStyle(item.commit.message, item.sha);
                    const messageParts = item.commit.message.split("\n\n");
                    const title = messageParts[0];
                    const desc =
                      messageParts.length > 1
                        ? messageParts.slice(1).join(" ")
                        : null;

                    return (
                      <div
                        key={item.sha}
                        className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 group perspective-1000`}
                      >
                        {/* LEFT SIDE */}
                        <div
                          className={`w-full md:w-1/2 pl-16 md:pl-0 md:pr-16 md:text-right ${isEven ? "md:order-1" : "md:order-3 md:hidden"}`}
                        >
                          {isEven && (
                            <div className="hidden md:block pr-4">
                              <div className="text-sm font-bold text-gray-400 mb-1 font-mono uppercase tracking-widest">
                                {formatDate(item.commit.author.date)}
                              </div>
                              <div className="flex justify-end">
                                <a
                                  href={item.html_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors font-mono"
                                >
                                  <FaCodeBranch className="text-[10px]" />
                                  {item.sha.substring(0, 7)}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CENTRAL NODE */}
                        <div className="absolute left-3 translate-y-3 sm:translate-y-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-4 border-white shadow-[0_0_0_4px_rgba(229,231,235,0.4)] z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 md:order-2">
                          <div
                            className={`w-full h-full rounded-full flex items-center justify-center text-xl md:text-2xl ${style.text} ${style.bg} bg-opacity-40`}
                          >
                            {style.icon}
                          </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div
                          className={`w-full md:w-1/2 pl-16 md:pl-16 ${isEven ? "md:order-3" : "md:order-1 md:pr-16 md:pl-0 md:text-right"}`}
                        >
                          {/* Mobile Date Header */}
                          <div className="md:hidden flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {formatDate(item.commit.author.date)}
                            </span>
                            <span className="h-px flex-1 bg-gray-200"></span>
                          </div>

                          <div
                            className={`relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 ${style.border}`}
                          >
                            <div
                              className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white/70 border-b border-l border-white/60 transform rotate-45 ${isEven ? "-left-2" : "-right-2 border-r border-t border-b-0 border-l-0"}`}
                            ></div>

                            <div
                              className={`flex items-start gap-4 overflow-hidden mb-3 ${!isEven && "md:flex-row-reverse"}`}
                            >
                              <a
                                href={item.author?.html_url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 group-hover:scale-105 transition-transform"
                              >
                                <img
                                  src={
                                    item.author?.avatar_url ||
                                    `https://ui-avatars.com/api/?name=${item.commit.author.name}&background=random`
                                  }
                                  alt="avatar"
                                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                              </a>
                              <div
                                className={`flex-1 ${!isEven && "md:text-right"}`}
                              >
                                <h4 className="font-bold text-gray-900 leading-snug text-lg line-clamp-2">
                                  {title}
                                </h4>
                                <a
                                  href={item.author?.html_url || "#"}
                                  className="text-sm text-gray-500 hover:text-blue-600 font-medium block mt-1"
                                >
                                  @
                                  {item.author?.login ||
                                    item.commit.author.name}
                                </a>
                              </div>
                            </div>

                            {desc && (
                              <div
                                className={`mt-3 text-sm text-gray-600 bg-gray-50/50 rounded-lg p-3 border border-gray-100/50 font-mono leading-relaxed ${!isEven && "md:text-right"}`}
                              >
                                {desc.substring(0, 140)}
                                {desc.length > 140 && "..."}
                              </div>
                            )}

                            {/* Mobile SHA Link */}
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between md:hidden">
                              <a
                                href={item.html_url}
                                className="flex items-center gap-1 text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded"
                              >
                                <FaCodeBranch /> {item.sha.substring(0, 7)}
                              </a>
                              <FaExternalLinkAlt className="text-gray-300 text-xs" />
                            </div>
                          </div>
                        </div>

                        {/* Desktop Odd Side */}
                        {!isEven && (
                          <div className="hidden md:block w-1/2 pl-16 order-3">
                            <div className="text-sm font-bold text-gray-400 mb-1 font-mono uppercase tracking-widest text-left">
                              {formatDate(item.commit.author.date)}
                            </div>
                            <div className="flex justify-start">
                              <a
                                href={item.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors font-mono"
                              >
                                <FaCodeBranch className="text-[10px]" />
                                {item.sha.substring(0, 7)}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>
          )}
        </div>

        {/* --- Pagination --- */}
        {!error && allCommits.length > 0 && (
          <div className="mt-20 flex justify-center items-center gap-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isFetchingMore}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:text-blue-600 border border-gray-100"
              }`}
            >
              <FaChevronLeft className="text-xs" /> Newer
            </button>

            <div className="flex flex-col items-center min-w-[100px]">
              {isFetchingMore ? (
                <span className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
                  <FaSpinner className="animate-spin" /> Loading...
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Page
                  </span>
                  <span className="text-xl font-black text-gray-900">
                    {currentPage}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={
                (!hasMoreApiData &&
                  currentPage * DISPLAY_PER_PAGE >= allCommits.length) ||
                isFetchingMore
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                (!hasMoreApiData &&
                  currentPage * DISPLAY_PER_PAGE >= allCommits.length) ||
                isFetchingMore
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:text-blue-600 border border-gray-100"
              }`}
            >
              Older <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ContributionPath;
