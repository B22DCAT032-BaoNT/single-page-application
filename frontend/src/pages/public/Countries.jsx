import { useEffect, useState } from "react";
import React from "react";
export default function Countries() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountries(data);

            }
            catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }

        }
        fetchCountries();

    }, []);

    if (loading) {
        return <div className="loading-container">Loading countries...</div>;
    }

    if (error) {
        return <div className="error-container">Error loading countries: {error.message}</div>;
    }

    return (
        <div className="page-container">
            <h2 className="text-center mb-24">All Countries</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {countries.map((country) => (
                    <div key={country.name.common} className="card card--compact">
                        <h3 className="mb-16">{country.name.common}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Capital: {country.capital}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>Population: {country.population.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}