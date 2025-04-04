import React, { useState, useEffect } from 'react';
import './App.css';
import manCityLogo from './assets/manchester-city-logo-png-transparent.png';
import chelseaLogo from './assets/Chelsea_FC.svg.webp';
import newcastleLogo from './assets/Newcastle_United_Logo.svg.png';
import forestLogo from './assets/nottingham-forest-fc-logo-png-transparent.png';

const teams = [
  {
    name: "Chelsea",
    currentPoints: 52,
    goalDifference: 17,
    fixtures: [
      { opponent: "GW31: Brentford", venue: "Away", result: "" },
      { opponent: "GW32: Ipswich Town", venue: "Home", result: "" },
      { opponent: "GW33: Fulham", venue: "Away", result: "" },
      { opponent: "GW34: Everton", venue: "Home", result: "" },
      { opponent: "GW35: Liverpool", venue: "Home", result: "" },
      { opponent: "GW36: Newcastle United", venue: "Away", result: "" },
      { opponent: "GW37: Manchester United", venue: "Home", result: "" },
      { opponent: "GW38: Nottingham Forest", venue: "Away", result: "" },
    ],
  },
  {
    name: "Nottingham Forest",
    currentPoints: 57,
    goalDifference: 15,
    fixtures: [
      { opponent: "GW31: Aston Villa", venue: "Away", result: "" },
      { opponent: "GW32: Everton", venue: "Home", result: "" },
      { opponent: "GW33: Tottenham Hotspur", venue: "Away", result: "" },
      { opponent: "GW34: Brentford", venue: "Home", result: "" },
      { opponent: "GW35: Crystal Palace", venue: "Away", result: "" },
      { opponent: "GW36: Leicester City", venue: "Home", result: "" },
      { opponent: "GW37: West Ham United", venue: "Away", result: "" },
      { opponent: "GW38: Chelsea", venue: "Home", result: "" },
    ],
  },
  {
    name: "Manchester City",
    currentPoints: 51,
    goalDifference: 17,
    fixtures: [
      { opponent: "GW31: Manchester United", venue: "Away", result: "" },
      { opponent: "GW32: Crystal Palace", venue: "Home", result: "" },
      { opponent: "GW33: Everton", venue: "Away", result: "" },
      { opponent: "GW34: Aston Villa", venue: "Home", result: "" },
      { opponent: "GW35: Wolverhampton Wanderers", venue: "Home", result: "" },
      { opponent: "GW36: Southampton", venue: "Away", result: "" },
      { opponent: "GW37: AFC Bournemouth", venue: "Home", result: "" },
      { opponent: "GW38: Fulham", venue: "Away", result: "" },
    ],
  },
  {
    name: "Newcastle United",
    currentPoints: 50,
    goalDifference: 10,
    fixtures: [
      { opponent: "GW31: Leicester City", venue: "Away", result: "" },
      { opponent: "GW32: Manchester United", venue: "Home", result: "" },
      { opponent: "GW32: Crystal Palace", venue: "Home", result: "" },
      { opponent: "GW33: Aston Villa", venue: "Away", result: "" },
      { opponent: "GW34: Ipswich Town", venue: "Home", result: "" },
      { opponent: "GW35: Brighton and Hove Albion", venue: "Away", result: "" },
      { opponent: "GW36: Chelsea", venue: "Home", result: "" },
      { opponent: "GW37: Arsenal", venue: "Away", result: "" },
      { opponent: "GW38: Everton", venue: "Home", result: "" },
    ],
  },
];

