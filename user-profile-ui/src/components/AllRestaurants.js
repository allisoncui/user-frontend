import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../ProfileDetails.css";

const AllRestaurants = ({ username }) => {
  const restaurants = [
    { name: 'Seoul Salon', code: '69593' },
    { name: 'Tatiana by Kwame Onwuachi', code: '65452' },
    { name: 'Torrisi', code: '64593' },
    { name: 'Double Chicken Please', code: '42534' },
    { name: 'Thirteen Water', code: '59903' },
    { name: 'Thai Diner', code: '49453' },
    { name: 'konban', code: '74850' },
    { name: 'Ariari', code: '65520' },
    { name: 'Theodora', code: '73589' },
    { name: 'Sushi Saikou', code: '82617' },
    { name: 'Shosh', code: '83803' },
    { name: 'Shinzo Omakase', code: '65230' },
    { name: 'Zensushi Omakase', code: '78062' },
    { name: 'Sushi Ichimura', code: '72480' },
    { name: 'Ramen by Ra', code: '79848' },
    { name: 'Kappo Sono', code: '82809' },
    { name: 'Bridges', code: '83681' },
    { name: 'Torch and Crown Beer Garden', code: '71470' },
    { name: 'Westville East', code: '75127' },
    { name: 'Pressoir Wine Events', code: '78910' },
    { name: 'South Soho Bar', code: '77914' },
    { name: 'Nakaji', code: '10163' },
    { name: 'Rosella', code: '65348' },
    { name: 'Kono', code: '58459' },
    { name: 'Foxface Natural', code: '71434' },
    { name: 'Penny', code: '79460' },
    { name: 'Sushi Kai West Village', code: '73264' },
    { name: 'Fuku Omakase', code: '73742' },
    { name: 'Taikun Sushi', code: '50244' },
    { name: 'Sushi Ouji', code: '77859' },
    { name: 'Sushi Lin West Village', code: '73561' },
    { name: 'Yokox Omakase', code: '78791' },
    { name: 'Ito', code: '54504' },
    { name: 'Sushi Lab East Village', code: '61135' },
    { name: 'Sushi Ikumi', code: '40735' },
    { name: 'Hags', code: '59000' },
    { name: 'bar56', code: '70272' },
    { name: 'Sushi Mumi', code: '65819' },
    { name: 'Blue Haven West Village', code: '50804' },
    { name: 'Pearl Street Supper Club', code: '69635' },
    { name: 'Mori', code: '79015' },
    { name: 'Venhue', code: '73281' },
    { name: 'The Broome Hotel', code: '80233' },
    { name: 'Crispy Heaven', code: '77661' },
    { name: 'Noma Events', code: '57543' },
    { name: 'Ushiwakamaru Pop-Up at BBF', code: '81996' },
    { name: 'Petrarca Cucina e Vino', code: '84187' },
    { name: 'Miomio NY', code: '73929' },
    { name: 'Omakase Room by Maaser', code: '82282' },
    { name: 'Morgensterns Finest Ice Cream', code: '53170' },
    { name: 'Chef Mitsuru Tamura at Parcelle', code: '71442' },
    { name: 'Kiwami', code: '83342' },
    { name: 'Tillies', code: '84243' },
    { name: 'Perle NY', code: '83450' },
    { name: 'L\'Artusi', code: '25973' },
  ];

  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch user-viewed restaurants
  const fetchViewedRestaurants = useCallback(async () => {
    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const response = await axios.get(`${restaurantMicroserviceUrl}/user/${username}/viewed_restaurants`);
      const viewedCodes = response.data.viewed_restaurants.map((r) => r.restaurant_code);
      setSelectedRestaurants(viewedCodes);
    } catch (error) {
      console.error("Failed to fetch viewed restaurants:", error);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchViewedRestaurants();
    }
  }, [username, fetchViewedRestaurants]);

  // Handle checkbox changes
  const handleCheckboxChange = async (code) => {
    const isSelected = selectedRestaurants.includes(code);
    const updatedRestaurants = isSelected
      ? selectedRestaurants.filter((c) => c !== code)
      : [...selectedRestaurants, code];

    setSelectedRestaurants(updatedRestaurants);

    try {
      const restaurantMicroserviceUrl = process.env.REACT_APP_RESTAURANT_MICROSERVICE_URL;
      const url = `${restaurantMicroserviceUrl}/user/${username}/viewed_restaurants?restaurant_code=${code}`;

      if (isSelected) {
        await axios.delete(url);
      } else {
        await axios.post(url);
      }
    } catch (error) {
      console.error("Error updating viewed restaurants:", error.response?.data || error.message);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  // **NEW CODE: Pagination logic to display ellipsis for large page numbers**
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftSide = Math.max(1, currentPage - 2);
      const rightSide = Math.min(totalPages, currentPage + 2);

      if (leftSide > 1) pageNumbers.push(1); // Always show first page
      if (leftSide > 2) pageNumbers.push("..."); // Left ellipsis

      for (let i = leftSide; i <= rightSide; i++) {
        pageNumbers.push(i);
      }

      if (rightSide < totalPages - 1) pageNumbers.push("..."); // Right ellipsis
      if (rightSide < totalPages) pageNumbers.push(totalPages); // Always show last page
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    if (typeof pageNumber === "number") {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // Main render
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">All Available Restaurants</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            Items per page:
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded p-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <div className="text-sm">Page {currentPage} of {totalPages}</div>
        </div>
      </div>

      <div className="all-restaurants-container">
        {currentRestaurants.map((restaurant) => (
          <div key={restaurant.code} className="restaurant-item">
            <div className="restaurant-details">
              <span className="restaurant-name">{restaurant.name}</span>
              <span className="restaurant-code">Code: {restaurant.code}</span>
            </div>
            <input
              type="checkbox"
              className="restaurant-checkbox"
              checked={selectedRestaurants.includes(Number(restaurant.code))}
              onChange={() => handleCheckboxChange(Number(restaurant.code))}
            />
          </div>
        ))}
      </div>

      {/* **NEW CODE: Updated pagination buttons with ellipsis display** */}
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-1 border rounded ${
              pageNumber === currentPage ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
            disabled={pageNumber === "..."}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AllRestaurants;
