import {useState, useRef, useEffect} from 'react'
import styles from './AudioPlayer.module.css'
import {Icon} from '@teachmint/krayon'
import {milisecondsToTime} from '../../../../../../utils/Helpers'
export default function AudioPlayer({
  audioSource,
  duration,
  onPlay = () => {},
  onPause = () => {},
}) {
  const [trackProgress, setTrackProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [durationId, setDurationId] = useState(null)
  const audioRef = useRef(new Audio(audioSource))
  const intervalRef = useRef()
  const runningTime = useRef(null)

  const startTimer = () => {
    var id = setInterval(() => {
      if (!audioRef.current.ended) {
        if (intervalRef.current.value) {
          intervalRef.current.value = audioRef.current.currentTime * 1000
          runningTime.current.textContent = milisecondsToTime(
            audioRef.current.currentTime * 1000
          )
        }
      } else {
        setIsPlaying(false)
      }
    }, 1)
    setDurationId(id)
  }

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
      startTimer()
    } else {
      audioRef.current.pause()
      clearInterval(durationId)
      intervalRef.current.value = audioRef.current.currentTime * 1000
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      audioRef.current.pause()
    }
  }, [])

  const onScrub = (value) => {
    audioRef.current.currentTime = value / 1000
    setTrackProgress(value)
  }
  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true)
    }
    startTimer()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrop}>
        <div
          className={styles.actionBtn}
          onClick={() => {
            setIsPlaying(!isPlaying)
            isPlaying ? onPause() : onPlay()
          }}
        >
          <Icon
            name={isPlaying ? 'pause1' : 'play1'}
            type="secondary"
            size="xx_s"
          />
        </div>
        <div className={styles.slider}>
          <input
            ref={intervalRef}
            type="range"
            min="0"
            step="10"
            value={trackProgress}
            max={isNaN(duration) ? '10' : `${duration}`}
            className={styles.progress}
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
        </div>
        <div
          ref={runningTime}
          id="audioPlayerDuration"
          className={styles.duration}
        >
          {milisecondsToTime(duration)}
        </div>
      </div>
    </div>
  )
}
