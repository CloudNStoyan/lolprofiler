function SettingsForm({ isOpen, onClose, summonerName, setSummonerName, localStorageKey }) {
    const handleSave = () => localStorage.setItem(localStorageKey, summonerName);
    return (
        <div className={`settings-form ${isOpen ? 'show' : ''}`}>
            <div>
                <h2 className="settings-form-header">Settings</h2>
                <button onClick={onClose} className="close-btn" href="#"><i className="fas fa-times" /></button>
            </div>
            <div className="settings-form-content">
                <div className="summoner-form">
                    <label className="form-label">Summoner name</label>
                    <input
                        className="form-input summoner-name-input"
                        type="text"
                        value={summonerName}
                        onChange={(e) => setSummonerName(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="btn save-btn">Save</button>
            </div>
        </div>
    )
}

export default SettingsForm;