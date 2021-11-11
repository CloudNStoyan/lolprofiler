import MatchPlayers from "../MatchPlayer/MatchPlayers";
import MatchScore from "../MatchScore/MatchScore";
import MatchStats from '../MatchStats/MatchStats';
import MatchSetup from "../MatchSetup/MatchSetup";
import MatchInfo from "../MatchInfo/MatchInfo";
import MatchItems from "../MatchItem/MatchItems";
import styles from './MatchWrapper.module.scss';

function MatchWrapper({ matchData, summoner, ddragon, onSearch }) {
    const participant = matchData.info.participants.find(p => p.puuid === summoner.puuid);
    const participants = matchData.info.participants;
    const participantTeam = matchData.info.teams.find(team => team.teamId === participant.teamId);

    return (
        <div className={`${styles.match} ${participantTeam.win ? styles.victory : styles.defeat}`}>
            <MatchInfo matchData={matchData} team={participantTeam} />
            <MatchSetup participant={participant} ddragon={ddragon} />
            <MatchScore participant={participant} participants={participants} />
            <MatchStats matchData={matchData} participant={participant} participants={participants} />
            <MatchItems participant={participant} ddragon={ddragon} />
            <MatchPlayers matchData={matchData} onSearch={onSearch} ddragon={ddragon} />
        </div>
    )
}

export default MatchWrapper;