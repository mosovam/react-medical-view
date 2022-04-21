import React from 'react'
import dynamic from "next/dynamic";

const CornerstoneViewport = dynamic(
    () => import('../cornerstone/components/Cornerstone-View'),
    {ssr: false}
)

const MainApp = () => {
    return (
        <div>
            <h2>Cornerstone React Component Example</h2>
            <CornerstoneViewport/>
        </div>
    )
}

export default MainApp
