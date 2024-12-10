import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllRestaurants = () => {
  const navigate = useNavigate();

  // List of restaurants and their codes
  const restaurants = [
    { name: 'Seoul Salon', code: '69593' },
    { name: 'Tatiana by Kwame Onuachi', code: '65452' },
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

  // Handle checkbox change event
  const handleCheckboxChange = (code) => {
    setSelectedRestaurants((prevSelected) =>
      prevSelected.includes(code)
        ? prevSelected.filter((c) => c !== code) // Uncheck
        : [...prevSelected, code] // Check
    );
  };

  // Function to navigate back to home
  const handleReturnToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>All Available Restaurants</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.code} style={{ display: 'flex', alignItems: 'center' }}>
            <span>{restaurant.name}</span>
            <input
              type="checkbox"
              style={{ marginLeft: '10px' }}
              checked={selectedRestaurants.includes(restaurant.code)}
              onChange={() => handleCheckboxChange(restaurant.code)}
            />
          </div>
        ))}
      </div>

      {/* Return to Home Button */}
      <button style={{ marginTop: '20px' }} onClick={handleReturnToHome}>
        Return to Home
      </button>
    </div>
  );
};

export default AllRestaurants;