// Simple Modal Component
function Modal({ children, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}>
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {children}
        <button onClick={onClose} style={{
          marginTop: '20px',
          alignSelf: 'flex-end',
          padding: '5px 10px',
          background: 'lightgrey',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>Close</button>
      </div>
    </div>
  );
}

const FixturePrediction = () => {
  const getButtonStyle = (isPredicted, result) => ({
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '20px',
    cursor: 'pointer',
    backgroundColor: isPredicted ? {
      win: 'green',
      draw: 'yellow',
      lose: 'red',
    }[result] : 'lightgrey',
    color: 'black',
    border: 'none',
    fontFamily: "'Bebas Neue', sans-serif", // Add Bebas Neue font
  });

  const [teamsData, setTeamsData] = useState(teams.map(team => ({
    ...team,
    originalPoints: team.currentPoints,
    fixtures: team.fixtures.map(fixture => ({
      ...fixture,
      result: ""
    })),
  })));

  const [rankingMessage, setRankingMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const allPredicted = teamsData.every(team => team.fixtures.every(fixture => fixture.result));
    if (allPredicted) {
      // Sort teams by points (descending) and then by goal difference (descending)
      const sortedTeams = [...teamsData].sort((a, b) => b.currentPoints - a.currentPoints || b.goalDifference - a.goalDifference);

      // Assign rankings based on sorted order
      const rankings = sortedTeams.map((team, index) => {
        let position = index + 3; // Start ranking from 3rd place
        let qualification;
        if (position === 3 || position === 4 || position === 5) {
          qualification = "Champions League";
        } else if (position === 6) {
          qualification = "Europa League";
        } else if (position === 7) {
          qualification = "Conference League";
        }
        return `${position}. ${team.name} - ${team.currentPoints} Points (${qualification})`;
      });

      setRankingMessage(rankings.join('\n'));
      setIsModalOpen(true);
    }
  }, [teamsData]);

  const updatePointsAndResult = (teamName, fixtureIndex, newResult) => {
    setTeamsData(teamsData.map(team => {
      if (team.name === teamName) {
        const newFixtures = [...team.fixtures];
        newFixtures[fixtureIndex] = { ...newFixtures[fixtureIndex], result: newResult };

        const pointsFromPredictions = newFixtures.reduce((acc, fixture) => {
          if (fixture.result === 'win') return acc + 3;
          if (fixture.result === 'draw') return acc + 1;
          return acc;
        }, 0);

        return { ...team, fixtures: newFixtures, currentPoints: pointsFromPredictions + team.originalPoints };
      }
      return team;
    }));
  };

  const resetPredictions = () => {
    const resetTeamsData = teamsData.map(team => {
      const resetFixtures = team.fixtures.map(fixture => ({
        ...fixture,
        result: ""
      }));

      let resetPoints = team.currentPoints;
      if (team.name === "Manchester City") resetPoints = 47;
      else if (team.name === "Chelsea") resetPoints = 49;
      else if (team.name === "Newcastle United") resetPoints = 44;
      else if (team.name === "Nottingham Forest") resetPoints = 51;

      return {
        ...team,
        fixtures: resetFixtures,
        currentPoints: resetPoints
      };
    });
    setTeamsData(resetTeamsData);
    setRankingMessage('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={resetPredictions}
        style={{
          position: 'absolute',
          top: '3%',
          left: '18%',
          transform: 'translate(-50%, -50%)',
          padding: '5px 10px',
          fontSize: '10px',
          cursor: 'pointer',
          borderRadius: '15px',
          zIndex: 1000,
          backgroundColor: '#bad1c2',
          color: 'black',
          border: 'none',
          fontWeight: "bold",
          fontFamily: "'Bebas Neue', sans-serif", // Add Bebas Neue font
        }}>
        RESET PREDICTIONS
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
  {teamsData.map((team, index) => (
    <div key={index} style={{ margin: 20, textAlign: 'center' }}>
      {team.name === "Manchester City" && (
        <img src={manCityLogo} alt="Manchester City Logo" style={{ maxWidth: '250px', marginBottom: '10px', marginTop: '17px' }} />
      )}
      {team.name === "Chelsea" && (
        <img src={chelseaLogo} alt="Chelsea Logo" style={{ maxWidth: '250px', marginBottom: '10px', marginTop: '17px' }} />
      )}
      {team.name === "Newcastle United" && (
        <img src={newcastleLogo} alt="Newcastle United Logo" style={{ maxWidth: '250px', marginBottom: '10px', marginTop: '17px' }} />
      )}
      {team.name === "Nottingham Forest" && (
        <img src={forestLogo} alt="Nottingham Forest Logo" style={{ maxWidth: '250px', marginBottom: '10px', marginTop: '17px' }} />
      )}
      <h2>
              <span style={
                team.name === "Nottingham Forest" ? { color: '#da1515' } :
                  team.name === "Chelsea" ? { color: 'mediumblue' } :
                    team.name === "Manchester City" ? { color: 'dodgerblue' } :
                      team.name === "Newcastle United" ? { color: 'black' } : null
              }>
                {team.name}
              </span> &nbsp;- {team.currentPoints} Points
            </h2>
            {team.fixtures.map((fixture, fIndex) => (
              <div key={fIndex} style={{ marginBottom: 10 }}>
                <p className="bold-text">{fixture.opponent} ({fixture.venue})</p>
                {['win', 'draw', 'lose'].map(result => (
                  <button
                    key={result}
                    style={getButtonStyle(fixture.result === result, result)}
                    onClick={() => updatePointsAndResult(team.name, fIndex, result)}
                  >
                    {result.charAt(0).toUpperCase() + result.slice(1)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <div style={{ fontSize: '20px', color: 'black', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Make sure to follow <span style={{ color: 'blue' }}>@flameosumeet</span> on Twitter! Here are your final predictions!
      </h2>
      {rankingMessage}
    </div>
  </Modal>
)}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/whitelogo.png" alt="Predictor Logo" style={{ width: '50px', height: 'auto', verticalAlign: 'middle', marginTop: '10px', marginBottom: '10px', marginRight: '-20px' }} />
        <h1 style={{ display: 'inline', marginLeft: '10px', marginBottom: '15px', verticalAlign: 'middle' }}>FLAMEO PREDICTOR</h1>
        <h6 style={{ display: 'inline', marginLeft: '10px', marginBottom: '15px', marginTop: '5px', verticalAlign: 'middle' }}>THE RACE FOR EUROPE!</h6>
      </header>
      {/* New Button */}
      <button
        style={{
          position: 'absolute',
          top: '3%',
          right: '15%',
          transform: 'translate(50%, -50%)',
          padding: '5px 10px',
          fontSize: '10px',
          cursor: 'pointer',
          borderRadius: '15px',
          zIndex: 1000,
          backgroundColor: '#bad1c2',
          color: 'black',
          border: 'none',
          fontWeight: 'bold',
          fontFamily: "'Bebas Neue', sans-serif", // Add Bebas Neue font
        }}
      >
        @FLAMEOSUMEET
      </button>
      <FixturePrediction />
    </div>
  );
}

export default App;
