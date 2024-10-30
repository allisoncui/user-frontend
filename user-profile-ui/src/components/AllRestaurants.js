import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllRestaurants = () => {
  const navigate = useNavigate();

  // List of restaurants and their codes
  const restaurants = [
    { name: 'seoul-salon', code: '69593' },
    { name: 'tatiana', code: '65452' },
    { name: 'torrisi', code: '64593' },
    { name: 'double-chicken-please', code: '42534' },
    { name: 'thirteen-water', code: '59903' },
    { name: 'thai-diner', code: '49453' },
    { name: 'konban', code: '74850' },
    { name: 'ariari', code: '65520' },
    { name: 'theodora', code: '73589' },
    { name: 'saikou', code: '82617' },
    { name: 'shosh', code: '83803' },
    { name: 'shinzo-omakase', code: '65230' },
    { name: 'zensushi-omakase', code: '78062' },
    { name: 'sushi-ichimura', code: '72480' },
    { name: 'ramen-by-ra', code: '79848' },
    { name: 'kappo-sono', code: '82809' },
    { name: 'bridges', code: '83681' },
    { name: 'torch-and-crown-beer-garden', code: '71470' },
    { name: 'westville-east', code: '75127' },
    { name: 'pressoir-wine-events', code: '78910' },
    { name: 'south-soho-bar', code: '77914' },
    { name: 'nakaji', code: '10163' },
    { name: 'rosella', code: '65348' },
    { name: 'kono', code: '58459' },
    { name: 'foxface-natural', code: '71434' },
    { name: 'penny', code: '79460' },
    { name: 'sushi-kai-west-village', code: '73264' },
    { name: 'fuku-omakase', code: '73742' },
    { name: 'taikun-sushi', code: '50244' },
    { name: 'sushi-ouji', code: '77859' },
    { name: 'sushi-lin-west-village', code: '73561' },
    { name: 'yokox-omakase', code: '78791' },
    { name: 'ito', code: '54504' },
    { name: 'sushi-lab-east-village', code: '61135' },
    { name: 'sushi-ikumi', code: '40735' },
    { name: 'hags', code: '59000' },
    { name: 'bar56', code: '70272' },
    { name: 'sushi-mumi', code: '65819' },
    { name: 'blue-haven-west-village', code: '50804' },
    { name: 'pearl-street-supper-club', code: '69635' },
    { name: 'mori', code: '79015' },
    { name: 'venhue', code: '73281' },
    { name: 'the-broome-hotel', code: '80233' },
    { name: 'crispy-heaven', code: '77661' },
    { name: 'noma-events', code: '57543' },
    { name: 'ushiwakamaru-pop-up-at-bbf', code: '81996' },
    { name: 'petrarca-cucina-e-vino', code: '84187' },
    { name: 'miomio-ny', code: '73929' },
    { name: 'omakase-room-by-maaser', code: '82282' },
    { name: 'morgensterns-finest-ice-cream', code: '53170' },
    { name: 'chef-mitsuru-tamura-at-parcelle', code: '71442' },
    { name: 'kiwami', code: '83342' },
    { name: 'tillies', code: '84243' },
    { name: 'perle-ny', code: '83450' },
    { name: 'lartusi-ny', code: '25973' },
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
