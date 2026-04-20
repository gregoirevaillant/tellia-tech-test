import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const navItems = [
  { label: 'Voice Note', description: 'Record a voice note', path: '/voice-note' },
  { label: 'Notes', description: 'Browse all saved notes', path: '/notes' },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.path !== '#' && navigate(item.path)}
            className={`${styles.block} ${item.path === '#' ? styles.disabled : ''}`}
          >
            <span className={styles.blockLabel}>{item.label}</span>
            <span className={styles.blockDescription}>{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
