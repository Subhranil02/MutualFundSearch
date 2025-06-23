import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchFunds = () => {
  const [allFunds, setAllFunds] = useState([]);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // ✅ NEW

  // Fetch fund list
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await axios.get("https://api.mfapi.in/mf");
        setAllFunds(res.data);
        setLoading(false); // Keep loader 1s
      } catch (err) {
        console.error("Failed to fetch funds", err);
        setLoading(false);
      }
    };
    fetchFunds();
  }, []);

  // Filter based on search query
  useEffect(() => {
    const results = allFunds.filter((fund) =>
      fund.schemeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFunds(results);
    setVisibleCount(10); // Reset display count
  }, [query, allFunds]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom && visibleCount < filteredFunds.length) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setLoadingMore(false);
        }, 1000);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredFunds]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Search Mutual Funds</h2>

      {/* 🔍 Search Bar + Suggestions */}
      <div className="d-flex justify-content-center position-relative">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Type fund name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true); // Show suggestions
          }}
        />

        {/* 💡 Suggestions List */}
        {query && showSuggestions && filteredFunds.length > 0 && (
          <div
            className="list-group position-absolute w-50"
            style={{ top: "100%", zIndex: 10 }}
          >
            {filteredFunds.slice(0, 5).map((fund) => (
              <button
                key={fund.schemeCode}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setQuery(fund.schemeName);
                  setShowSuggestions(false); // Hide after select
                }}
              >
                {fund.schemeName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ⏳ Initial Loader */}
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="mt-4">
          {filteredFunds.length > 0 ? (
            filteredFunds.slice(0, visibleCount).map((fund) => (
              <div className="card mb-3" key={fund.schemeCode}>
                <div className="card-body">
                  <h5 className="card-title">{fund.schemeName}</h5>
                  <p className="card-text">Scheme Code: {fund.schemeCode}</p>
                  <a
                    href={`/mf/${fund.schemeCode}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))
          ) : query ? (
            <p className="text-center mt-3">No results found.</p>
          ) : null}

          {/* ⏳ Scroll Loader */}
          {loadingMore && (
            <div className="text-center mb-4">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFunds;
