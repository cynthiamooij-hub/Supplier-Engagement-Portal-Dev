// App — session-only view state machine. All answers live in React state for
// the duration of the browser session and are never persisted or transmitted.
// Refreshing or closing the tab clears everything (Acceptance Criteria 13, 14).

import { useState } from 'react'
import { Page } from './components/Brand.jsx'
import Landing from './components/Landing.jsx'
import DoorChoice from './components/DoorChoice.jsx'
import GuidedForm from './components/GuidedForm.jsx'
import DownloadUpload from './components/DownloadUpload.jsx'
import UploadReview from './components/UploadReview.jsx'
import Confirmation from './components/Confirmation.jsx'

const VIEW = {
  LANDING: 'landing',
  DOOR_CHOICE: 'doorChoice',
  DOOR1: 'door1',
  DOOR2_UPLOAD: 'door2Upload',
  DOOR2_REVIEW: 'door2Review',
  CONFIRMATION: 'confirmation',
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function App() {
  const [view, setView] = useState(VIEW.LANDING)
  const [answers, setAnswers] = useState({}) // session-only
  const [door, setDoor] = useState(null) // 'door1' | 'door2'
  const [uploadFileName, setUploadFileName] = useState('')
  const [submittedAt, setSubmittedAt] = useState('')

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))

  const resetAll = () => {
    setAnswers({})
    setDoor(null)
    setUploadFileName('')
    setSubmittedAt('')
  }

  const goHome = () => {
    resetAll()
    setView(VIEW.LANDING)
    window.scrollTo({ top: 0 })
  }

  const submit = (whichDoor) => {
    setDoor(whichDoor)
    setSubmittedAt(formatDate(new Date()))
    setView(VIEW.CONFIRMATION)
    window.scrollTo({ top: 0 })
  }

  let content
  switch (view) {
    case VIEW.LANDING:
      content = <Landing onStartQuestionnaire={() => setView(VIEW.DOOR_CHOICE)} />
      break
    case VIEW.DOOR_CHOICE:
      content = (
        <DoorChoice
          onDoor1={() => {
            setDoor('door1')
            setView(VIEW.DOOR1)
          }}
          onDoor2={() => {
            setDoor('door2')
            setView(VIEW.DOOR2_UPLOAD)
          }}
          onBack={() => setView(VIEW.LANDING)}
        />
      )
      break
    case VIEW.DOOR1:
      content = (
        <GuidedForm
          answers={answers}
          setAnswer={setAnswer}
          onSubmit={() => submit('door1')}
          onBack={() => setView(VIEW.DOOR_CHOICE)}
        />
      )
      break
    case VIEW.DOOR2_UPLOAD:
      content = (
        <DownloadUpload
          onParsed={(parsed, name) => {
            setAnswers(parsed)
            setUploadFileName(name)
            setView(VIEW.DOOR2_REVIEW)
            window.scrollTo({ top: 0 })
          }}
          onBack={() => setView(VIEW.DOOR_CHOICE)}
        />
      )
      break
    case VIEW.DOOR2_REVIEW:
      content = (
        <UploadReview
          answers={answers}
          fileName={uploadFileName}
          onSubmit={() => submit('door2')}
          onReupload={() => setView(VIEW.DOOR2_UPLOAD)}
          onBack={() => setView(VIEW.DOOR_CHOICE)}
        />
      )
      break
    case VIEW.CONFIRMATION:
      content = (
        <Confirmation answers={answers} door={door} submittedAt={submittedAt} onHome={goHome} />
      )
      break
    default:
      content = <Landing onStartQuestionnaire={() => setView(VIEW.DOOR_CHOICE)} />
  }

  return <Page onHome={goHome}>{content}</Page>
}
