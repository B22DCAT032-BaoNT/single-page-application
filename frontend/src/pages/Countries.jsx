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



    return (
        <div>
            <h2>All Countries</h2>
            <ul>
                {countries.map((country) => (
                    <li key={country.name.common}>
                        <h3>{country.name.common}</h3>
                        <p>Capital: {country.capital}</p>
                        <p>Population: {country.population.toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}