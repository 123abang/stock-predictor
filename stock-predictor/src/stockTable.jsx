import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockChart from '../src/stockChart';  // Make sure this path is correct and StockChart is implemented

const StockTable = () => {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [stockDetails, setStockDetails] = useState(null);

    // Fetch list of stocks when component mounts
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/stocks');
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };
        fetchStocks();
    }, []);

    // Filter stocks based on search input
    const filteredStocks = stocks.filter(stock =>
        stock.T.toLowerCase().includes(search.toLowerCase())
    );

    // Fetch selected stock's data when a row is clicked
    const handleRowClick = async (ticker) => {
        try {
            // Fetch stock details
            const detailResponse = await axios.get(`http://127.0.0.1:5000/api/stock/${ticker}/details`);
            setStockDetails(detailResponse.data);

            // Fetch stock chart data
            const chartResponse = await axios.get(`http://127.0.0.1:5000/api/stock/${ticker}`);
            setSelectedStock(chartResponse.data);
        } catch (error) {
            console.error('Error fetching stock details or chart data:', error);
        }
    };

    // Render up/down arrow based on price comparison
    const renderArrow = (currentPrice, previousClose) => {
        if (!currentPrice || !previousClose) return null;

        return currentPrice > previousClose ? (
            <span style={{ color: 'green', fontSize: '18px' }}>▲</span>  // Green up arrow
        ) : (
            <span style={{ color: 'red', fontSize: '18px' }}>▼</span>  // Red down arrow
        );
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            {/* Inform the user about the date range */}
            <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', marginBottom: '20px' }}>
                Stock data is from January 1, 2023, to December 31, 2023.
            </p>

            {/* Search input */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="Search stocks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        width: '300px',
                        borderRadius: '25px',
                        border: '2px solid #ccc',
                        fontSize: '16px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                    }}
                />
            </div>

            {/* Stocks Table */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: '#fff',
                overflow: 'hidden',
            }}>
                <thead>
                    <tr style={{
                        backgroundColor: '#f4f4f9',
                        color: '#333',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        borderBottom: '2px solid #ddd',
                    }}>
                        <th style={{ padding: '15px 20px' }}>Company</th>  {/* Add Company Name Column */}
                        <th style={{ padding: '15px 20px' }}>Ticker</th>
                        <th style={{ padding: '15px 20px' }}>Price</th>
                        <th style={{ padding: '15px 20px' }}>Volume</th>
                        <th style={{ padding: '15px 20px' }}>Open</th>
                        <th style={{ padding: '15px 20px' }}>Close</th>
                        <th style={{ padding: '15px 20px' }}>High</th>
                        <th style={{ padding: '15px 20px' }}>Low</th>
                        <th style={{ padding: '15px 20px' }}>Change</th> {/* Column for the arrow icon */}
                    </tr>
                </thead>
                <tbody>
                    {filteredStocks.map((stock, index) => (
                        <tr
                            key={index}
                            onClick={() => handleRowClick(stock.T)}
                            style={{
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <td style={{ padding: '12px 20px' }}>{stock.companyName}</td>  {/* Display the company name */}
                            <td style={{ padding: '12px 20px' }}>{stock.T}</td>  {/* Display the ticker */}
                            <td style={{ padding: '12px 20px' }}>{`$${stock.c.toFixed(2)}`}</td> {/* Add $ and format price */}
                            <td style={{ padding: '12px 20px' }}>{stock.v}</td>
                            <td style={{ padding: '12px 20px' }}>{stock.o}</td>
                            <td style={{ padding: '12px 20px' }}>{stock.c}</td>
                            <td style={{ padding: '12px 20px' }}>{stock.h}</td>
                            <td style={{ padding: '12px 20px' }}>{stock.l}</td>
                            <td style={{ padding: '12px 20px' }}>
                                {renderArrow(stock.c, stock.o)} {/* Show up/down arrow */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Stock Chart for selected stock */}
            {selectedStock && (
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{selectedStock.ticker} Stock Chart</h3>
                    <StockChart stockData={selectedStock.data} />
                </div>
            )}

            {/* Stock Details */}
            {stockDetails && (
                <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>{stockDetails.name} ({stockDetails.ticker})</h3>
                    <p><strong>Industry:</strong> {stockDetails.industry}</p>
                    <p><strong>Sector:</strong> {stockDetails.sector}</p>
                    <p><strong>Market Cap:</strong> {stockDetails.market_cap}</p>
                    <p><strong>Employees:</strong> {stockDetails.employees}</p>
                    <p><strong>Description:</strong> {stockDetails.description}</p>
                </div>
            )}
        </div>
    );
};

export default StockTable;
