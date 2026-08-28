"use client"

import { useEffect, useState } from "react";
import MagnifierIcon from "../ui/magnifier-icon";
import SlidersHorizontalIcon from "../ui/sliders-horizontal-icon";


export default function FilterSection({ genres = [], languages = [], placeholder }) {
    // initialize state for filter values
    const [filters, setFilters] = useState({
        genre: "",
        year: "",
        rating: "",
        language: "",
        sortBy: "",
        query: "",
    });

    //sync filter state with URL query parameters on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setFilters((prev) => ({
            ...prev,
            genre: params.get("genre") || "",
            year: params.get("year") || "",
            rating: params.get("rating") || "",
            language: params.get("language") || "",
            sortBy: params.get("sortBy") || "",
            query: params.get("query") || "",
        }))
    }, []) //empty dependency array to run once on mount

    // handle changes to filter inputs and update state
    const handleChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({ ...prev, [name]: value })) //update specific filter field 
    };

    //handle search button click to update URL with filters values
    const handleSearch = () => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value) // add non-empty filters value to URL 
        })
        params.set("page", "1"); //reset to page 1 for new filter results
        window.history.pushState({}, "", `?${params}`); //update URL without reload
    };

    //define static filter options for years,rating and sortBy
    const filterOptions = {
        years: ["2026", "2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
        rating: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
        sortBy: [
            { label: "Most Popular", value: "popularity.desc" },
            { label: "Newest", value: "release_date.desc" },
            { label: "Oldest", value: "release_date.asc" },
            { label: "Top Rated", value: "vote_average.desc" },
        ],
    };

    // create reusable dropdown component for filter selections
    function Dropdown({ label, name, value, onChange, options }) {

        return (
            <div>
                <label className="block mb-2 ml-1 text-sm">{label}</label>
                <select name={name} value={value} onChange={onChange} className="bg-[#252525] rounded-md px-3 py-2 text-white w-full">
                    <option value="">All</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }


    //render filter UI with search input and dropdowns
    return (
        <section className="bg-black text-white py-6 mt-20">
            <div className="px-4 md:px-10 xl:px-36">
                <div className="mb-6">
                    <label className="block mb-2 ml-1 text-lg font-extrabold text-teal-400 " htmlFor="search">
                        <span className="flex items-center gap-1.5">Filter {placeholder.slice(6,)} <SlidersHorizontalIcon /></span>
                    </label>
                    <input type="text" name="query" placeholder={placeholder} id="search" autoComplete="off" value={filters.query} onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#252525] text-sm text-white placeholder-white rounded-xl focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4" >
                    {/* genre Dropdown */}
                    <Dropdown label="Genre" name="genre" value={filters.genre} onChange={handleChange} options={genres.map((g) => ({ label: g.name, value: g.id }))} />

                    {/* year Dropdown */}
                    <Dropdown label="Year" name="year" value={filters.year} onChange={handleChange} options={filterOptions.years.map((y) => ({ label: y, value: y }))} />

                    {/* rating Dropdown */}
                    <Dropdown label="Rating" name="rating" value={filters.rating} onChange={handleChange} options={filterOptions.rating.map((r) => ({ label: `${r}+`, value: r }))} />

                    {/* language Dropdown */}
                    <Dropdown label="Language" name="language" value={filters.language} onChange={handleChange} options={languages.map((l) => ({ label: l.english_name, value: l.iso_639_1 }))} />

                    {/* sort by Dropdown */}
                    <Dropdown label="Sort By" name="sortBy" value={filters.sortBy} onChange={handleChange} options={filterOptions.sortBy} />

                    {/* search button */}
                    <div className="flex items-end">
                        <button onClick={handleSearch}
                            className="bg-yellow-400 text-black font-semibold w-full text-base px-4 py-1.5 rounded-md hover:bg-yellow-500 transition">
                            <span className="flex items-center gap-1 justify-center">Search <MagnifierIcon /> </span>
                        </button>
                    </div>

                </div>
            </div>
        </section>
    )


}