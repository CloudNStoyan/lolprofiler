import styles from './css/Section.module.scss';

function SectionContainer({ children, sectionClass, contentClass, title }) {
    return (
        <div className={`${styles.wrapper} ${sectionClass ? sectionClass : ''}`}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <span className={styles.line} />
            </div>
            <div className={contentClass ? contentClass : undefined}>
                {children}
            </div>
        </div>
    )
}

export default SectionContainer;