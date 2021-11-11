import SectionContainer from '../SectionContainer/SectionContainer';
import FilterMatches from '../FilterMatches/FilterMatches';
import MatchesWinrate from '../MatchesWinrate/MatchesWinrate';
import MasteryChamps from '../MasteryChamp/MasteryChamps';
import MatchesContainer from '../MatchComponents/MatchesContainer/MatchesContainer';
import styles from '../../App.module.scss';

function ProfileMain({ profile, ddragon, onFilterMatches, onSearch, onLoadMore, filterQueueId, setFilterQueueId }) {
    return (
        <div className={styles.main}>
            <div>
                <SectionContainer contentClass={styles.summary}>
                    <FilterMatches onFilter={onFilterMatches} selectValue={filterQueueId} setSelectValue={setFilterQueueId} />
                    <MatchesWinrate profile={profile} />
                </SectionContainer>
                <SectionContainer title="Champion Mastery">
                    <MasteryChamps profile={profile} ddragon={ddragon} />
                </SectionContainer>
                <SectionContainer title="Recent Games">
                    <MatchesContainer profile={profile} ddragon={ddragon} onSearch={onSearch} onLoadMore={onLoadMore} />
                </SectionContainer>
            </div>
        </div>
    )
}

export default ProfileMain;