// src/InfringementForm.js
import React, { useState } from "react";
import "../style/infringementForm.css";
import Sidebar from "./sidebar";

const InfringementForm = () => {
  const [patentId, setPatentId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  const [saveCount, setSaveCount] = useState(0); // New state to track save count

  const [selectedReport, setSelectedReport] = useState(null);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patent_id: patentId,
          company_name: companyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      console.log("Analysis result:", data);
      setAnalysis(data);
    } catch (error) {
      console.error("Error during fetch:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/saveReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error("Failed to save the report");
      }

      alert("Report saved successfully!");
      setSaveCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error saving report:", error);
      setError(error.message);
    }
  };

  return (
    <div className="infringement-form-container">
      <Sidebar onSelectReport={handleSelectReport} saveCount={saveCount}/>
      <h2>Patent Infringement Analysis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Patent ID"
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Analyze</button>
      </form>
      {loading && <div className="loading-spinner"></div>} {/* Loading spinner */}
      {error && <div className="error-message">Error: {error}</div>}
      {analysis && (
        <div className="analysis-result">
          <h3>Analysis Result</h3>
          <div className="analysis-summary">
            <p>
              <strong>Analysis ID:</strong> {analysis.analysis_id}
            </p>
            <p>
              <strong>Patent ID:</strong> {analysis.patent_id}
            </p>
            <p>
              <strong>Company Name:</strong> {analysis.company_name}
            </p>
            <p>
              <strong>Analysis Date:</strong> {analysis.analysis_date}
            </p>
            <h4>Top Infringing Products:</h4>
            {analysis.top_infringing_products.map((product, index) => (
              <div key={index} className="product-card">
                <h5>{product.product_name}</h5>
                <p>
                  <strong>Infringement Likelihood:</strong>{" "}
                  {product.infringement_likelihood}
                </p>
                <p>
                  <strong>Relevant Claims:</strong>{" "}
                  {product.relevant_claims.join(", ")}
                </p>
                <p>
                  <strong>Explanation:</strong> {product.explanation}
                </p>
                <p>
                  <strong>Specific Features:</strong>
                </p>
                <ul className="feature-list">
                  {product.specific_features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h4>Overall Risk Assessment:</h4>
            <p>{analysis.overall_risk_assessment}</p>
          </div>
        </div>
      )}
      <button onClick={saveReport} style={{display: analysis ? 'block' :'none'}}>Save Report</button>
      {selectedReport && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeModal}>Close</button>
            <h3>Report Details</h3>
            <p>
              <strong>Analysis ID:</strong> {selectedReport.analysis_id}
            </p>
            <p>
              <strong>Patent ID:</strong> {selectedReport.patent_id}
            </p>
            <p>
              <strong>Company Name:</strong> {selectedReport.company_name}
            </p>
            <p>
              <strong>Analysis Date:</strong> {selectedReport.analysis_date}
            </p>
            <h4>Top Infringing Products:</h4>
            {selectedReport.top_infringing_products.map((product, index) => (
              <div key={index}>
                <h5>{product.product_name}</h5>
                <p>
                  <strong>Infringement Likelihood:</strong>{" "}
                  {product.infringement_likelihood}
                </p>
                <p>
                  <strong>Relevant Claims:</strong>{" "}
                  {product.relevant_claims.join(", ")}
                </p>
                <p>
                  <strong>Explanation:</strong> {product.explanation}
                </p>
                <p>
                  <strong>Specific Features:</strong>
                </p>
                <ul>
                  {product.specific_features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h4>Overall Risk Assessment:</h4>
            <p>{selectedReport.overall_risk_assessment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfringementForm;
