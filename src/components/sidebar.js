// src/Sidebar.js
import React, { useEffect, useState } from 'react';
import '../style/sidebar.css';

const Sidebar = ({ onSelectReport, saveCount }) => {
    const [savedReports, setSavedReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/reports');
                const reports = await response.json();
                // console.log('Fetched reports:', reports);
                setSavedReports(reports);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            }
        };

        fetchReports();
    }, [saveCount]);

    return (
        <div className="sidebar">
            <h3>Saved Reports</h3>
            <ul>
                {savedReports.map((report) => (
                    <li key={report.id} onClick={() => onSelectReport(report)}>
                        <p>Patent ID:{report.patent_id} </p>
                        <p>Company Name:{report.company_name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;