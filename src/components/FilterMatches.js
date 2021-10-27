import utils from "../utils"

function FilterMatches() {
    return (
        <select className="select game-type">
            {utils.constants.queues.filter(q => q.showInSelect).map(q => <option>{q.name}</option>)}
        </select>
    )
}

export default FilterMatches;