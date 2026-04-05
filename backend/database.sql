CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'User' CHECK (role IN ('User', 'Admin', 'Security')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: Defines the physical stadium
CREATE TABLE Stadiums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    layout_data JSONB -- Stores the 2D/3D mapping data for the frontend
);

CREATE TABLE Matches (
    id SERIAL PRIMARY KEY,
    team_a VARCHAR(100) NOT NULL,
    team_b VARCHAR(100) NOT NULL,
    stadium_id INT REFERENCES Stadiums(id),
    date TIMESTAMP NOT NULL
);

-- NEW: The Pricing Engine! Maps seat tiers to specific matches
CREATE TABLE Match_Pricing (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES Matches(id) ON DELETE CASCADE,
    tier_name VARCHAR(50) NOT NULL, -- e.g., 'VIP', 'General', 'Premium'
    price DECIMAL(10, 2) NOT NULL
);

-- UPDATED: Tickets now reference the tier so we know how much they paid
CREATE TABLE Tickets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    match_id INT REFERENCES Matches(id),
    seat_id VARCHAR(50) NOT NULL, -- e.g., 'A-12'
    tier_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Locked' CHECK (status IN ('Locked', 'Booked', 'Cancelled')),
    face_embedding vector(128), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, seat_id) 
);