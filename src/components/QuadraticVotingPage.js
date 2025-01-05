// src/components/QuadraticVotingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for navigation

const QuadraticVotingPage = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Function to navigate to the homepage
  const goToHomePage = () => {
    navigate('/HomePage');
  };

  return (
    <div 
      style={{
        fontFamily: '"Arial", sans-serif',
        lineHeight: '1.6',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '40px auto',
        color: '#333',
      }}
    >
      <h1 
        style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '20px',
        }}
      >
        Pay 400 and then get the project
      </h1>
      <p 
        style={{
          fontSize: '1.1rem',
          marginBottom: '20px',
        }}
      >
        Kushal Bhadwe
      </p>
      
      <h2 
        style={{
          fontSize: '2rem',
          color: '#34495e',
          marginBottom: '15px',
        }}
      >
        
      </h2>
      <p 
        style={{
          fontSize: '1.1rem',
          marginBottom: '20px',
        }}
      >
        {/* In Quadratic Voting, each voter is given a certain number of credits or "votes." 
        The more votes you want to cast on a single issue, the more costly it becomes. 
        The cost is determined by the square of the number of votes you wish to cast. */}
      </p>
      
      <h3 
        style={{
          fontSize: '1.5rem',
          color: '#2980b9',
          marginBottom: '15px',
        }}
      >
        {/* Example: */}
      </h3>
      <p 
        style={{
          fontSize: '1.1rem',
          marginBottom: '20px',
        }}
      >
        {/* If you want to cast 1 vote, it costs you 1 credit. 
        If you want to cast 2 votes, it will cost you 4 credits (2²). 
        3 votes will cost 9 credits (3²), and so on. */}
      </p>
      
      <p 
        style={{
          fontSize: '1.1rem',
          marginBottom: '30px',
        }}
      >
        {/* This method helps to prevent individuals or groups from overwhelming the voting system with many votes, ensuring that each vote is a more thoughtful and meaningful expression of preference. */}
      </p>

      <button 
        onClick={goToHomePage}
        style={{
          display: 'block',
          margin: '0 auto',
          backgroundColor: '#1abc9c',
          color: '#fff',
          fontSize: '1rem',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#16a085'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#1abc9c'}
      >
        Understood
      </button>
    </div>
  );
};

export default QuadraticVotingPage;
