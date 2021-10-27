import React from 'react';

function SettingsForm({ isOpen, onClose }) {
    return (
        <div className={`settings-form ${isOpen ? 'show' : ''}`}>
            <div>
                <h2 className="settings-form-header">Settings</h2>
                <a onClick={onClose} className="close-btn" href="#"><i className="fas fa-times" /></a>
            </div>
            <div className="settings-form-content">
                <div className="summoner-form">
                    <label className="form-label">Summoner name</label>
                    <input className="form-input summoner-name-input" type="text" />
                </div>
                <a href="#" className="btn save-btn">Save</a>
            </div>
        </div>
    )
}

export default SettingsForm;