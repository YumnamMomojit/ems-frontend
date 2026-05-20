import React from "react";

/**
 * DashboardSearch Component
 * Optional search component for dashboard header
 * 
 * @param {string} placeholder - Search input placeholder text
 * @param {function} onSearch - Search handler function (receives search query)
 * @param {string} className - Additional CSS classes
 * @param {boolean} isScrolled - Whether the navbar is scrolled (for styling)
 */
const DashboardSearch = ({ placeholder = "Search...", onSearch, className = "", isScrolled = false }) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Debounced search (optional - can be enhanced with useDebounce hook)
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className={`relative hidden sm:block group ${className}`}>
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isScrolled ? 'text-gray-400' : 'text-muted-foreground'}`}>
                <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
                className={`block w-full rounded-lg border-0 py-2 pl-10 shadow-md focus:shadow-lg focus:outline-none sm:text-sm sm:leading-6 relative min-w-[240px] transition-all ${isScrolled
                        ? 'bg-gray-800 text-white placeholder:text-gray-400 font-medium'
                        : 'text-foreground bg-secondary dark:bg-secondary dark:text-foreground placeholder:text-muted-foreground'
                    }`}
                placeholder={placeholder}
                type="text"
                value={searchQuery}
                onChange={handleChange}
            />
        </div>
    );
};

export default DashboardSearch;
