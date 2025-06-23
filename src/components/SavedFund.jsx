import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedFundPage = (props) => {
  const [savedFunds, setSavedFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedFunds = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://mutualfundsearch-backend.onrender.com/api/funds/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedFunds(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching saved funds:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (schemeCode) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://mutualfundsearch-backend.onrender.com/api/funds/${schemeCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Remove from UI
      setSavedFunds((prev) =>
        prev.filter((fund) => fund.schemeCode !== schemeCode)
      );

      // ✅ Show success alert
      props.showAlert("Fund deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting fund:", err);
      props.showAlert("Failed to delete fund", "danger");
    }
  };

  useEffect(() => {
    fetchSavedFunds();
  }, []);

  if (loading)
    return <div className="text-center mt-4">Loading saved funds...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Saved Mutual Funds</h2>
      {savedFunds.length === 0 ? (
        <p>You haven't saved any funds yet.</p>
      ) : (
        savedFunds.map((fund) => (
          <div className="card mb-3" key={fund.schemeCode}>
            <div className="card-body">
              <h5 className="card-title">{fund.schemeName}</h5>
              <p className="card-text">
                <strong>Fund House:</strong> {fund.fundHouse} <br />
                <strong>Type:</strong> {fund.schemeType}
              </p>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(fund.schemeCode)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedFundPage;
