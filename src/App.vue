<template>
  <div class="container hide">
      <div class="header">
        <div class="header-content">
          <div class="search-wrapper">
            <input class="empty" type="text" id="input-name" spellcheck="false"/>
            <a id="search-btn"><i class="fas fa-search"></i></a>
            <a class="favorite-btn" href="#"><i class="fas fa-star"></i></a>
          </div>
          <div class="right-nav">
            <a class="settings-btn" href="#" alt="Settings"><i class="fas fa-cog"></i></a>
          </div>
        </div>
      </div>
      <div class="aside">
        <h2 class="profile-name"></h2>
        <div class="profile-icon">
          <a href="#" class="spectate-badge"></a>
          <img width="200" height="200" onload="isLoaded(this)"/>
          <div class="profile-footer">
            <div class="profile-level"></div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">
            <span class="section-title">Rank</span>
            <span class="section-line"></span>
          </div>
          <div class="section-content rank-wrapper">
          </div>
        </div>
        <div class="section">
          <div class="section-header">
            <span class="section-title">Recently Played With</span>
            <span class="section-line"></span>
          </div>
          <div class="section-content recently-wrapper">
          </div>
        </div>
      </div>
      <div class="main">
        <div class="profile">
          <div class="section summary-wrapper">
            <div class="section-header">
              <span class="section-title">Summary</span>
              <span class="section-line"></span>
            </div>
            <div class="section-content summary">
              <div class="filter-container">
                <select class="select game-type"></select>
                <a class="btn filter-btn" href="#">Filter</a>
              </div>
              <div class="winratio-container">
                <h4 class="winratio-title">Win/Lose ratio</h4>
                <div class="summary-progress">
                    <div class="progress win">
                        <span></span>
                    </div>
                    <div class="progress lose">
                        <span></span>
                    </div>
                </div>
            </div>
            </div>
          </div>
          <div class="section mastery-wrapper">
            <div class="section-header">
              <span class="section-title">Champion Mastery</span>
              <span class="section-line"></span>
            </div>
            <div class="section-content mastery">
              
            </div>
          </div>
          <div class="section recent-games">
            <div class="section-header">
              <span class="section-title">Recent Games</span>
              <span class="section-line"></span>
            </div>
            <div class="section-content matches-wrapper">
            </div>
          </div>
        </div>
      </div>
      <div class="footer">

      </div>
    </div>
    <div class="settings-form">
      <div>
        <h2 class="settings-form-header">Settings</h2>
        <a class="close-btn" href="#"><i class="fas fa-times"></i></a>
      </div>
       <div class="settings-form-content">
         <div class="summoner-form">
          <label class="form-label">Summoner name</label>
          <input class="form-input summoner-name-input" type="text"/>
         </div>
         <a href="#" class="btn save-btn">Save</a>
      </div>
    </div>
    <div class="toast-container"></div>
    <div class="match-details-container">
      <div class="match-details-header">
        <div class="match-details-header-content"></div>
        <a class="close-btn" href="#"><i class="fas fa-times"></i></a>
      </div>
      <div class="match-details-content"></div>
    </div>
</template>
<script>
//import '../preload.js'
import '../logger.js'
//import '../riotapi.js'
import * as toast from '../toast.js'

console.log(toast.core)
//import '../renderer.js'

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
@import '../styles.css';
</style>
