import dynamic from "next/dynamic";

// use dynamic import because of 'Cornerstone' library
const MainApp = dynamic(
    () => import('../components/MainApp'),
    {ssr: false}
)

const IndexPage = () => (
    <MainApp/>
)

export default IndexPage
