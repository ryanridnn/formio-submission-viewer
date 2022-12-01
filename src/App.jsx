import { useState } from 'react'
import Tab from './components/Tab'
import { FormBuilder, FormRenderer } from './components/Forms'
import defaultSchema from './components/Forms/data/schema'

import './App.css'
import "formiojs/dist/formio.full.min.css";
import './styles/Didge.scss'

const rootTabs = {
  Builder: 'Builder',
  Viewer: 'Viewer',
}

const tabTitles = Object.values(rootTabs)

function App() {
  const [tab, setTab] = useState(() => rootTabs.Builder)
  const [schema, setSchema] = useState(() => defaultSchema)

  return (
    <div className="container text-white">
      <h1 className="text-2xl mt-4 text-center font-heading font-semibold">Submission Viewer and PDF Export Test</h1>
      <div className="bg-lightNavy min-w-full p-4 mt-6 rounded-3xl">
        <div className="flex justify-center">
          <Tab titles={tabTitles} currentTab={tab} setCurrentTab={setTab} />
        </div>
        <div className="my-5">
          { tab === rootTabs.Builder ?
            (<FormBuilder schema={schema} setSchema={setSchema}/>) :
            (<FormRenderer schema={schema} />) 
          }
        </div>
      </div>
    </div>
  )
}

export default App
