import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FundDetails = (props) => {
  const { id } = useParams(); // this is the schemeCode from URL
  const [fundData, setFundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false); // NEW

  const handleSave = async () => {
  const token = localStorage.getItem('token');
  if (!token) return navigate('/login');

  try {
    const res = await axios.post(
      'https://mutualfundsearch-backend.onrender.com/api/funds/save',
      {
        schemeCode: id,
        schemeName: fundData.meta.scheme_name,
        fundHouse: fundData.meta.fund_house,
        schemeType: fundData.meta.scheme_type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    props.showAlert("Fund saved successfully", "success");
    setIsSaved(true);
  } catch (err) {
    if (err.response?.status === 409) {
      props.showAlert("Fund already saved", "warning");
      setIsSaved(true);
    } else {
      props.showAlert("Failed to save fund", "danger");
    }
  }
};


  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        const response = await axios.get(`https://api.mfapi.in/mf/${id}`);
        setFundData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fund details:", error);
        setLoading(false);
      }
    };

    fetchFundDetails();
  }, [id]);

  if (loading)
    return <div className="text-center mt-4">Loading fund details...</div>;

  if (!fundData || !fundData.meta)
    return <div className="text-center mt-4">No fund data found.</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{fundData.meta.scheme_name}</h2>
      <p>
        <strong>Fund House:</strong> {fundData.meta.fund_house}
      </p>
      <p>
        <strong>Scheme Type:</strong> {fundData.meta.scheme_type}
      </p>
      <p>
        <strong>Category:</strong> {fundData.meta.scheme_category}
      </p>
      <p>
        <strong>Launch Date:</strong> {fundData.meta.launch_date}
      </p>

      <h4 className="mt-4">Latest NAVs</h4>
      <ul className="list-group">
        {fundData.data.slice(0, 5).map((entry, index) => (
          <li key={index} className="list-group-item">
            <strong>Date:</strong> {entry.date} — <strong>NAV:</strong> ₹
            {entry.nav}
          </li>
        ))}
      </ul>
      <button
        className="btn btn-success my-3"
        onClick={handleSave}
        disabled={isSaved}
      >
        {isSaved ? "Saved" : "Save This Fund"}
      </button>
    </div>
  );
};

export default FundDetails;
