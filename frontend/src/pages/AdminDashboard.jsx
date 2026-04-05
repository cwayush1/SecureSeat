import React, { useState, useEffect } from 'react';
import { backendAPI } from '../services/api';

const AdminDashboard = () => {
    const [stadiums, setStadiums] = useState([]);
    
    // Stadium Form State
    const [stadiumName, setStadiumName] = useState('');
    
    // Match Form State
    const [matchData, setMatchData] = useState({
        team_a: '', team_b: '', stadium_id: '', date: '', price_vip: 5000, price_general: 1500
    });

    useEffect(() => {
        fetchStadiums();
    }, []);

    const fetchStadiums = async () => {
        try {
            const res = await backendAPI.get('/stadiums');
            setStadiums(res.data);
        } catch (error) {
            console.error("Failed to fetch stadiums");
        }
    };

    const handleAddStadium = async (e) => {
        e.preventDefault();
        try {
            // Hardcoding empty layout data for now
            await backendAPI.post('/stadiums', { name: stadiumName, layout_data: {} });
            alert("Stadium added!");
            setStadiumName('');
            fetchStadiums();
        } catch (err) {
            alert("Error adding stadium");
        }
    };

    const handleAddMatch = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                team_a: matchData.team_a,
                team_b: matchData.team_b,
                stadium_id: matchData.stadium_id,
                date: matchData.date,
                pricing_tiers: [
                    { tier: 'VIP', price: matchData.price_vip },
                    { tier: 'General', price: matchData.price_general }
                ]
            };
            await backendAPI.post('/matches', payload);
            alert("Match added successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Error adding match");
        }
    };

    return (
        <div>
            <h2>👑 Admin Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                {/* Stadium Form */}
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>1. Add Stadium</h3>
                    <form onSubmit={handleAddStadium} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Stadium Name" value={stadiumName} onChange={e => setStadiumName(e.target.value)} required className="input-field" />
                        <button type="submit" className="btn-primary">Save Stadium</button>
                    </form>
                </div>

                {/* Match Form */}
                <div style={{ flex: 2, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>2. Create Match</h3>
                    <form onSubmit={handleAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Team A" value={matchData.team_a} onChange={e => setMatchData({...matchData, team_a: e.target.value})} required className="input-field" />
                            <input type="text" placeholder="Team B" value={matchData.team_b} onChange={e => setMatchData({...matchData, team_b: e.target.value})} required className="input-field" />
                        </div>
                        <select value={matchData.stadium_id} onChange={e => setMatchData({...matchData, stadium_id: e.target.value})} required className="input-field">
                            <option value="">Select Stadium</option>
                            {stadiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <input type="datetime-local" value={matchData.date} onChange={e => setMatchData({...matchData, date: e.target.value})} required className="input-field" />
                        
                        <h4>Pricing</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="number" placeholder="VIP Price" value={matchData.price_vip} onChange={e => setMatchData({...matchData, price_vip: e.target.value})} required className="input-field" />
                            <input type="number" placeholder="General Price" value={matchData.price_general} onChange={e => setMatchData({...matchData, price_general: e.target.value})} required className="input-field" />
                        </div>
                        <button type="submit" className="btn-primary">Create Match</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;