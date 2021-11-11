import { useState } from 'react';
import styles from './Tooltip.module.scss';

function Tooltip({ content, moreInfo = false, children, className }) {
    const [active, setActive] = useState(false);

    return (
        <div
            className={`${className ? className : ''} ${styles.wrapper}`}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            {children}
            {
                active &&
                <div
                    className={styles.content}
                >
                    {content}
                    {moreInfo &&
                        <div className={styles.more}>Click for more info...</div>
                    }
                </div>
            }
        </div>
    )
}

export default Tooltip;